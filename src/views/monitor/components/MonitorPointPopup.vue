<template>
  <div class="point-popup">
    <header class="popup-header">
      <span class="popup-title" :title="title">{{ title }}</span>
      <button class="close-button" type="button" title="关闭" @click="emit('close')">
        <img :src="closeIcon" alt="关闭" />
      </button>
    </header>

    <!-- 位移：浅蓝底 + 淡蓝描边 -->
    <div class="metric-block displacement">
      <div v-for="item in detail.displacement" :key="item.key" class="metric-cell">
        <span class="metric-label">{{ item.label }}</span>
        <strong class="metric-value num-font">{{ item.value }}<em>{{ item.unit }}</em></strong>
      </div>
    </div>

    <!-- 降雨：浅绿底 + 淡绿描边 -->
    <div class="metric-block rainfall">
      <div v-for="item in detail.rainfall" :key="item.key" class="metric-cell">
        <span class="metric-label">{{ item.label }}</span>
        <strong class="metric-value num-font">{{ item.caption }}{{ item.value }}<em>{{ item.unit }}</em></strong>
      </div>
    </div>

    <div class="info-list">
      <div v-for="row in detail.info" :key="row.label" class="info-row" :class="{ 'is-full': row.span === 2 }">
        <span class="info-label">{{ row.label }}</span>
        <span class="info-value">{{ row.value }}</span>
      </div>

      <div class="info-row is-full">
        <span class="info-label">设备状态：</span>
        <span class="info-value status-list">
          <span v-for="status in detail.deviceStatus" :key="status.key" class="status-item" :class="status.tone">
            <i class="status-dot"></i>{{ status.label }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import closeIcon from '@/assets/imgs/hazardReview/icon-close.webp'

defineOptions({ name: 'MonitorPointPopup' })

const props = defineProps({
  /** 监测点详情：{ name, code, displacement, rainfall, info, deviceStatus } */
  detail: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close'])

/** 标题为「名称_编号」 */
const title = computed(() => {
  const { name, code } = props.detail
  return code ? `${name}_${code}` : name
})
</script>

<style lang="less" scoped>
.point-popup {
  position: relative;
  width: 350px;
  min-height: 310px;
  box-sizing: border-box;
  padding: 14px;
  border: 2px solid #ffffff;
  border-radius: 10px;
  background: #f1f3fcd9;
  -webkit-backdrop-filter: blur(2px);
  backdrop-filter: blur(2px);
  font-family: 'AlibabaPuHuiTi', sans-serif;
}

.popup-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.popup-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  color: #222527;
  font-size: 14px;
  font-weight: 800;
  line-height: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.close-button {
  display: inline-flex;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;

  img {
    display: block;
    width: 16px;
    height: 16px;
    object-fit: contain;
  }
}

/* 位移 / 降雨指标块 */
.metric-block {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-radius: 10px;
}

.metric-block+.metric-block {
  margin-top: 10px;
}

.metric-block.displacement {
  width: 318px;
  height: 70px;
  border-radius: 6px;
  border: 1px solid #3561fa33;
  background: linear-gradient(180deg, #BBD4F7 0%, #bbd4f733 100%);
  margin-bottom: 6px;
}

.metric-block.rainfall {
  width: 318px;
  height: 70px;
  border-radius: 6px;
  border: 1px solid #18885433;
  background: linear-gradient(180deg, #ABD2CC 0%, #abd2cc33 100%);
  margin-bottom: 12px;
}

.metric-cell {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 4px;
}

.metric-cell+.metric-cell {
  border-left: 1px solid #cfe3fb;
}

/* 位移块列间竖线：设计稿为居中短竖线 */
.displacement .metric-cell+.metric-cell {
  border-left: 0;
}

.displacement .metric-cell+.metric-cell::before {
  position: absolute;
  top: 50%;
  left: 0;
  width: 1px;
  height: 38px;
  background: #3561fa33;
  transform: translateY(-50%);
  content: '';
}

/* 降雨块列间竖线：规格同位移块，换成绿色 */
.rainfall .metric-cell+.metric-cell {
  border-left: 0;
}

.rainfall .metric-cell+.metric-cell::before {
  position: absolute;
  top: 50%;
  left: 0;
  width: 1px;
  height: 38px;
  background: #18885433;
  transform: translateY(-50%);
  content: '';
}

.metric-label {
  color: #3561FA;
  font-size: 13px;
  line-height: 14px;
  font-weight: 800;
  white-space: nowrap;
}

.metric-value {
  color: #3561FA;
  font-size: 12px;
  line-height: 14px;
  white-space: nowrap;
  opacity: 0.8;
}

.rainfall .metric-label,
.rainfall .metric-value {
  color: #188854;
}
.rainfall .metric-value{
  opacity: 0.8;
}

.metric-value em {
  margin-left: 1px;
  font-size: 14px;
  font-style: normal;
}

/* 信息区：两列，跨行列独占整行 */
.info-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 12px;
  margin-top: 16px;
}

.info-row {
  display: flex;
  min-width: 0;
  align-items: center;
  color: #617185;
  font-size: 12px;
  line-height: 20px;
}

.info-row.is-full {
  grid-column: 1 / -1;
}

.info-label {
  flex-shrink: 0;
  width: 60px;
}

.info-value {
  min-width: 0;
  margin-left: 12px;
  overflow: hidden;
  color: #617185;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.status-list {
  display: inline-flex;
  align-items: center;
  gap: 16px;
}

.status-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #a6acb8;
}

.status-item.online {
  color: #2CA86E;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #a6acb8;
}

.status-item.online .status-dot {
  background: #2CA86E;
}

/* 数字使用项目数字字体 */
.num-font {
  font-family: 'Alimama FangYuanTi VF', sans-serif;
  font-style: normal;
}
</style>
