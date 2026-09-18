<template>
  <div class="hazard-review-page">
    <!-- 地图区域：概览面板浮动在左侧上层 -->
    <section class="map-area" :class="{ 'is-left-collapsed': leftCollapsed }" aria-label="地图区域">
      <!-- 地图内容区：左侧为面板预留空间，面板收起时铺满 -->
      <div class="map-content">
        <MarsMap ref="marsMapRef" @onload="handleMapLoaded" />

        <MapOverlayControls
          :class="{ 'has-right-panel': agentPanelVisible }"
          @zoom-in="marsMapRef?.handleZoomIn()"
          @zoom-out="marsMapRef?.handleZoomOut()"
          @locate-home="marsMapRef?.flyToHome()"
          @change-base-map="marsMapRef?.changeBaseMap($event)"
          @toggle-imagery-label="marsMapRef?.toggleImageryLabel($event)"
        />

        <!-- 隐患点定位标记 -->
        <div class="hazard-marker" title="隐患点位置">
          <img :src="mapPointIcon" alt="隐患点" />
        </div>

        <!-- 隐患点详情气泡 -->
        <HazardDetailPopup
          v-if="popupVisible"
          class="hazard-popup-layer"
          :data="hazardDetail"
          @close="popupVisible = false"
        />
      </div>

      <!-- 右侧：隐患复核智能体处理面板，点击卡片「AI处理」从右侧滑入 -->
      <Transition name="right-panel">
        <AgentProcessPanel
          v-if="agentPanelVisible"
          class="agent-panel-layer"
          :data="agentTarget"
          @close="closeAgentPanel"
          @feedback="handleUnavailableAction"
          @confirm="handleUnavailableAction"
        />
      </Transition>

      <!-- 左侧面板：与地图并排展示，收起时向左滑出 -->
      <div class="left-panel-wrapper" :class="{ 'is-collapsed': leftCollapsed }">
        <div class="left-panel-stack" :class="{ 'is-collapsed': leftCollapsed }">
          <ReviewSummaryPanel @view-process-detail="processListVisible = true" />
          <div v-if="processListVisible" class="process-list-layer">
            <HazardProcessPanel @back="processListVisible = false" @process="handleProcess" />
          </div>
        </div>
      </div>
    </section>

    <!-- 左侧面板收起/展开按钮：置于 map-area 外层，避免被地图容器裁切 -->
    <button
      class="collapse-trigger left-trigger"
      :class="{ 'is-collapsed': leftCollapsed }"
      :title="leftCollapsed ? '展开隐患复核情况' : '收起隐患复核情况'"
      @click="toggleLeftCollapse"
    >
      <img :src="leftCollapsed ? rightArrow : leftArrow" alt="" />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import MarsMap from '@/components/MarsMap/index.vue'
import MapOverlayControls from '@/components/MapOverlayControls/index.vue'
import ReviewSummaryPanel from './components/ReviewSummaryPanel.vue'
import HazardProcessPanel from './components/processList/HazardProcessPanel.vue'
import HazardDetailPopup from './components/HazardDetailPopup.vue'
import AgentProcessPanel from './components/agentProcess/index.vue'
import { hazardDetail } from './config.js'
import mapPointIcon from '@/assets/imgs/hazardReview/map-point-zhd.webp'
import leftArrow from '@/assets/imgs/left-arr.png'
import rightArrow from '@/assets/imgs/right-arr.png'

defineOptions({ name: 'HazardReview' })

const marsMapRef = ref(null)
const leftCollapsed = ref(false)
const popupVisible = ref(true)
/** 左侧面板是否展示隐患处理列表（覆盖复核概况） */
const processListVisible = ref(false)
/** 右侧智能体处理面板是否展示 */
const agentPanelVisible = ref(false)
/** 右侧面板当前处理的隐患点 */
const agentTarget = ref(null)

const toggleLeftCollapse = () => {
  leftCollapsed.value = !leftCollapsed.value
}

/** 点击列表卡片的「AI处理」，在右侧展开该隐患点的智能体处理面板 */
const handleProcess = (item) => {
  agentTarget.value = item
  agentPanelVisible.value = true
}

const closeAgentPanel = () => {
  agentPanelVisible.value = false
}

/** 面板内的反馈/确认动作待接口接入 */
const handleUnavailableAction = () => {
  ElMessage.warning('当前接口未提供该操作')
}

const handleMapLoaded = ({ map, viewer }) => {
  console.log('Mars3D 地图初始化就绪', map, viewer)
}

</script>

<style lang="less" scoped>
.hazard-review-page {
  position: relative;
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  max-height: 100%;
  min-height: 100%;
  display: flex;
  // 面板与地图并排，收起按钮在容器外，故不裁切
  overflow: visible;
  box-sizing: border-box;
  padding: 0;
  background: transparent;
  font-family: 'AlibabaPuHuiTi', sans-serif;
}

/* 地图区域：本身透明，内部内容区左侧为面板预留空间 */
.map-area {
  position: relative;
  flex: 1 1 0;
  min-width: 0;
  height: 100%;
  min-height: 100%;
  box-sizing: border-box;
  background: transparent;
  overflow: visible;
  transform: translateZ(0);
  isolation: isolate;
}

/* 地图内容区：左侧让出面板宽度（460 + 12 间距），面板收起时铺满 */
.map-content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 472px;
  transition: left 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}

.map-area.is-left-collapsed .map-content {
  left: 0;
}

/* 左侧面板裁剪容器：约束在 x >= 0，避免收起时溢出到菜单栏 */
.left-panel-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 10;
  width: 480px;
  max-width: calc(100% - 32px);
  overflow: hidden;
  pointer-events: none;
  visibility: visible;
  transition: visibility 0s linear 0s;

  &.is-collapsed {
    visibility: hidden;
    transition: visibility 0s linear 0.28s;
  }
}

/* 左侧统计面板：与地图并排，收起时向左滑出 */
.left-panel-stack {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 10;
  width: 460px;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 4px 0 20px rgba(0, 32, 80, 0.12);
  transform: translateX(0);
  opacity: 1;
  pointer-events: auto;
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1);

  &.is-collapsed {
    transform: translateX(-100%);
    opacity: 0;
    pointer-events: none;
  }
}

/* 隐患点标记 */
.hazard-marker {
  position: absolute;
  left: 58%;
  top: 52%;
  z-index: 9;
  transform: translate(-50%, -100%);
  cursor: pointer;

  img {
    display: block;
    width: 34px;
    height: 44px;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(0, 32, 80, 0.28));
  }
}

/* 隐患点详情气泡：位于标记正上方 */
.hazard-popup-layer {
  position: absolute;
  left: 58%;
  top: 52%;
  z-index: 12;
  transform: translate(-50%, calc(-100% - 56px));
}

/* 收起/展开按钮 */
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

.left-trigger {
  left: 0;
  /* 高于左侧面板（10）、地图控件与右侧面板，避免骑在面板边缘时被遮挡 */
  z-index: 100;
  /* 展开：按钮左缘与面板右缘（460px）对齐，整体露在地图侧 */
  transform: translateY(-50%) translateX(460px);
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.2s ease;
}

/* 收起：跟随面板左移到内容区左缘外侧，形成骑线效果。
   溢出的 10px 落在左侧菜单的透明内边距上，需页面为 is-fixed-page（`.layout-main` overflow: visible）才不被裁切 */
.left-trigger.is-collapsed {
  transform: translateY(-50%) translateX(-10px);
}

@media (max-width: 1366px) {
  .left-trigger {
    transform: translateY(-50%) translateX(460px);
  }
  .left-trigger.is-collapsed {
    transform: translateY(-50%) translateX(-10px);
  }
}

/* 隐患处理列表：覆盖在复核概况之上，从右滑入 */
.process-list-layer {
  position: absolute;
  inset: 0;
  background: #ffffff;
  animation: process-layer-in 0.24s ease;
}

@keyframes process-layer-in {
  from {
    opacity: 0;
    transform: translateX(24px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 右侧智能体处理面板：滑入效果与群测群防的详情面板保持一致 */
.agent-panel-layer {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 12;
  width: 460px;
  max-width: calc(100% - 32px);
  overflow: hidden;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: -4px 0 20px rgba(0, 32, 80, 0.12);
}

.right-panel-enter-active,
.right-panel-leave-active {
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease;
}

.right-panel-enter-from,
.right-panel-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* 右侧面板展开时地图控件左移让位 */
:deep(.map-overlay-controls .filter-groups),
:deep(.map-overlay-controls .map-tools) {
  transition: right 0.28s ease;
}

:deep(.map-overlay-controls.has-right-panel .filter-groups),
:deep(.map-overlay-controls.has-right-panel .map-tools) {
  right: 476px;
}
</style>
