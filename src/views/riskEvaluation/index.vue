<template>
  <div class="risk-evaluation-page">
    <!-- 风险概览与地图并排展示，左侧面板收起后地图自动扩展。 -->
    <section class="map-area" :class="{ 'is-left-collapsed': leftCollapsed }" aria-label="地图区域">
      <MarsMap
        ref="marsMapRef"
        @onload="handleMapLoaded"
        @risk-point-position="handleRiskPointPosition"
      >
        <template #overlay>
          <RiskSlopeMapPopup
            :visible="Boolean(selectedSlope && riskPointPosition)"
            :slope="selectedSlope || {}"
            :position="riskPointPosition"
            @close="closeSlopePopup"
            @risk-analysis="openRiskAnalysis"
          />
        </template>
      </MarsMap>

      <MapOverlayControls
        @zoom-in="marsMapRef?.handleZoomIn()"
        @zoom-out="marsMapRef?.handleZoomOut()"
        @locate-home="marsMapRef?.flyToHome()"
        @change-base-map="marsMapRef?.changeBaseMap($event)"
        @toggle-imagery-label="marsMapRef?.toggleImageryLabel($event)"
      />

      <div class="left-panel-wrapper" :class="{ 'is-collapsed': leftCollapsed }">
        <div class="left-panel-stack" :class="{ 'is-collapsed': leftCollapsed }">
          <RiskOverviewPanel
            class="stack-panel overview-panel-layer"
            @show-detail="showSlopeList"
            @open-risk-report="openRiskReport"
          />
          <RiskSlopePanel
            class="stack-panel slope-panel-layer"
            :class="{ 'is-visible': panelMode === 'slope-list' }"
            @back="showOverview"
            @locate="handleSlopeLocate"
            @risk-analysis="openRiskAnalysis"
          />
        </div>
      </div>

      <RiskAnalysisAgent :visible="riskAnalysisVisible" :slope="selectedSlope || {}" @close="riskAnalysisVisible = false" />
      <RiskReportAgent :visible="riskReportVisible" @close="riskReportVisible = false" @complete="openDynamicRiskReport" />

    </section>

    <!-- 概览面板展开/收起按钮：置于 map-area 外层，避免被地图容器裁切，使按钮在收起时可居中跨越分界线 -->
    <button
      class="collapse-trigger left-trigger"
      :class="{ 'is-collapsed': leftCollapsed }"
      :title="leftCollapsed ? `展开${activePanelName}` : `收起${activePanelName}`"
      @click="toggleLeftCollapse"
    >
      <img :src="leftCollapsed ? rightArrow : leftArrow" alt="" />
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import MarsMap from '@/components/MarsMap/index.vue'
import MapOverlayControls from '@/components/MapOverlayControls/index.vue'
import RiskOverviewPanel from '@/components/RiskOverviewPanel/index.vue'
import RiskSlopePanel from '@/components/RiskSlopePanel/index.vue'
import RiskSlopeMapPopup from '@/components/RiskSlopeMapPopup/index.vue'
import RiskAnalysisAgent from '@/components/RiskAnalysisAgent/index.vue'
import RiskReportAgent from '@/components/RiskReportAgent/index.vue'
import leftArrow from '@/assets/imgs/left-arr.png'
import rightArrow from '@/assets/imgs/right-arr.png'

const leftCollapsed = ref(false)
const panelMode = ref('overview')
const marsMapRef = ref(null)
const selectedSlope = ref(null)
const riskPointPosition = ref(null)
const riskAnalysisVisible = ref(false)
const riskReportVisible = ref(false)
const router = useRouter()

const activePanelName = computed(() => panelMode.value === 'slope-list' ? '风险斜坡列表' : '风险概览')


const toggleLeftCollapse = () => {
  leftCollapsed.value = !leftCollapsed.value
}

const showSlopeList = () => {
  leftCollapsed.value = false
  panelMode.value = 'slope-list'
}

const showOverview = () => {
  panelMode.value = 'overview'
  closeSlopePopup()
}

const handleSlopeLocate = (slope) => {
  const lng = Number(slope.lng)
  const lat = Number(slope.lat)
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    closeSlopePopup()
    ElMessage.warning('当前风险斜坡暂无点位坐标')
    return
  }

  selectedSlope.value = slope
  riskPointPosition.value = null
  marsMapRef.value?.showRiskPoint({ lng, lat, alt: Number(slope.alt) || 0 })
}

const closeSlopePopup = () => {
  selectedSlope.value = null
  riskPointPosition.value = null
  marsMapRef.value?.clearRiskPoint()
}

const openRiskAnalysis = (slope) => {
  if (slope) selectedSlope.value = slope
  riskAnalysisVisible.value = true
}

const openRiskReport = () => {
  riskAnalysisVisible.value = false
  riskReportVisible.value = true
}

const openDynamicRiskReport = () => {
  riskReportVisible.value = false
  router.push({ name: 'DynamicRiskReport' })
}

const handleRiskPointPosition = (position) => {
  if (!position) {
    riskPointPosition.value = null
    return
  }
  riskPointPosition.value = position
}

const handleMapLoaded = ({ map, viewer }) => {
  console.log('Mars3D 地图初始化就绪', map, viewer)
}</script>

<style lang="less" scoped>
// 仅将数字及常用数字标点映射为阿里妈妈方圆体，中文继续使用全局字体。
@font-face {
  font-family: 'Risk Number';
  src: url('@/assets/font/AlimamaFangYuanTiVF-Thin.ttf') format('truetype');
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  unicode-range: U+0025, U+002C-002E, U+0030-003A;
}

.risk-evaluation-page {
  position: relative;
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  max-height: 100%;
  min-height: 100%;
  display: flex;
  overflow: visible;
  box-sizing: border-box;
  padding: 0;
  background: transparent;
  font-family: 'Risk Number', 'AlibabaPuHuiTi', sans-serif;
}

.risk-evaluation-page :deep(input) {
  font-family: 'Risk Number', 'AlibabaPuHuiTi', sans-serif;
}

/* 左侧面板与地图并排展示，二者保留 12px 间距。 */
.map-area {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  height: 100%;
  min-height: 100%;
  padding-left: 472px;
  background: transparent;
  overflow: visible;
  box-sizing: border-box;
  transform: translateZ(0);
  isolation: isolate;
  transition: padding-left 0.28s cubic-bezier(0.4, 0, 0.2, 1);

  &.is-left-collapsed {
    padding-left: 0;
  }
}

/* 左侧面板裁剪容器：严格约束在 x >= 0 范围，彻底防止向左滑动收起时溢出覆盖菜单栏 */
.left-panel-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 480px;
  max-width: calc(100% - 32px);
  overflow: hidden;
  pointer-events: none;
  z-index: 10;
  visibility: visible;
  transition: visibility 0s linear 0s;

  &.is-collapsed {
    visibility: hidden;
    pointer-events: none;
    transition: visibility 0s linear 0.28s;
  }
}

/* 风险情况概览独立占据左侧，不再覆盖地图。 */
.left-panel-stack {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 10;
  width: 460px;
  max-width: 100%;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 4px 0 20px rgba(0, 32, 80, 0.12);
  overflow: hidden;
  box-sizing: border-box;
  transform: translateX(0);
  opacity: 1;
  pointer-events: auto;
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1);

  &.is-collapsed {
    transform: translateX(-100%);
    opacity: 0;
    pointer-events: none;
  }
}

.stack-panel {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: #ffffff;
}

.overview-panel-layer {
  z-index: 1;
}

.slope-panel-layer {
  z-index: 2;
  opacity: 0;
  transform: translateX(-100%);
  pointer-events: none;
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;

  &.is-visible {
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
  }
}

/* 收起/展开通用按钮 */
.collapse-trigger {
  position: absolute;
  top: 50%;
  width: 20px;
  height: 72px;
  padding: 0;
  box-sizing: border-box;
  border: 1px solid #cccccc66;
  border-radius: 17px;
  background: #ffffff;
  cursor: pointer;
  transform: translateY(-50%);
}

.collapse-trigger:hover {
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.16);
}

.collapse-trigger img {
  display: block;
  width: 14px;
  height: 14px;
  margin: 0 auto;
  object-fit: contain;
}

/* 左侧概览面板收起按钮：使用与面板完全一致的 GPU transform 贝塞尔曲线，杜绝延迟脱节 */
.left-trigger {
  left: 0;
  z-index: 30;
  transform: translateY(-50%) translateX(450px);
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.2s ease;
}

.left-trigger.is-collapsed {
  transform: translateY(-50%) translateX(-10px);
}

@media (max-width: 1366px) {
  .left-panel-wrapper {
    width: 480px;
  }
  .left-panel-stack {
    width: 460px;
  }
  .left-trigger {
    transform: translateY(-50%) translateX(450px);
  }
  .left-trigger.is-collapsed {
    transform: translateY(-50%) translateX(-10px);
  }
}
</style>
