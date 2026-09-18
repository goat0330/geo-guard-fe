<template>
  <aside class="report-detail-panel">
    <header>
      <h1><el-icon><MagicStick /></el-icon>群治群防智能体</h1>
      <button type="button" title="关闭智能体面板" @click="emit('close')"><el-icon><Close /></el-icon></button>
    </header>

    <div v-loading="loading" class="detail-scroll">
      <template v-if="report">
        <h2>报灾事件AI分析过程：</h2>

        <section v-for="section in sections" :key="section.key" class="process-section">
          <button class="section-title" type="button" @click="toggleSection(section.key)">
            <span><el-icon><CircleCheck /></el-icon>{{ section.title }}</span>
            <el-icon class="section-arrow" :class="{ 'is-collapsed': !isExpanded(section.key) }"><ArrowUp /></el-icon>
          </button>
          <div class="section-body" :class="{ 'is-collapsed': !isExpanded(section.key) }">
            <div>
              <template v-if="section.key === 'photos'">
                <div v-if="photos.length" class="photo-grid">
                  <img v-for="url in photos.slice(0, 4)" :key="url" :src="url" alt="报灾现场图片" />
                </div>
                <p v-else class="empty-content">--</p>
              </template>

              <template v-else-if="section.key === 'space'">
                <p class="analysis-content">{{ analysisText }}</p>
              </template>

              <template v-else-if="section.key === 'vision'">
                <ul v-if="visionItems.length" class="vision-list">
                  <li v-for="item in visionItems" :key="item.label"><b>{{ item.label }}：</b>{{ item.value }}</li>
                </ul>
                <p v-else class="empty-content">--</p>
              </template>

              <template v-else-if="section.key === 'risk'">
                <p class="risk-result">风险等级：<strong :class="riskClass">{{ riskText }}</strong></p>
              </template>

              <template v-else>
                <p class="analysis-content">{{ reportText }}</p>
              </template>
            </div>
          </div>
        </section>

        <p class="task-status">该任务状态：<strong>{{ statusText }}</strong></p>
      </template>
      <div v-else-if="!loading" class="empty-state">暂无报送详情</div>
    </div>

    <footer>
      <button type="button" :disabled="!report" @click="emit('feedback', report)"><el-icon><ChatLineSquare /></el-icon>提交反馈</button>
      <button type="button" :disabled="!report" @click="emit('send', report)"><el-icon><User /></el-icon>发送给责任人</button>
    </footer>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue'
import { DISASTER_FIELD_ENUM, REPORT_STATUS_TESXT, RISK_LEVEL_TEXT } from '@/utils/enum.js'

defineOptions({ name: 'GroupDefenseReportDetail' })

const props = defineProps({
  report: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  photos: { type: Array, default: () => [] },
})

const emit = defineEmits(['close', 'feedback', 'send'])
const expandedKeys = ref(new Set(['photos', 'space', 'vision', 'risk', 'report']))

const sections = [
  { key: 'photos', title: '图片加载和预处理' },
  { key: 'space', title: '上报地点空间分析' },
  { key: 'vision', title: '多模态大模型图像识别' },
  { key: 'risk', title: '推理大模型进行风险判级' },
  { key: 'report', title: '输出详细识别报告' },
]

const parseObject = (value) => {
  if (!value) return {}
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch {
    return {}
  }
}

const aiVisionProps = computed(() => parseObject(props.report?.aiVisionProps))
const visionItems = computed(() => DISASTER_FIELD_ENUM
  .map((item) => ({ label: item.label, value: aiVisionProps.value?.[item.value] }))
  .filter((item) => item.value !== null && item.value !== undefined && item.value !== ''))

const normalizeText = (value) => {
  if (value === null || value === undefined || value === '') return '--'
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return '--'
  }
}

const analysisText = computed(() => normalizeText(props.report?.aiAnalysisData))
const reportText = computed(() => normalizeText(props.report?.aiReportDetail))
const riskText = computed(() => {
  const text = RISK_LEVEL_TEXT[Number(props.report?.aiRiskLevel)]
  return text ? `${text}风险` : '--'
})
const riskClass = computed(() => `risk-${Number(props.report?.aiRiskLevel)}`)
const statusText = computed(() => REPORT_STATUS_TESXT[props.report?.status] || '--')

const isExpanded = (key) => expandedKeys.value.has(key)
const toggleSection = (key) => {
  const next = new Set(expandedKeys.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expandedKeys.value = next
}
</script>

<style lang="less" scoped>
.report-detail-panel { display: flex; height: 100%; min-height: 0; flex-direction: column; color: #222527; }
.report-detail-panel > header { display: flex; height: 66px; flex: 0 0 66px; align-items: center; justify-content: space-between; padding: 0 24px; background: linear-gradient(90deg, #f1f7ff 0%, #fff5f5 100%); }
.report-detail-panel > header h1 { display: flex; align-items: center; gap: 8px; margin: 0; font-size: 18px; font-weight: 600; }
.report-detail-panel > header h1 .el-icon { color: #007bff; font-size: 22px; }
.report-detail-panel > header button { display: grid; width: 30px; height: 30px; place-items: center; border-radius: 6px; color: #617185; cursor: pointer; }
.report-detail-panel > header button:hover { background: #dcedff; color: #007bff; }
.detail-scroll { flex: 1 1 0; min-height: 0; overflow: auto; padding: 24px; overscroll-behavior: contain; }
.detail-scroll > h2 { margin: 0 0 18px; font-size: 16px; font-weight: 600; }
.process-section + .process-section { margin-top: 14px; }
.section-title { display: flex; width: 100%; height: 44px; align-items: center; justify-content: space-between; padding: 0 16px; border: 1px solid #dcedff; border-radius: 8px; background: #f5f9ff; color: #007bff; cursor: pointer; }
.section-title > span { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; }
.section-arrow { transition: transform 0.24s ease; }.section-arrow.is-collapsed { transform: rotate(180deg); }
.section-body { display: grid; grid-template-rows: 1fr; opacity: 1; transition: grid-template-rows 0.28s ease, opacity 0.2s ease; }
.section-body.is-collapsed { grid-template-rows: 0fr; opacity: 0; }
.section-body > div { min-height: 0; overflow: hidden; }
.photo-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; padding: 14px 16px 0; }
.photo-grid img { width: 100%; aspect-ratio: 1.45; border-radius: 6px; object-fit: cover; }
.analysis-content { margin: 0; padding: 14px 16px 0; color: #617185; font-size: 14px; line-height: 24px; white-space: pre-wrap; word-break: break-word; }
.vision-list { display: grid; gap: 10px; padding: 14px 18px 0; color: #617185; font-size: 14px; line-height: 22px; }
.vision-list li { position: relative; padding-left: 12px; }
.vision-list li::before { position: absolute; top: 9px; left: 0; width: 4px; height: 4px; border-radius: 50%; background: #617185; content: ''; }
.vision-list b { color: #222527; font-weight: 500; }
.risk-result { margin: 0; padding: 14px 16px 0; color: #617185; font-size: 14px; }
.risk-result strong { font-weight: 600; }.risk-result .risk-1 { color: #007bff; }.risk-result .risk-2 { color: #ff922c; }.risk-result .risk-3, .risk-result .risk-4 { color: #ef655a; }
.empty-content { padding: 14px 16px 0; color: #a6acb8; font-size: 14px; }
.task-status { margin: 26px 0 0; color: #617185; font-size: 14px; }.task-status strong { color: #2bb79b; font-weight: 600; }
.empty-state { padding: 80px 0; color: #a6acb8; font-size: 14px; text-align: center; }
footer { display: grid; flex: 0 0 auto; grid-template-columns: 1fr 1fr; gap: 16px; padding: 16px 24px 20px; background: #fff; }
footer button { display: flex; height: 48px; align-items: center; justify-content: center; gap: 8px; border: 1px solid #007bff; border-radius: 6px; color: #007bff; font-size: 16px; cursor: pointer; transition: background-color 0.2s ease, color 0.2s ease; }
footer button:last-child { background: #007bff; color: #fff; }
footer button:not(:disabled):hover { background: #dcedff; } footer button:last-child:not(:disabled):hover { background: #0069dd; }
footer button:disabled { cursor: not-allowed; opacity: 0.5; }
</style>
