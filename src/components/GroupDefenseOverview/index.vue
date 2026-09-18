<template>
  <section class="overview-panel">
    <header class="overview-header">
      <h1>群测群防常态</h1>
      <div class="header-filters">
        <button type="button" title="统计日期" @click="datePickerRef?.handleOpen()">
          <el-icon><Calendar /></el-icon><span>{{ selectedDate }}</span
          ><el-icon><ArrowDown /></el-icon>
        </button>
        <el-date-picker
          ref="datePickerRef"
          v-model="selectedDate"
          class="date-picker-host"
          type="date"
          value-format="YYYY-MM-DD"
          :clearable="false"
          aria-label="统计日期"
        />
      </div>
    </header>

    <div class="overview-scroll">
      <section class="business-section">
        <div class="section-title">
          <h2>今日报送</h2>
          <button type="button" @click="emit('show-reports')">
            查看详情<el-icon><ArrowRight /></el-icon>
          </button>
        </div>

        <div class="report-metrics">
          <article class="metric-card metric-main">
            <img class="metric-icon" :src="reportTotalIcon" alt="" />
            <span>今日上报总数</span>
            <strong>{{ numberText(summary.todayCount) }}<small>条</small></strong>
          </article>
          <article v-for="item in reportMetrics" :key="item.label" class="metric-card">
            <img class="metric-icon" :src="item.icon" alt="" />
            <div>
              <span>{{ item.label }}</span>
              <strong
                >{{ numberText(item.value) }}<small>{{ item.unit }}</small></strong
              >
            </div>
          </article>
        </div>
      </section>

      <section class="business-section">
        <div class="section-title"><h2>处理状态</h2></div>
        <div class="status-grid">
          <article v-for="item in statusMetrics" :key="item.label" class="status-card">
            <img class="status-icon" :src="item.icon" alt="" />
            <span>{{ item.label }}</span>
            <strong>{{ numberText(item.value) }}</strong>
          </article>
        </div>
      </section>

      <section class="business-section">
        <div class="section-title">
          <h2>AI评估结果</h2>
          <span class="section-note">已分析{{ numberText(summary.analyzedCount) }}条 · 分级结果待人工核查</span>
        </div>
        <div class="risk-grid">
          <article v-for="item in riskMetrics" :key="item.label" class="risk-card" :class="item.tone">
            <span><i class="iconfont icon-d-defense"></i>{{ item.label }}</span>
            <strong>{{ numberText(item.value) }}</strong>
          </article>
        </div>
      </section>

      <section class="business-section ranking-section">
        <div class="section-title">
          <h2>乡镇报送排行</h2>
          <span class="section-note">按报送数量</span>
        </div>
        <div v-if="rankings.length" class="ranking-list">
          <article v-for="(item, index) in rankings" :key="item.name" class="ranking-row">
            <div>
              <i>{{ index + 1 }}</i
              ><span :title="item.name">{{ item.name }}</span
              ><strong>{{ numberText(item.value) }}</strong>
            </div>
            <span class="ranking-progress"><i :style="{ width: item.width }"></i></span>
          </article>
        </div>
        <div v-else class="empty-state">暂无排行数据</div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import reportTotalIcon from '@/assets/imgs/defense/report-total.png'
import reportUsersIcon from '@/assets/imgs/defense/report-users.png'
import reportTownsIcon from '@/assets/imgs/defense/report-towns.png'
import reportPhotosIcon from '@/assets/imgs/defense/report-photos.png'
import reportAiPendingIcon from '@/assets/imgs/defense/report-ai-pending.png'
import statusPendingIcon from '@/assets/imgs/defense/status-pending.png'
import statusProcessingIcon from '@/assets/imgs/defense/status-processing.png'
import statusCompletedIcon from '@/assets/imgs/defense/status-completed.png'

defineOptions({ name: 'GroupDefenseOverview' })

const props = defineProps({
  summary: { type: Object, default: () => ({}) },
  rankings: { type: Array, default: () => [] },
})

const emit = defineEmits(['show-reports'])
const selectedDate = ref(dayjs().format('YYYY-MM-DD'))
const datePickerRef = ref(null)

const reportMetrics = computed(() => [
  { label: '报送人数', value: props.summary.reporterCount, unit: '人', icon: reportUsersIcon },
  { label: '涉及乡镇', value: props.summary.townCount, unit: '个', icon: reportTownsIcon },
  { label: '含图报送', value: props.summary.photoCount, unit: '条', icon: reportPhotosIcon },
  { label: '待AI分析', value: props.summary.pendingAiCount, unit: '条', icon: reportAiPendingIcon },
])

const statusMetrics = computed(() => [
  { label: '待处理', value: props.summary.pending, icon: statusPendingIcon },
  { label: '处理中', value: props.summary.processing, icon: statusProcessingIcon },
  { label: '已处理', value: props.summary.completed, icon: statusCompletedIcon },
])

const riskMetrics = computed(() => [
  { label: '高风险', value: props.summary.highRisk, tone: 'is-high' },
  { label: '中风险', value: props.summary.middleRisk, tone: 'is-middle' },
  { label: '低风险', value: props.summary.lowRisk, tone: 'is-low' },
])

const numberText = (value) => {
  if (value === null || value === undefined || value === '') return '--'
  const number = Number(value)
  return Number.isFinite(number) ? number.toLocaleString('zh-CN') : '--'
}
</script>

<style lang="less" scoped>
.overview-panel {
  display: flex;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  color: #222527;
}
.overview-header {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 18px;
}
h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  line-height: 26px;
}
.header-filters {
  position: relative;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 10px;
}
.header-filters button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #007bff;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
}
.header-filters button .el-icon:last-child {
  font-size: 10px;
}
:deep(.date-picker-host) {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 1px !important;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}
.overview-scroll {
  flex: 1 1 0;
  min-height: 0;
  overflow: auto;
  padding: 0 24px 20px;
  overscroll-behavior: contain;
}
.business-section {
  margin-top: 12px;
}
.business-section + .business-section {
  margin-top: 28px;
}
.section-title {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
  padding-left: 18px;
}
.section-title::before {
  position: absolute;
  left: 0;
  width: 8px;
  height: 8px;
  background: url('@/assets/imgs/point.png') center / contain no-repeat;
  content: '';
}
.section-title h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}
.section-title button {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: #007bff;
  font-size: 12px;
  cursor: pointer;
}
.section-note {
  overflow: hidden;
  color: #a6acb8;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.report-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
}
.metric-card {
  display: flex;
  height: 72px;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid #dce3eb;
  border-radius: 8px;
  background: #fff;
}
.metric-main {
  grid-column: 1 / -1;
}
.metric-main > span:nth-child(2) {
  font-size: 14px;
}
.metric-main.metric-card strong {
  margin-left: auto;
  color: #007bff;
  font-size: 26px;
}
.metric-main.metric-card small {
  color: inherit;
  font-size: 20px;
}
.metric-icon {
  display: block;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  object-fit: contain;
}
.metric-main .metric-icon {
  width: 44px;
  height: 44px;
  flex-basis: 44px;
}
.metric-card div > span {
  display: block;
  color: #9096a2;
  font-size: 14px;
}
.metric-card strong {
  display: block;
  margin-top: 4px;
  font-family: 'Alimama FangYuanTi VF', sans-serif;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
}
.metric-card small {
  margin-left: 2px;
  color: inherit;
  font-family: inherit;
  font-size: 18px;
  font-weight: inherit;
}
.status-grid,
.risk-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 14px;
}
.status-card {
  display: flex;
  height: 110px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  border: 1px solid #dce3eb;
  border-radius: 8px;
}
.status-icon {
  display: block;
  width: 36px;
  height: 36px;
  object-fit: contain;
}
.status-card > span:nth-child(2) {
  margin-top: 8px;
  color: #617185;
  font-size: 14px;
}
.status-card strong,
.risk-card strong,
.ranking-row strong {
  font-family: 'Alimama FangYuanTi VF', sans-serif;
  font-style: normal;
  font-weight: 600;
}
.status-card strong {
  margin-top: 4px;
  font-size: 20px;
}
.risk-card {
  height: 82px;
  padding: 14px;
  border: 1px solid #dce3eb;
  border-radius: 8px;
  text-align: center;
}
.risk-card span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}
.risk-card .icon-d-defense {
  font-size: 16px;
  line-height: 1;
}
.risk-card strong {
  display: block;
  margin-top: 8px;
  font-size: 20px;
}
.risk-card.is-high span {
  color: #ef655a;
}
.risk-card.is-middle span {
  color: #ff922c;
}
.risk-card.is-low span {
  color: #007bff;
}
.ranking-list {
  display: grid;
  gap: 22px;
  margin-top: 14px;
}
.ranking-row > div {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #617185;
  font-size: 14px;
}
.ranking-row > div > i {
  display: grid;
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
  place-items: center;
  border-radius: 4px;
  background: linear-gradient(180deg, #edeff5 0%, #edeff500 100%);
  color: #617185;
  font-family: 'Alimama FangYuanTi VF', sans-serif;
  font-size: 10px;
  font-style: normal;
  line-height: 18px;
}
.ranking-row:nth-child(1) > div > i {
  background: linear-gradient(180deg, #f3d5cd 0%, #edeff500 100%);
}
.ranking-row:nth-child(2) > div > i {
  background: linear-gradient(180deg, #f7e7c5 0%, #edeff500 100%);
}
.ranking-row:nth-child(3) > div > i {
  background: linear-gradient(180deg, #d2e2f7 0%, #edeff500 100%);
}
.ranking-row > div > span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ranking-row strong {
  margin-left: auto;
  color: #222527;
  font-size: 18px;
}
.ranking-progress {
  display: block;
  height: 4px;
  margin: 7px 0 0 30px;
  overflow: hidden;
  border-radius: 2px;
  background: #e8edf2;
}
.ranking-progress i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #007bff;
}
.empty-state {
  padding: 30px 0;
  color: #a6acb8;
  font-size: 14px;
  text-align: center;
}
@media (max-height: 820px) {
  .overview-header {
    padding-top: 18px;
  }
  .business-section + .business-section {
    margin-top: 18px;
  }
  .status-card {
    height: 92px;
  }
}
</style>
