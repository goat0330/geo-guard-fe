<template>
  <section class="panel-section">
    <PanelSectionTitle title="处置状态" />

    <div class="status-grid">
      <div v-for="item in disposeStatus" :key="item.key" class="status-card">
        <img class="status-icon" :src="item.icon" :alt="item.label" />
        <span class="status-label">{{ item.label }}</span>
        <strong class="status-value num-font">{{ item.value }}</strong>
      </div>
    </div>
  </section>
</template>

<script setup>
import PanelSectionTitle from './PanelSectionTitle.vue'
import { disposeStatus } from '../config.js'

defineOptions({ name: 'MonitorDisposeStatus' })
</script>

<style lang="less" scoped>
.status-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.status-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 8px;
  box-sizing: border-box;
  border: 1px solid #e9edf3;
  border-radius: 10px;
  background: #ffffff;
  width: 130px;
  height: 112px;
}

.status-icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.status-label {
  color: #617185;
  font-size: 14px;
  line-height: 18px;
}

.status-value {
  color: #383C41;
  font-size: 20px;
  line-height: 26px;
  font-weight: 700;
  font-family: "Alimama FangYuanTi VF";
}

/* 数字使用项目数字字体 */
.num-font {
  font-family: 'Alimama FangYuanTi VF', sans-serif;
  font-style: normal;
}
</style>
