<template>
  <div v-loading="loading" class="dynamic-risk-report-page">
    <header class="page-header">
      <button type="button" class="back-button" title="返回风险情况概览" @click="goBack">
        <ArrowLeft />
      </button>
      <h1>动态风险评价“一张图”</h1>
      <button
        type="button"
        class="download-button"
        :disabled="downloading || !mapReady"
        :title="downloading ? '报告生成中' : '下载报告'"
        aria-label="下载报告"
        @click="downloadReport"
      >
        <i class="iconfont icon-download"></i>
      </button>
    </header>

    <section class="map-section">
      <DynamicRiskMap ref="mapRef" :units="units" preserve-drawing-buffer @ready="mapReady = true" />
      <div class="legend-panel">
        <strong>图例</strong>
        <div v-for="item in legends" :key="item.level"><i :style="{ background: item.color }"></i>{{ item.label }}风险</div>
      </div>
      <div v-if="!loading && !units.length" class="empty-state">暂无动态风险斜坡数据</div>
    </section>

    <section class="report-section">
      <DynamicRiskReportContent :units="units" @choose-unit="focusUnit" />
    </section>

    <div ref="exportRef" class="export-content">
      <h1>动态风险评价“一张图”</h1>
      <img v-if="exportMapImage" :src="exportMapImage" alt="动态风险评价地图" />
      <DynamicRiskReportContent :units="units" is-download />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { saveAs } from 'file-saver'
import DynamicRiskMap from '@/components/DynamicRiskMap/index.vue'
import DynamicRiskReportContent from '@/components/DynamicRiskReportContent/index.vue'
import { getSlopeUnitList } from '@/api/common.js'
import { exportDomToDocx } from '@/utils/docx.js'
import { RISK_LEVEL_COLOR, RISK_LEVEL_TEXT } from '@/utils/enum.js'

defineOptions({ name: 'DynamicRiskReport' })

const router = useRouter()
const mapRef = ref(null)
const exportRef = ref(null)
const units = ref([])
const loading = ref(false)
const downloading = ref(false)
const mapReady = ref(false)
const exportMapImage = ref('')
const legends = [4, 3, 2, 1].map((level) => ({ level, label: RISK_LEVEL_TEXT[level], color: RISK_LEVEL_COLOR[level] }))

const loadUnits = async () => {
  loading.value = true
  try {
    const data = await getSlopeUnitList({ dynamicRiskLevelList: [4, 3, 2, 1] })
    units.value = Array.isArray(data) ? data.filter((item) => item?.wkt) : []
  } catch {
    units.value = []
  } finally {
    loading.value = false
  }
}

const focusUnit = (unit) => {
  const target = units.value.find((item) => String(item?.id) === String(unit?.id))
  if (!target) return
  mapRef.value?.showUnit(target)
}

const downloadReport = async () => {
  if (downloading.value || !mapReady.value) return
  downloading.value = true
  try {
    exportMapImage.value = await mapRef.value?.exportImage()
    const blob = await exportDomToDocx(exportRef.value)
    saveAs(blob, '动态风险评价一张图.docx')
  } catch (error) {
    console.error('下载动态风险评价报告失败', error)
    ElMessage.error('报告生成失败，请稍后重试')
  } finally {
    downloading.value = false
  }
}

const goBack = () => router.push({ name: 'RiskEval' })

onMounted(loadUnits)
</script>

<style lang="less" scoped>
.dynamic-risk-report-page { display: flex; width: 100%; min-height: 100%; flex: 1 1 auto; flex-direction: column; overflow: hidden; border-radius: 16px; background: #ffffff; color: #222527; }
.page-header { position: relative; display: flex; height: 64px; flex: 0 0 64px; align-items: center; justify-content: space-between; padding: 0 24px; box-sizing: border-box; }
.page-header h1 { position: absolute; left: 50%; margin: 0; transform: translateX(-50%); color: #222527; font-size: 24px; line-height: 34px; }
.back-button, .download-button { display: grid; width: 24px; height: 24px; place-items: center; padding: 0; border: 1px solid #DCEDFF; border-radius: 4px; background: #ffffff; color: #9096A2; cursor: pointer; transition: color .2s ease, border-color .2s ease, background-color .2s ease; }
.back-button:hover, .download-button:not(:disabled):hover { border-color: #007BFF; background: #E0EEFA; color: #007BFF; }
.back-button svg, .download-button i { width: 16px; height: 16px; font-size: 16px; }
.download-button:disabled { border-color: #E0EEFA; background: #ffffff; color: #A6ACB8; cursor: not-allowed; }
/* 地图和报告共用页面横向边距，保证上下内容两端齐平。 */
.map-section { position: relative; min-height: 360px; flex: 1 1 54%; margin: 0 24px; overflow: hidden; border-radius: 8px; }
.legend-panel { position: absolute; right: 20px; bottom: 20px; z-index: 5; display: flex; min-width: 112px; flex-direction: column; gap: 8px; padding: 12px; border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 4px; background: rgba(97, 113, 133, 0.62); backdrop-filter: blur(10px); color: rgba(255, 255, 255, 0.88); font-size: 12px; }
.legend-panel strong { color: #ffffff; font-size: 12px; }.legend-panel div { display: flex; align-items: center; gap: 10px; }.legend-panel i { width: 32px; height: 14px; border: 1px solid rgba(255, 255, 255, 0.5); border-radius: 2px; }
.empty-state { position: absolute; inset: 0; z-index: 4; display: flex; align-items: center; justify-content: center; background: rgba(34, 37, 39, 0.2); color: #ffffff; font-size: 16px; }
.report-section { height: 280px; flex: 0 0 280px; margin: 0 24px; padding: 36px 28px 18px; overflow-y: auto; box-sizing: border-box; }
.export-content { position: fixed; top: 0; left: -10000px; width: 800px; padding: 20px; background: #ffffff; box-sizing: border-box; }
.export-content > h1 { margin: 0 0 16px; color: #222527; font-size: 24px; text-align: center; }.export-content > img { display: block; width: 760px; height: auto; margin-bottom: 18px; }
@media (max-height: 800px) { .map-section { min-height: 280px; }.report-section { height: 220px; flex-basis: 220px; padding-top: 24px; } }
@media (max-width: 768px) { .page-header, .map-section, .report-section { margin-right: 16px; margin-left: 16px; }.page-header { padding: 0; }.page-header h1 { font-size: 20px; }.report-section { padding-right: 16px; padding-left: 16px; } }
</style>
