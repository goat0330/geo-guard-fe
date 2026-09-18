<template>
  <section class="panel-section">
    <PanelSectionTitle title="设备类型" />

    <div class="type-list">
      <div v-for="item in deviceTypes" :key="item.key" class="type-row">
        <div class="type-head">
          <span class="type-name">{{ item.label }}</span>
          <strong class="type-value num-font">{{ item.value }}</strong>
        </div>
        <span class="type-bar">
          <i :style="{ width: getBarWidth(item.value) }"></i>
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
import PanelSectionTitle from './PanelSectionTitle.vue'
import { deviceTypes } from '../config.js'

defineOptions({ name: 'MonitorDeviceTypeList' })

/** 进度条以最大值为基准换算宽度；设计稿中最大值约占轨道 80% 长度 */
const maxValue = Math.max(...deviceTypes.map((item) => item.value))
const BAR_MAX_RATIO = 0.8

const getBarWidth = (value) => `${Math.max(6, (value / maxValue) * BAR_MAX_RATIO * 100)}%`
</script>

<style lang="less" scoped>
.type-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.type-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.type-head {
  display: flex;
  align-items: center;
}

.type-name {
  color: #383C41;
  font-size: 14px;
  line-height: 20px;
}

.type-value {
  margin-left: auto;
  color: #383C41;
  font-size: 18px;
  line-height: 20px;
  font-weight: 600;
  font-family: "Alimama FangYuanTi VF";
}

.type-bar {
  display: block;
  height: 3px;
  // border-radius: 2px;
  background: #EAEEF4;
  overflow: hidden;

  i {
    display: block;
    height: 100%;
    // border-radius: 2px;
    background: #007BFF;
    transition: width 0.4s ease;
  }
}

/* 数字使用项目数字字体 */
.num-font {
  font-family: 'Alimama FangYuanTi VF', sans-serif;
  font-style: normal;
}
</style>
