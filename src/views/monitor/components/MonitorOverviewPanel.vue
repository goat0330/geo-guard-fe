<template>
  <section class="monitor-panel">
    <header class="panel-header">
      <div class="title-box">
        <h1>专业监测常态</h1>
      </div>
      <!-- <StatDatePicker v-model="selectedDate" @change="handleDateChange" /> -->
    </header>

    <div class="panel-body">
      <DeviceOverview />

      <AlarmSituation @view-detail="emit('view-alarm-detail')" />

      <DisposeStatus />

      <DeviceTypeList />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
// import StatDatePicker from '@/components/StatDatePicker/index.vue'
import DeviceOverview from './DeviceOverview.vue'
import AlarmSituation from './AlarmSituation.vue'
import DisposeStatus from './DisposeStatus.vue'
import DeviceTypeList from './DeviceTypeList.vue'
import { monitorDate } from '../config.js'

defineOptions({ name: 'MonitorOverviewPanel' })

const emit = defineEmits(['date-change', 'view-alarm-detail'])

/** 统计日期：默认取配置值，切换后向上抛出，便于后续按日期请求数据 */
const selectedDate = ref(monitorDate)

const handleDateChange = (value) => {
  emit('date-change', value)
}
</script>

<style lang="less" scoped>
.monitor-panel {
  display: flex;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  padding: 22px 0 18px 24px;
  box-sizing: border-box;
  overflow: hidden;
  color: #1a1a1a;
  font-family: 'AlibabaPuHuiTi', sans-serif;
}

.panel-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 0 24px 18px 0;
}

.title-box {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
}

.title-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  white-space: nowrap;
}

.panel-body {
  display: flex;
  flex: 1 1 0;
  min-height: 0;
  flex-direction: column;
  gap: 24px;
  padding-right: 22px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.panel-body::-webkit-scrollbar {
  width: 4px;
}

.panel-body::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: #d6dee8;
}
</style>
