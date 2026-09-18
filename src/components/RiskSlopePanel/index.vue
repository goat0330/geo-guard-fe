<template>
  <section class="slope-panel">
    <h1>
      <button class="back-button" title="返回风险概览" @click="emit('back')">
        <i class="iconfont icon-arrow-right"></i>
      </button>
      风险斜坡列表
    </h1>
    <div class="filters">
      <label>单元编号：<el-input v-model="filters.code" placeholder="请输入" clearable /></label>
      <label>风险等级：<el-select v-model="filters.level"><el-option label="高" value="high" /><el-option label="中" value="medium" /><el-option label="低" value="low" /></el-select></label>
      <label>时间选择：<el-date-picker v-model="filters.time" type="datetime" placeholder="请选择时间" /></label>
      <div class="filter-actions"><el-button type="primary">查询</el-button><el-button>重置</el-button></div>
    </div>

    <div class="slope-list">
      <article v-for="(item, index) in slopeItems" :key="index" class="slope-card" :class="{ active: index === activeIndex }">
        <img :src="item.level === '中风险' ? hazardOrange : hazardBlue" :class="{ 'is-low': item.level === '低风险' }" alt="风险斜坡" />
        <div class="slope-info">
          <div class="slope-name">DXG-MG11斜坡单元 <span :class="item.level === '中风险' ? 'medium' : 'low'">{{ item.level }}</span></div>
          <div class="meta"><i class="iconfont icon-address"></i>龙溪镇</div>
          <div class="meta"><i class="iconfont icon-a-Frame1"></i>更新时间2026-09-07 10:26</div>
        </div>
        <div class="card-actions"><button @click="emit('risk-analysis', item)">风险分析</button><button @click="handleLocate(item, index)">地图定位</button></div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import hazardOrange from '@/assets/imgs/fengxian/hazard-orange.png'
import hazardBlue from '@/assets/imgs/fengxian/hazard-blue.png'

const filters = reactive({ code: '', level: 'high', time: '' })
const activeIndex = ref(-1)
const emit = defineEmits(['back', 'locate', 'risk-analysis'])
const slopeItems = [
  {
    code: 'DXG-MG11斜坡单元',
    level: '中风险',
    address: '重庆市渝中区',
    lng: 106.5507,
    lat: 29.5637,
    area: 0.8,
    population: 513,
    buildings: 160,
    contact: '向良丰',
    rainfall: 1.23,
    rainfallTrend: [
      { time: '0时', value: 0 },
      { time: '3时', value: 0 },
      { time: '6时', value: 1.5 },
      { time: '9时', value: 1.5 },
      { time: '12时', value: 1 },
      { time: '14:23', value: 0.4, current: true },
      { time: '18时', value: 1.3 },
    ],
  },
  { level: '中风险' }, { level: '中风险' },
  { level: '低风险' }, { level: '低风险' }, { level: '低风险' },
  { level: '低风险' }, { level: '低风险' }, { level: '低风险' },
]

const handleLocate = (item, index) => {
  activeIndex.value = index
  emit('locate', item)
}
</script>

<style lang="less" scoped>
.slope-panel {
  height: 100%;
  min-height: 0;
  padding: 24px 0 20px 24px;
  box-sizing: border-box;
  color: #1a1a1a;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

h1 {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  margin: 0 24px 24px 0;
  font-size: 18px;
  line-height: 26px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 4px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #1a1a1a;
  cursor: pointer;
}

.back-button i {
  font-size: 16px;
  transform: rotate(180deg);
}

.filters {
  position: relative;
  flex-shrink: 0;
  display: grid;
  gap: 8px;
  padding-right: 72px;
  margin: 0 24px 22px 0;
}

.filters label { display: grid; grid-template-columns: 72px 1fr; align-items: center; color: #667382; font-size: 14px; white-space: nowrap; }
.filters :deep(.el-input), .filters :deep(.el-select), .filters :deep(.el-date-editor) { width: 100%; }
.filter-actions { position: absolute; right: 0; top: 0; display: grid; gap: 8px; }
.filter-actions .el-button { width: 62px; height: 34px; margin: 0; }

.slope-list {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  padding-right: 20px;
}

.slope-list::-webkit-scrollbar {
  width: 4px;
}

.slope-list::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: #d6dee8;
}

.slope-card { flex: 0 0 92px; min-height: 92px; display: grid; grid-template-columns: 38px minmax(0, 1fr) 92px; gap: 10px; align-items: center; padding: 14px 14px; box-sizing: border-box; border: 1px solid #dce3eb; border-radius: 8px; }
.slope-card.active { border-color: #087df5; background: #f1f7ff; box-shadow: 0 2px 8px rgba(0, 123, 255, 0.08); }
.slope-card > img { width: 38px; height: 28px; object-fit: contain; }
.slope-card > img.is-low { filter: hue-rotate(185deg) saturate(2.8) brightness(0.96); }
.slope-name { overflow: hidden; color: #252b33; font-size: 14px; font-weight: 600; white-space: nowrap; text-overflow: ellipsis; }
.slope-name span { display: inline-block; margin-left: 8px; padding: 2px 7px; border-radius: 3px; color: #ffffff; font-size: 10px; font-weight: 400; }
.slope-name .medium { background: #ff942c; }.slope-name .low { background: #087df5; }
.meta { margin-top: 7px; color: #9aa5b2; font-size: 12px; white-space: nowrap; }
.meta i { margin-right: 5px; font-size: 12px; }
.card-actions { display: grid; gap: 8px; padding-left: 14px; border-left: 1px solid #e4eaf0; }
.card-actions button {
  height: 26px;
  border: 0;
  border-radius: 4px;
  background: #e5f2ff;
  color: #087df5;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: #007bff;
    color: #ffffff;
  }
}

@media (max-width: 1366px) {
  .slope-panel { padding: 20px 0 16px 16px; }
  h1 { margin: 0 16px 18px 0; }
  .filters { margin: 0 16px 16px 0; }
  .slope-list { padding-right: 12px; }
  .slope-card { grid-template-columns: 30px minmax(0, 1fr) 74px; padding-inline: 10px; }
  .slope-card > img { width: 30px; }
  .card-actions { padding-left: 8px; }
}
</style>
