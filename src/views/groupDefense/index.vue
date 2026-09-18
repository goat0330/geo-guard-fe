<template>
  <div class="group-defense-page" :class="{ 'is-process': activeView === 'process' }">
    <section class="map-stage" aria-label="群测群防地图">
      <MarsMap ref="marsMapRef" />
      <MapOverlayControls
        :class="{ 'has-right-panel': activeView === 'process' }"
        @zoom-in="marsMapRef?.handleZoomIn()"
        @zoom-out="marsMapRef?.handleZoomOut()"
        @locate-home="marsMapRef?.flyToHome()"
        @change-base-map="marsMapRef?.changeBaseMap($event)"
        @toggle-imagery-label="marsMapRef?.toggleImageryLabel($event)"
      />


      <aside class="left-panel" :class="{ 'is-hidden': !leftPanelVisible }">
        <Transition name="panel-swap" mode="out-in">
          <GroupDefenseOverview
            v-if="activeView === 'overview'"
            key="overview"
            :summary="summary"
            :rankings="rankings"
            @show-reports="switchView('reports')"
          />
          <GroupDefenseReportList
            v-else
            key="reports"
            :reports="reports"
            :total="total"
            :loading="listLoading"
            :selected-id="selectedReport?.id"
            @back="switchView('overview')"
            @query="fetchReports"
            @select-report="selectReport"
            @analyze-report="openProcess"
          />
        </Transition>
      </aside>

      <Transition name="map-popup">
        <GroupDefenseMapPopup
          v-if="selectedReport && mapPopupVisible"
          class="report-map-popup"
          :report="selectedReport"
          :photos="photoUrls"
          @close="mapPopupVisible = false"
        />
      </Transition>

      <Transition name="right-panel">
        <GroupDefenseReportDetail
          v-if="activeView === 'process'"
          class="detail-panel"
          :report="selectedReport"
          :photos="photoUrls"
          :loading="detailLoading"
          @close="switchView('reports')"
          @feedback="showUnavailableAction"
          @send="showUnavailableAction"
        />
      </Transition>
    </section>

    <button
      class="panel-toggle"
      :class="{ 'is-hidden': !leftPanelVisible }"
      type="button"
      :title="leftPanelVisible ? '收起业务面板' : '展开业务面板'"
      @click="leftPanelVisible = !leftPanelVisible"
    >
      <img :src="leftPanelVisible ? leftArrow : rightArrow" alt="" />
    </button>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import MarsMap from '@/components/MarsMap/index.vue'
import MapOverlayControls from '@/components/MapOverlayControls/index.vue'
import GroupDefenseOverview from '@/components/GroupDefenseOverview/index.vue'
import GroupDefenseReportList from '@/components/GroupDefenseReportList/index.vue'
import GroupDefenseReportDetail from '@/components/GroupDefenseReportDetail/index.vue'
import GroupDefenseMapPopup from '@/components/GroupDefenseMapPopup/index.vue'
import { getPhotoUrls } from '@/utils/index.js'
import leftArrow from '@/assets/imgs/left-arr.png'
import rightArrow from '@/assets/imgs/right-arr.png'

defineOptions({ name: 'GroupDefensePage' })

const route = useRoute()
const router = useRouter()
const marsMapRef = ref(null)
const leftPanelVisible = ref(true)
const reports = ref([])
const total = ref(0)
const listLoading = ref(false)
const selectedReport = ref(null)
const photoUrls = ref([])
const mapPopupVisible = ref(true)
const detailLoading = ref(false)
let photoRequestId = 0

// 当前模块尚未接入业务接口，暂时使用本地展示数据。
const mockSummary = Object.freeze({
  todayCount: 1286,
  reporterCount: 1168,
  townCount: 1029,
  photoCount: 1224,
  pendingAiCount: 1086,
  pending: 1208,
  processing: 1312,
  completed: 1536,
  analyzedCount: 4050,
  highRisk: 1004,
  middleRisk: 1218,
  lowRisk: 1828,
})
const mockRankings = Object.freeze([
  { name: '汉葭街道', value: 1818, width: '100%' },
  { name: '保家镇', value: 1414, width: '78%' },
  { name: '高谷镇', value: 1111, width: '62%' },
  { name: '郁山镇', value: 1008, width: '44%' },
  { name: '普子镇', value: 1006, width: '34%' },
])
const mockReports = Object.freeze([
  {
    id: 'mock-006',
    checkCenterLocation: '龙射镇东方村居民点后侧斜坡',
    checkTime: dayjs().hour(10).minute(18).second(0).format('YYYY-MM-DD HH:mm:ss'),
    userName: '周永安',
    status: 1,
    aiRiskLevel: null,
    sceneTextRecord: '巡查发现坡面局部湿润，已上传现场照片等待AI分析。',
    aiVisionProps: null,
    aiAnalysisData: null,
    aiReportDetail: null,
  },
  {
    id: 'mock-001',
    checkCenterLocation: '汉葭街道鼓楼社区后山斜坡',
    checkTime: dayjs().hour(9).minute(36).second(0).format('YYYY-MM-DD HH:mm:ss'),
    userName: '张建国',
    status: 1,
    aiRiskLevel: 3,
    sceneTextRecord: '坡脚出现新裂缝，降雨后裂缝宽度有所增加。',
    aiVisionProps: { disasterType: '斜坡裂缝', freshEextent: '新鲜', dzStage: '变形阶段', imageType: '现场照片', deformation: '拉张裂缝' },
    aiAnalysisData: '上报位置位于居民点后缘斜坡，坡脚邻近道路和房屋，需持续观察裂缝变化。',
    aiReportDetail: '建议立即设置警戒区域，安排监测员加密巡查，并组织专业人员现场复核。',
  },
  {
    id: 'mock-002',
    checkCenterLocation: '保家镇鹿山社区公路边坡',
    checkTime: dayjs().hour(8).minute(52).second(0).format('YYYY-MM-DD HH:mm:ss'),
    userName: '李明华',
    status: 2,
    aiRiskLevel: 2,
    sceneTextRecord: '公路内侧边坡有零星掉块，排水沟局部堵塞。',
    aiVisionProps: { disasterType: '边坡掉块', freshEextent: '较新鲜', dzStage: '初始阶段', imageType: '现场照片', deformation: '局部掉块' },
    aiAnalysisData: '边坡表层岩土体松动，当前变形范围较小，持续降雨可能加剧掉块。',
    aiReportDetail: '建议疏通排水沟、清理松动块石，并在强降雨期间加强巡查。',
  },
  {
    id: 'mock-003',
    checkCenterLocation: '高谷镇狮子社区居民点',
    checkTime: dayjs().subtract(1, 'day').hour(17).minute(24).second(0).format('YYYY-MM-DD HH:mm:ss'),
    userName: '王晓梅',
    status: 3,
    aiRiskLevel: 1,
    sceneTextRecord: '房后排水沟有少量泥沙淤积，未发现明显裂缝。',
    aiVisionProps: { disasterType: '沟道淤积', freshEextent: '一般', dzStage: '稳定阶段', imageType: '现场照片', deformation: '无明显变形' },
    aiAnalysisData: '现场未识别到明显变形迹象，沟道排水能力受到轻微影响。',
    aiReportDetail: '建议清理沟道淤积物，按常规频次持续巡查。',
  },
  {
    id: 'mock-004',
    checkCenterLocation: '郁山镇钟鼓村学校北侧',
    checkTime: dayjs().subtract(1, 'day').hour(15).minute(8).second(0).format('YYYY-MM-DD HH:mm:ss'),
    userName: '陈志强',
    status: 2,
    aiRiskLevel: 4,
    sceneTextRecord: '挡墙外鼓并伴随渗水，墙顶地面出现连续裂缝。',
    aiVisionProps: { disasterType: '挡墙变形', freshEextent: '新鲜', dzStage: '加速变形阶段', imageType: '现场照片', bearing_type: '学校', deformation: '外鼓裂缝' },
    aiAnalysisData: '挡墙变形迹象明显，影响范围邻近学校，承灾体敏感度较高。',
    aiReportDetail: '建议立即划定危险区并组织现场核查，必要时提前转移受威胁人员。',
  },
  {
    id: 'mock-005',
    checkCenterLocation: '普子镇双桥社区河沟沿线',
    checkTime: dayjs().subtract(2, 'day').hour(11).minute(42).second(0).format('YYYY-MM-DD HH:mm:ss'),
    userName: '赵海波',
    status: 1,
    aiRiskLevel: 2,
    sceneTextRecord: '沟岸局部冲刷，雨后有少量土体滑落。',
    aiVisionProps: { disasterType: '沟岸坍塌', freshEextent: '较新鲜', dzStage: '初始阶段', imageType: '现场照片', deformation: '局部坍塌' },
    aiAnalysisData: '沟岸受水流冲刷后稳定性降低，当前滑落范围有限。',
    aiReportDetail: '建议设置临时警示标识，关注后续降雨和水位变化。',
  },
])
const activeView = computed(() => {
  const view = route.query.view
  return ['reports', 'process'].includes(view) ? view : 'overview'
})

const summary = mockSummary
const rankings = mockRankings

const switchView = (view, reportId) => {
  const query = { ...route.query }
  delete query.preview
  if (view === 'overview') {
    delete query.view
    delete query.id
  } else {
    query.view = view
    if (reportId !== null && reportId !== undefined && reportId !== '') query.id = String(reportId)
    else if (view !== 'process') delete query.id
  }
  router.replace({ query })
}

const fetchReports = (query = {}) => {
  const keyword = String(query.checkCenterLocation || '').trim()
  const beginTime = query.params?.beginTime
  const endTime = query.params?.endTime
  const filtered = mockReports.filter((report) => {
    const matchesKeyword = !keyword
      || report.checkCenterLocation.includes(keyword)
      || report.aiVisionProps.disasterType.includes(keyword)
    const matchesRisk = query.aiRiskLevel === null || query.aiRiskLevel === undefined
      || report.aiRiskLevel === Number(query.aiRiskLevel)
    const matchesStatus = query.status === null || query.status === undefined
      || report.status === Number(query.status)
    const matchesDate = (!beginTime || report.checkTime >= beginTime) && (!endTime || report.checkTime <= endTime)
    return matchesKeyword && matchesRisk && matchesStatus && matchesDate
  })
  const pageNum = Number(query.pageNum) || 1
  const pageSize = Number(query.pageSize) || 10
  reports.value = filtered.slice((pageNum - 1) * pageSize, pageNum * pageSize)
  total.value = filtered.length
  selectedReport.value = reports.value[0] || null
  mapPopupVisible.value = Boolean(selectedReport.value)
}

const selectReport = (report) => {
  if (!report || typeof report !== 'object') return
  selectedReport.value = report
  mapPopupVisible.value = true
}

const openProcess = (report) => {
  selectReport(report)
  if (report?.id === null || report?.id === undefined || report?.id === '') return
  switchView('process', report.id)
}

const fetchReportDetail = (reportId) => {
  if (reportId === null || reportId === undefined || reportId === '') return
  selectedReport.value = mockReports.find((report) => String(report.id) === String(reportId)) || null
  detailLoading.value = false
}

const loadReportPhotos = async (photos) => {
  const currentRequestId = ++photoRequestId
  if (!photos || (Array.isArray(photos) && !photos.length)) {
    photoUrls.value = []
    return
  }
  try {
    const urls = await getPhotoUrls(photos)
    if (currentRequestId === photoRequestId) photoUrls.value = Array.isArray(urls) ? urls : []
  } catch (error) {
    console.error('获取报灾图片失败', error)
    if (currentRequestId === photoRequestId) photoUrls.value = []
  }
}

const showUnavailableAction = () => {
  ElMessage.warning('当前接口未提供该操作')
}

watch(() => route.query.id, (reportId) => {
  if (activeView.value === 'process') fetchReportDetail(reportId)
}, { immediate: true })

watch(() => selectedReport.value?.photos, loadReportPhotos, { immediate: true })

onMounted(() => {
  fetchReports()
})
</script>

<style lang="less" scoped>
@font-face { font-family: 'Group Number'; src: url('@/assets/font/AlimamaFangYuanTiVF-Thin.ttf') format('truetype'); font-style: normal; font-weight: 100 900; font-display: swap; unicode-range: U+0025, U+002C-002E, U+0030-003A; }
.group-defense-page { position: relative; display: flex; width: 100%; height: 100%; min-width: 0; min-height: 0; flex: 1 1 auto; overflow: visible; background: transparent; font-family: 'Group Number', 'AlibabaPuHuiTi', sans-serif; }
.map-stage { position: relative; width: 100%; height: 100%; min-height: 100%; overflow: hidden; border-radius: 16px; background: #2b3e4a; isolation: isolate; transform: translateZ(0); }
.left-panel, .detail-panel { position: absolute; top: 0; bottom: 0; z-index: 10; width: 460px; max-width: calc(100% - 32px); overflow: hidden; border-radius: 16px; background: #fff; box-shadow: 4px 0 20px rgba(0, 32, 80, 0.12); }
.left-panel { left: 0; transform: translateX(0); transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1); }
.left-panel.is-hidden { pointer-events: none; transform: translateX(-100%); }
.detail-panel { right: 0; box-shadow: -4px 0 20px rgba(0, 32, 80, 0.12); }
.panel-toggle { position: absolute; top: 50%; left: 0; z-index: 12; display: flex; width: 20px; height: 72px; align-items: center; justify-content: center; padding: 0; border: 1px solid rgba(204, 204, 204, 0.4); border-radius: 17px; background: #fff; cursor: pointer; transform: translateY(-50%) translateX(450px); transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s ease; }
.panel-toggle.is-hidden { transform: translateY(-50%) translateX(-10px); }
.panel-toggle:hover { box-shadow: 0 2px 8px rgba(0, 123, 255, 0.18); }
.panel-toggle img { width: 14px; height: 14px; object-fit: contain; }
.report-map-popup { position: absolute; top: 22%; left: 58%; z-index: 9; transform: translateX(-50%); }
.is-process .report-map-popup { left: 50%; }
:deep(.map-overlay-controls .filter-groups), :deep(.map-overlay-controls .map-tools) { transition: right 0.28s ease; }
:deep(.map-overlay-controls.has-right-panel .filter-groups), :deep(.map-overlay-controls.has-right-panel .map-tools) { right: 476px; }
.panel-swap-enter-active, .panel-swap-leave-active { transition: opacity 0.18s ease, transform 0.22s ease; }
.panel-swap-enter-from { opacity: 0; transform: translateX(18px); }.panel-swap-leave-to { opacity: 0; transform: translateX(-18px); }
.right-panel-enter-active, .right-panel-leave-active { transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease; }
.right-panel-enter-from, .right-panel-leave-to { opacity: 0; transform: translateX(100%); }
.map-popup-enter-active, .map-popup-leave-active { transition: opacity 0.22s ease, transform 0.24s ease; }
.map-popup-enter-from, .map-popup-leave-to { opacity: 0; transform: translate(-50%, 10px); }
@media (max-width: 1366px) { .left-panel, .detail-panel { width: 420px; } .panel-toggle { transform: translateY(-50%) translateX(410px); } .panel-toggle.is-hidden { transform: translateY(-50%) translateX(-10px); } :deep(.map-overlay-controls.has-right-panel .filter-groups), :deep(.map-overlay-controls.has-right-panel .map-tools) { right: 436px; } .report-map-popup { width: 340px; } }
</style>
