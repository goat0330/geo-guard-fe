<template>
  <section class="report-list-panel">
    <header class="panel-header">
      <button class="back-button" type="button" title="返回群测群防常态" @click="emit('back')">
        <el-icon><ArrowLeft /></el-icon>
      </button>
      <h1>群测群防报送列表</h1>
      <button class="export-button" type="button" @click="exportCurrentPage">
        <el-icon><Upload /></el-icon>导出列表
      </button>
    </header>

    <div class="filters">
      <div class="search-row">
        <el-input v-model="filters.checkCenterLocation" clearable placeholder="搜索上报地点/对象名称" @keyup.enter="applyFilter">
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-button type="primary" @click="applyFilter">搜索</el-button>
      </div>

      <div class="filter-divider"></div>
      <label class="wide-filter">
        <span>行政区划：</span>
        <el-select disabled placeholder="请选择" />
      </label>
      <div class="filter-row">
        <label>
          <span>风险等级：</span>
          <el-select v-model="filters.aiRiskLevel" clearable placeholder="请选择">
            <el-option v-for="item in riskOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </label>
        <label>
          <span>处理状态：</span>
          <el-select v-model="filters.status" clearable placeholder="请选择">
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </label>
      </div>
      <div class="date-row">
        <label>
          <span>时间选择：</span>
          <el-date-picker v-model="filters.checkDate" type="date" value-format="YYYY-MM-DD" placeholder="请选择" />
        </label>
        <el-button type="primary" @click="applyFilter">查询</el-button>
        <el-button @click="resetFilter">重置</el-button>
      </div>
    </div>

    <div v-loading="loading" class="list-body">
      <article
        v-for="report in displayReports"
        :key="report.raw.id"
        class="report-card"
        :class="{ 'is-active': String(selectedId) === String(report.raw.id) }"
        @click="emit('select-report', report.raw)"
      >
        <div class="card-title-row">
          <strong :title="report.name">{{ report.name }}</strong>
          <span v-if="report.riskText" class="ai-risk-badges" :class="report.riskClass">
            <i>AI建议</i><i>{{ report.riskText }}</i>
          </span>
          <span v-else class="pending-ai-badge">待AI分析</span>
          <span class="status-dot" :class="statusClass(report.raw.status)">{{ statusText(report.raw.status) }}</span>
          <button type="button" @click.stop="emit('analyze-report', report.raw)">AI分析<el-icon><ArrowRight /></el-icon></button>
        </div>
        <div class="card-meta"><el-icon><Location /></el-icon><span>上报地点：{{ textValue(report.raw.checkCenterLocation) }}</span></div>
        <div class="card-meta card-meta-double">
          <span><el-icon><Clock /></el-icon>上报时间：{{ textValue(report.raw.checkTime || report.raw.createDate) }}</span>
          <span><el-icon><User /></el-icon>上报人员：{{ textValue(report.raw.userName) }}</span>
        </div>
        <div class="tag-row">
          <span>AI标签：</span>
          <template v-if="report.tags.length">
            <i v-for="tag in report.tags" :key="tag" :title="tag">{{ tag }}</i>
          </template>
          <span v-else class="empty-tag">--</span>
        </div>
      </article>
      <div v-if="!loading && !displayReports.length" class="empty-state">暂无报送记录</div>
    </div>

    <footer v-if="total > pageSize">
      <el-pagination
        background
        small
        layout="prev, pager, next"
        :current-page="pageNum"
        :page-size="pageSize"
        :total="total"
        @current-change="handlePageChange"
      />
    </footer>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { DISASTER_FIELD_ENUM, REPORT_STATUS, REPORT_STATUS_TESXT, RISK_LEVEL_TEXT } from '@/utils/enum.js'

defineOptions({ name: 'GroupDefenseReportList' })

const props = defineProps({
  reports: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
  loading: { type: Boolean, default: false },
  selectedId: { type: [String, Number], default: '' },
})

const emit = defineEmits(['back', 'query', 'select-report', 'analyze-report'])
const pageSize = 10
const pageNum = ref(1)
const filters = reactive({ checkCenterLocation: '', aiRiskLevel: null, status: null, checkDate: '' })

const riskOptions = Object.entries(RISK_LEVEL_TEXT)
  .filter(([value]) => Number(value) > 0)
  .map(([value, label]) => ({ value: Number(value), label: `${label}风险` }))

const statusOptions = Object.entries(REPORT_STATUS_TESXT).map(([value, label]) => ({ value: Number(value), label }))

const parseAiVisionProps = (value) => {
  if (!value) return {}
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
}

const displayReports = computed(() => props.reports.map((raw) => {
  const aiVisionProps = parseAiVisionProps(raw?.aiVisionProps)
  const hasRiskLevel = raw?.aiRiskLevel !== null && raw?.aiRiskLevel !== undefined && raw?.aiRiskLevel !== ''
  const riskLevel = hasRiskLevel ? Number(raw.aiRiskLevel) : null
  const riskLabel = Number.isFinite(riskLevel) ? RISK_LEVEL_TEXT[riskLevel] : undefined
  return {
    raw,
    name: aiVisionProps.disasterType || raw?.checkCenterLocation || '--',
    riskText: riskLabel ? `${riskLabel}风险` : '',
    riskClass: `risk-${riskLevel}`,
    tags: DISASTER_FIELD_ENUM.map((item) => aiVisionProps?.[item.value]).filter(Boolean).slice(0, 4),
  }
}))

const buildQuery = () => {
  const query = {
    pageNum: pageNum.value,
    pageSize,
    checkCenterLocation: filters.checkCenterLocation.trim() || undefined,
    aiRiskLevel: filters.aiRiskLevel ?? undefined,
    status: filters.status ?? undefined,
    orderByColumn: 'createDate',
    isAsc: 'desc',
  }
  if (filters.checkDate) {
    query.params = {
      beginTime: dayjs(filters.checkDate).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
      endTime: dayjs(filters.checkDate).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    }
  }
  return query
}

const applyFilter = () => {
  pageNum.value = 1
  emit('query', buildQuery())
}

const resetFilter = () => {
  filters.checkCenterLocation = ''
  filters.aiRiskLevel = null
  filters.status = null
  filters.checkDate = ''
  applyFilter()
}

const handlePageChange = (value) => {
  pageNum.value = value
  emit('query', buildQuery())
}

const exportCurrentPage = () => {
  if (!props.reports.length) return
  const header = ['上报地点', '上报时间', '上报人员', '风险等级', '处理状态']
  const rows = props.reports.map((report) => [
    report?.checkCenterLocation,
    report?.checkTime || report?.createDate,
    report?.userName,
    RISK_LEVEL_TEXT[Number(report?.aiRiskLevel)],
    REPORT_STATUS_TESXT[report?.status],
  ])
  const escapeCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`
  const csv = [header, ...rows].map((row) => row.map(escapeCell).join(',')).join('\n')
  const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `群测群防报送列表-${dayjs().format('YYYYMMDD-HHmmss')}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

const textValue = (value) => value ?? '--'
const statusText = (value) => REPORT_STATUS_TESXT[value] || '--'
const statusClass = (value) => ({
  [REPORT_STATUS.TO_DO]: 'is-pending',
  [REPORT_STATUS.REPORT]: 'is-processing',
  [REPORT_STATUS.DONE]: 'is-done',
}[value])
</script>

<style lang="less" scoped>
.report-list-panel { display: flex; height: 100%; min-height: 0; flex-direction: column; color: #222527; }
.panel-header { display: flex; height: 66px; flex: 0 0 66px; align-items: center; gap: 4px; padding: 0 24px; }
.back-button { display: grid; width: 28px; height: 28px; place-items: center; color: #222527; cursor: pointer; }
.back-button:hover { color: #007bff; }
h1 { margin: 0; font-size: 18px; font-weight: 600; line-height: 26px; }
.export-button { display: inline-flex; height: 30px; align-items: center; gap: 6px; margin-left: auto; padding: 0 14px; border-radius: 8px; background: #007bff; color: #fff; font-size: 14px; cursor: pointer; }
.filters { flex: 0 0 auto; padding: 0 24px 16px; }
.search-row { display: grid; grid-template-columns: minmax(0, 1fr) 54px; gap: 12px; }
.filter-divider { height: 1px; margin: 18px 0; background: #dcedff; }
.filters label { display: flex; align-items: center; color: #617185; font-size: 14px; white-space: nowrap; }
.filters label > span { flex: 0 0 76px; }
.filters :deep(.el-input), .filters :deep(.el-select), .filters :deep(.el-date-editor) { width: 100%; }
.filters :deep(.el-input__wrapper), .filters :deep(.el-select__wrapper) { min-height: 34px; border-radius: 8px; box-shadow: 0 0 0 1px #dce3eb inset; }
.filters :deep(.el-button) { height: 32px; border-radius: 8px; }
.filter-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 10px; }
.filter-row label > span { flex-basis: 76px; }
.date-row { display: grid; grid-template-columns: minmax(0, 1fr) 54px 54px; gap: 8px; margin-top: 10px; }
.date-row .el-button { height: 32px; margin: 0; }
.list-body { flex: 1 1 0; min-height: 0; overflow: auto; padding: 4px 24px 18px; overscroll-behavior: contain; }
.report-card { margin-bottom: 10px; padding: 14px 16px 12px; border: 1px solid #dce3eb; border-radius: 8px; background: #fff; cursor: pointer; transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease; }
.report-card:hover, .report-card.is-active { border-color: #007bff; background: #f3f8ff; box-shadow: 0 2px 8px rgba(0, 123, 255, 0.08); }
.card-title-row { display: flex; min-width: 0; align-items: center; gap: 6px; }
.card-title-row > strong { min-width: 0; overflow: hidden; color: #222527; font-size: 16px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.card-title-row > button { display: inline-flex; height: 26px; flex: 0 0 auto; align-items: center; gap: 4px; margin-left: auto; padding: 0 12px; border-radius: 8px; background: linear-gradient(90deg, #007bff 12.5%, #00b2ff 100%); color: #fff; font-size: 12px; cursor: pointer; }
.ai-risk-badges { display: inline-flex; flex: 0 0 auto; overflow: hidden; border-radius: 4px; font-size: 10px; }
.ai-risk-badges i { padding: 3px 6px; font-style: normal; }
.ai-risk-badges i:first-child { background: #dcedff; color: #007bff; }
.ai-risk-badges i:last-child { background: #007bff; color: #fff; }
.ai-risk-badges.risk-2 i:first-child { background: #fff1df; color: #ff922c; }
.ai-risk-badges.risk-2 i:last-child { background: #ff922c; }
.ai-risk-badges.risk-3 i:first-child, .ai-risk-badges.risk-4 i:first-child { background: #ffe7e4; color: #ef655a; }
.ai-risk-badges.risk-3 i:last-child, .ai-risk-badges.risk-4 i:last-child { background: #ef655a; }
.pending-ai-badge { flex: 0 0 auto; padding: 3px 6px; border-radius: 4px; background: #edeff5; color: #9096a2; font-size: 10px; }
.status-dot { position: relative; flex: 0 0 auto; padding-left: 10px; color: #9096a2; font-size: 12px; }
.status-dot::before { position: absolute; top: 50%; left: 0; width: 5px; height: 5px; border-radius: 50%; background: #a6acb8; content: ''; transform: translateY(-50%); }
.status-dot.is-pending::before { background: #a6acb8; }.status-dot.is-processing { color: #ff922c; }.status-dot.is-processing::before { background: #ff922c; }.status-dot.is-done { color: #2bb79b; }.status-dot.is-done::before { background: #2bb79b; }
.card-meta { display: flex; min-width: 0; align-items: center; gap: 4px; margin-top: 10px; color: #9096a2; font-size: 12px; }
.card-meta > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.card-meta-double { gap: 18px; }
.card-meta-double > span { display: inline-flex; min-width: 0; align-items: center; gap: 4px; }
.tag-row { display: flex; min-width: 0; align-items: center; gap: 6px; margin-top: 10px; padding-top: 10px; border-top: 1px solid #dcedff; color: #9096a2; font-size: 12px; overflow: hidden; }
.tag-row > i { max-width: 88px; overflow: hidden; padding: 3px 7px; border-radius: 8px; background: #dcedff; color: #007bff; font-style: normal; text-overflow: ellipsis; white-space: nowrap; }
.empty-tag { color: #a6acb8; }
.empty-state { padding: 60px 0; color: #a6acb8; font-size: 14px; text-align: center; }
footer { display: flex; flex: 0 0 auto; justify-content: center; padding: 10px 20px 14px; border-top: 1px solid #dcedff; }
footer :deep(.el-pagination) { --el-pagination-button-color: #617185; --el-pagination-hover-color: #007bff; }
@media (max-height: 820px) { .panel-header { height: 56px; flex-basis: 56px; } .filter-divider { margin: 10px 0; } .report-card { padding-block: 10px; } }
</style>
