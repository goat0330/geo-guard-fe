<template>
  <div class="monitor-page">
    <!-- 地图区域：统计面板浮动在左侧上层 -->
    <section class="map-area" :class="{ 'is-left-collapsed': leftCollapsed }" aria-label="专业监测地图">
      <!-- 地图内容区：左侧为面板预留空间，面板收起时铺满 -->
      <div class="map-content">
        <MarsMap ref="marsMapRef" />

        <MapOverlayControls
          :class="{ 'has-right-panel': agentPanelVisible }"
          @zoom-in="marsMapRef?.handleZoomIn()"
          @zoom-out="marsMapRef?.handleZoomOut()"
          @locate-home="marsMapRef?.flyToHome()"
          @change-base-map="marsMapRef?.changeBaseMap($event)"
          @toggle-imagery-label="marsMapRef?.toggleImageryLabel($event)"
        />

        <!-- 监测点定位标记 -->
        <div class="monitor-marker" title="监测点">
          <img :src="mapPointIcon" alt="监测点" />
        </div>

        <!-- 监测点详情气泡 -->
        <MonitorPointPopup
          v-if="popupVisible"
          class="point-popup-layer"
          :detail="monitorPointDetail"
          @close="popupVisible = false"
        />
      </div>

      <!-- 左侧面板：与地图并排展示，收起时向左滑出 -->
      <div class="left-panel-wrapper" :class="{ 'is-collapsed': leftCollapsed }">
        <div class="left-panel-stack" :class="{ 'is-collapsed': leftCollapsed }">
          <MonitorOverviewPanel
            @date-change="handleDateChange"
            @view-alarm-detail="alarmListVisible = true"
          />
          <div v-if="alarmListVisible" class="alarm-list-layer">
            <AlarmListPanel
              @back="alarmListVisible = false"
              @export="handleUnavailableAction"
              @analyze="handleAnalyze"
            />
          </div>
        </div>
      </div>

      <!-- 右侧：监测预警智能体分析面板，点击「AI数据分析」从右侧滑入 -->
      <Transition name="right-panel">
        <WarningAgentPanel
          v-if="agentPanelVisible"
          class="agent-panel-layer"
          @close="agentPanelVisible = false"
          @feedback="handleUnavailableAction"
          @assign="handleUnavailableAction"
        />
      </Transition>
    </section>

    <!-- 面板收起/展开按钮：置于 map-area 外层，避免被地图容器裁切 -->
    <button
      class="collapse-trigger left-trigger"
      :class="{ 'is-collapsed': leftCollapsed }"
      :title="leftCollapsed ? '展开专业监测概况' : '收起专业监测概况'"
      @click="leftCollapsed = !leftCollapsed"
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
import MonitorOverviewPanel from './components/MonitorOverviewPanel.vue'
import MonitorPointPopup from './components/MonitorPointPopup.vue'
import AlarmListPanel from './components/alarmList/index.vue'
import WarningAgentPanel from './components/warningAgent/index.vue'
import { monitorPointDetail } from './config.js'
import mapPointIcon from '@/assets/imgs/monitor/icon-alarm-pin.webp'
import leftArrow from '@/assets/imgs/left-arr.png'
import rightArrow from '@/assets/imgs/right-arr.png'

defineOptions({ name: 'MonitorPage' })

const marsMapRef = ref(null)
const leftCollapsed = ref(false)
const popupVisible = ref(true)
/** 左侧面板是否展示预警列表（覆盖统计概况） */
const alarmListVisible = ref(false)
/** 右侧监测预警智能体面板是否展示 */
const agentPanelVisible = ref(false)

/** 点击「AI数据分析」打开右侧智能体面板（面板内容当前为固定 mock，接口就绪后按预警项请求） */
const handleAnalyze = () => {
  agentPanelVisible.value = true
}

/** 统计日期切换：接口就绪后按日期重新请求统计数据 */
const handleDateChange = () => {}

/** 面板内的导出等动作待接口接入 */
const handleUnavailableAction = () => {
  ElMessage.warning('当前接口未提供该操作')
}
</script>

<style lang="less" scoped>
.monitor-page {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  max-height: 100%;
  min-height: 100%;
  flex: 1 1 auto;
  box-sizing: border-box;
  overflow: visible;
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
  bottom: 0;
  left: 0;
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

/* 预警列表：覆盖在统计概况之上，从右滑入 */
.alarm-list-layer {
  position: absolute;
  inset: 0;
  background: #ffffff;
  animation: alarm-layer-in 0.24s ease;
}

@keyframes alarm-layer-in {
  from {
    opacity: 0;
    transform: translateX(24px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 右侧监测预警智能体面板：滑入效果与其他页面保持一致 */
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

/* 监测点标记 */
.monitor-marker {
  position: absolute;
  top: 56%;
  left: 62%;
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

/* 监测点详情气泡：位于标记正上方 */
.point-popup-layer {
  position: absolute;
  top: 56%;
  left: 62%;
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
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease;
}

/* 收起：跟随面板左移到内容区左缘外侧，形成骑线效果。
   溢出的 10px 落在左侧菜单的透明内边距上，需页面为 is-fixed-page（`.layout-main` overflow: visible）才不被裁切 */
.left-trigger.is-collapsed {
  transform: translateY(-50%) translateX(-10px);
}
</style>
