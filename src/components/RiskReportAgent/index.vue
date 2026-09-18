<template>
  <Transition name="agent-panel">
    <aside v-if="visible" class="risk-report-agent">
      <header class="agent-header">
        <div class="agent-title"><img :src="analysisIcon" alt="" />风险评价智能体</div>
        <button type="button" title="关闭" aria-label="关闭" @click="emit('close')">
          <i class="iconfont icon-close"></i>
        </button>
      </header>

      <div ref="bodyRef" class="agent-body">
        <p v-if="visibleCount >= 1" class="intro message-enter">
          好的，现在我将基于<span>划定区域的全域地质环境时空数据</span>，清晰拆解AI智能体进行地质灾害<span>动态风险四性评价</span>的思考过程与计算流程：
        </p>

        <article
          v-for="(item, index) in visibleSteps"
          :key="item.title"
          class="analysis-item message-enter"
        >
          <button type="button" class="analysis-title" @click="toggleStep(index)">
            <span><i class="iconfont icon-circle-right"></i>{{ item.title }}</span>
            <i class="iconfont icon-arrow-down" :class="{ 'is-folded': !item.open }"></i>
          </button>
          <Transition name="detail-expand">
            <div v-if="item.open" class="analysis-detail">
              <p v-for="text in item.content" :key="text">{{ text }}</p>
            </div>
          </Transition>
        </article>

        <p v-if="visibleCount >= totalMessages - 1" class="summary message-enter">经过调取数据并逐步计算，系统已完成重庆市今日动态风险四性评价，形成动态风险评价结果。</p>

        <p v-if="visibleCount >= totalMessages" class="finish-message message-enter">
          结合本次风险评价结果，系统已智能生成重点区域的巡查任务更新，可直接推送这些巡查任务，监测员将通过APP收到任务通知。
        </p>

        <div v-if="loading" class="thinking"><i></i><i></i><i></i></div>
      </div>
    </aside>
  </Transition>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
import analysisIcon from '@/assets/imgs/fengxian/analysis.png'

defineOptions({ name: 'RiskReportAgent' })

const props = defineProps({ visible: Boolean })

const emit = defineEmits(['close', 'complete'])
const bodyRef = ref(null)
const visibleCount = ref(0)
const loading = ref(false)
let sequenceTimer = null
let completeTimer = null

const steps = reactive([
  {
    title: '全域时空数据基座加载',
    open: true,
    content: ['风险评价智能体从天空地数据基座批量调取全域地形地貌、地质构造、生态水文等全量时空数据，完成斜坡单元基础地形指标计算、要素叠加、多源数据匹配与校准，构建基于高精度数据的计算基底，支撑全域动态风险四性评价。'],
  },
  {
    title: '区域「地质灾害易发性」评价',
    open: true,
    content: ['智能体基于地形地貌、地质构造、生态水文等评价因子，并使用SMOTE过采样和类权重策略优化数据类型分布，对全域斜坡单元进行基于AutoML+Stacking集成模型的多分类训练，加权求和得到易发性概率并反向阈值映射得到最终的易发性等级，使用训练好的模型进行合并全量推断，完成易发性评价。'],
  },
  {
    title: '区域「地质灾害危险性」评价',
    open: true,
    content: ['智能体耦合降雨等级（实况降雨、预报降雨）、人类工程活动（道路工程扰动、建筑工程扰动）等时间诱发因子，加权计算得到诱发概率，并阈值划分得到诱发等级。基于危险性判断矩阵，综合易发性等级（作为纵向因子）和诱发等级（作为横向因子）两个维度进行动态危险性等级的判断。'],
  },
  {
    title: '区域「地质灾害易损性」评价',
    open: true,
    content: ['智能体综合考量人口样本（居民）和单位样本（企业、个体户等），基于斜坡单元面积与人口样本数量计算得到人口密度、汇总单位样本的注册资本作为经济强度，归一化后按权重合成得到易损性得分，最后采用Jenks分级得到各个斜坡单元的易损性等级，用以评估承载体暴露所可能导致的人员与财产损失风险。'],
  },
  {
    title: '区域「地质灾害风险性」评价',
    open: true,
    content: ['智能体耦合危险性与易损性结果，基于风险性判断矩阵，综合危险性等级（作为纵向因子）和易损性等级（作为横向因子）两个维度进行动态风险性等级的判断，并基于危险性指数、人口暴露和经济暴露计算得到综合风险指数，进行风险性分级排序。'],
  },
])

const totalMessages = steps.length + 3
const visibleSteps = computed(() => steps.slice(0, Math.max(0, visibleCount.value - 1)))

const scrollToBottom = async () => {
  await nextTick()
  if (bodyRef.value) bodyRef.value.scrollTop = bodyRef.value.scrollHeight
}

const clearSequence = () => {
  window.clearInterval(sequenceTimer)
  window.clearTimeout(completeTimer)
  sequenceTimer = null
  completeTimer = null
}

const startSequence = () => {
  clearSequence()
  visibleCount.value = 1
  loading.value = true
  sequenceTimer = window.setInterval(() => {
    visibleCount.value += 1
    void scrollToBottom()
    if (visibleCount.value >= totalMessages) {
      window.clearInterval(sequenceTimer)
      sequenceTimer = null
      loading.value = false
      completeTimer = window.setTimeout(() => emit('complete'), 1200)
    }
  }, 720)
}

const toggleStep = (index) => {
  if (steps[index]) steps[index].open = !steps[index].open
}

watch(() => props.visible, (visible) => {
  if (visible) startSequence()
  else clearSequence()
}, { immediate: true })

onBeforeUnmount(clearSequence)
</script>

<style lang="less" scoped>
.risk-report-agent {
  position: absolute;
  inset: 0 0 0 auto;
  z-index: 24;
  width: 480px;
  max-width: 100%;
  overflow: hidden;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: -4px 0 20px rgba(0, 123, 255, 0.14);
  color: #617185;
}
.agent-header { display: flex; width: 100%; height: 58px; align-items: center; justify-content: space-between; padding: 0 20px; box-sizing: border-box; background: url('@/assets/imgs/fengxian/fxpj-bg.png') center / 120% 100% no-repeat; color: #222527; font-family: 'Alimama FangYuanTi VF', sans-serif; font-size: 18px; font-style: normal; font-weight: Bold-Square; }
.agent-title { display: flex; align-items: center; gap: 8px; }
.agent-title img { width: 20px; height: 20px; object-fit: contain; }
.agent-header button { width: 28px; height: 28px; padding: 0; border: 0; background: transparent; color: #222527; cursor: pointer; }
.agent-header button i { font-size: 16px; }
.agent-body { height: calc(100% - 58px); padding: 20px; overflow-y: auto; box-sizing: border-box; font-size: 14px; line-height: 24px; scroll-behavior: smooth; }
.intro { margin: 0 0 18px; color: #383C41; }
.intro span { color: #007BFF; font-weight: 500; }
.analysis-item { margin-bottom: 12px; }
.analysis-title { display: flex; width: 100%; min-height: 46px; align-items: center; justify-content: space-between; gap: 10px; padding: 8px 12px; border: 1px solid #DCEDFF; border-radius: 8px; background: #f4f8ff; color: #007BFF; font-size: 14px; line-height: 22px; text-align: left; cursor: pointer; }
.analysis-title span { display: flex; align-items: flex-start; gap: 8px; }
.analysis-title span i { margin-top: 3px; font-size: 16px; }
.analysis-title > i { flex: 0 0 auto; transition: transform 0.24s ease; }
.analysis-title > i.is-folded { transform: rotate(180deg); }
.analysis-detail { overflow: hidden; padding: 10px 12px 0; color: #9096A2; }
.analysis-detail p { position: relative; margin: 0 0 8px; padding-left: 12px; }
.analysis-detail p::before { position: absolute; top: 10px; left: 0; width: 4px; height: 4px; border-radius: 50%; background: #A6ACB8; content: ''; }
.summary, .finish-message { margin: 18px 0 0; color: #617185; }
.finish-message { padding: 12px; border-left: 4px solid #007BFF; border-radius: 0 6px 6px 0; background: #E0EEFA; color: #383C41; }
.thinking { display: flex; gap: 5px; padding: 12px 2px; }
.thinking i { width: 6px; height: 6px; border-radius: 50%; background: #007BFF; animation: thinking 1s infinite ease-in-out; }
.thinking i:nth-child(2) { animation-delay: 0.16s; }.thinking i:nth-child(3) { animation-delay: 0.32s; }
.message-enter { animation: message-in 0.28s ease both; }
.detail-expand-enter-active, .detail-expand-leave-active { transition: max-height 0.24s ease, opacity 0.2s ease; }
.detail-expand-enter-from, .detail-expand-leave-to { max-height: 0; opacity: 0; }.detail-expand-enter-to, .detail-expand-leave-from { max-height: 120px; opacity: 1; }
.agent-panel-enter-active, .agent-panel-leave-active { transition: transform 0.28s ease, opacity 0.24s ease; }
.agent-panel-enter-from, .agent-panel-leave-to { opacity: 0; transform: translateX(30px); }
@keyframes message-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes thinking { 0%, 60%, 100% { transform: translateY(0); opacity: 0.35; } 30% { transform: translateY(-4px); opacity: 1; } }
</style>
