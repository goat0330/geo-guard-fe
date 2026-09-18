<template>
  <section class="panel-section">
    <PanelSectionTitle title="设备概况" />

    <!-- 整体一张卡片：上部两列指标（竖线分隔）+ 横线 + 底部在线/离线 -->
    <div class="overview-card">
      <div class="overview-main">
        <div v-for="item in deviceOverview" :key="item.key" class="overview-cell">
          <img class="cell-icon" :src="item.icon" :alt="item.label" />
          <div class="cell-text">
            <span class="cell-label">{{ item.label }}</span>
            <strong class="cell-value num-font">
              {{ item.value }} {{ item.unit }}
            </strong>
          </div>
        </div>
      </div>

      <span class="card-divider"></span>

      <div class="overview-foot">
        <span v-for="status in deviceStatuses" :key="status.key" class="foot-item">
          <i class="foot-dot" :class="status.tone"></i>{{ status.label }}
          <b class="foot-value num-font" :class="status.tone">{{ status.value }}</b>
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
import PanelSectionTitle from './PanelSectionTitle.vue'
import { deviceOverview, deviceStatuses } from '../config.js'

defineOptions({ name: 'MonitorDeviceOverview' })
</script>

<style lang="less" scoped>
.overview-card {
  padding: 16px 20px;
  box-sizing: border-box;
  border: 1px solid #e9edf3;
  border-radius: 10px;
  background: #ffffff;
}

.overview-main {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.overview-cell {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 14px;
}

/* 第二列与第一列之间一条竖线 */
.overview-cell+.overview-cell {
  padding-left: 20px;
  border-left: 1px solid #DEE2EC;

}

.cell-icon {
  width: 58px;
  height: 58px;
  flex-shrink: 0;
  object-fit: contain;
}

.cell-text {
  min-width: 0;
}

.cell-label {
  display: block;
  color: #617185;
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap;
}

.cell-value {
  display: block;
  margin-top: 2px;
  color: #222527;
  font-size: 26px;
  line-height: 32px;
  font-weight: 700;
  white-space: nowrap;
  font-family: "Alimama FangYuanTi VF";
}

.cell-value em {
  margin-left: 2px;
  margin-top: 2px;
  color: #222527;
  font-size: 26px;
  line-height: 32px;
  font-weight: 700;
  white-space: nowrap;
  font-family: "Alimama FangYuanTi VF";
}

.card-divider {
  display: block;
  height: 1px;
  margin: 14px 0;
  background: #DEE2EC;
}

/* 底部：在线数 / 离线数 各占一半 */
.overview-foot {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.foot-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #9096A2;
  font-size: 14px;
  line-height: 20px;
  // margin-left: 16px;
}

.foot-dot {
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border-radius: 50%;
  background: #21a366;
}

.foot-dot.offline {
  background: #DD4739;
}

.foot-value {
  font-size: 18px;
  font-weight: 700;
}

.foot-value.online {
  color: #44B699;
}

.foot-value.offline {
  color: #dd4739;
}

/* 数字使用项目数字字体 */
.num-font {
  font-family: 'Alimama FangYuanTi VF', sans-serif;
  font-style: normal;
}
</style>
