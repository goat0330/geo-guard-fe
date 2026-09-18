<template>
  <Transition name="agent-panel">
  <aside v-if="visible" class="risk-analysis-agent">
    <header class="agent-header">
      <div><img :src="analysisIcon" alt="" />风险评价智能体</div>
      <button title="关闭" @click="emit('close')"><i class="iconfont icon-close"></i></button>
    </header>
    <div class="agent-body">
      <p class="intro">好的，我现在将基于 <strong>「斜坡单元编码:{{ slope.code }}」</strong> 的全量数据，按流程为您推理动态风险等级的计算过程，尽量让每一步的过程都清晰呈现：</p>
      <article v-for="item in analysisItems" :key="item.title" class="analysis-item">
        <button class="analysis-title" @click="item.open = !item.open">
          <span><i class="iconfont icon-circle-right"></i>{{ item.title }}</span>
          <i class="iconfont icon-arrow-down" :class="{ 'is-folded': !item.open }"></i>
        </button>
        <div v-show="item.open" class="analysis-detail">
          <p v-for="text in item.content" :key="text">{{ text }}</p>
        </div>
      </article>
      <p class="result">经过调取数据并逐步计算，<strong>{{ slope.code }}</strong> 动态风险等级结果为 <b>黄色-中风险</b>。</p>
    </div>
  </aside>
  </Transition>
</template>

<script setup>
import { reactive } from 'vue'
import analysisIcon from '@/assets/imgs/fengxian/analysis.png'

defineProps({ visible: Boolean, slope: { type: Object, default: () => ({}) } })
const emit = defineEmits(['close'])
const analysisItems = reactive([
  { title: '已完成调取DXG-MG06斜坡单元的基础信息', open: true, content: ['根据野外调查数据，该斜坡位于重庆市彭水自治县汉葭街道，地处果园路沿线。', '地形地貌：斜坡位于构造剥蚀中低山丘陵地貌，坡体坡向东南。'] },
  { title: '已完成调取DXG-MG06斜坡单元“易发性”结果', open: true, content: ['按照滑坡易发性评价指标体系，智能体将提取地质条件、地形条件、植被覆盖率等评价因子。'] },
  { title: '已完成调取DXG-MG06斜坡单元“危险性”结果', open: false, content: ['综合工程地质条件、降雨条件与监测数据，完成危险性计算。'] },
  { title: '已完成调取DXG-MG06斜坡单元“易损性”结果', open: false, content: ['结合人口、房屋及基础设施暴露度完成易损性计算。'] },
  { title: '已完成调取DXG-MG06斜坡单元“风险性”结果', open: true, content: ['综合判定该斜坡单元的风险等级为中风险性。'] },
])
</script>

<style lang="less" scoped>
.risk-analysis-agent { position: absolute; top: 0; right: 0; bottom: 0; z-index: 20; width: 480px; border-radius: 16px; background: #fff; box-shadow: -4px 0 20px #0087ca24; color: #617185; overflow: hidden; }
.agent-header { width: 100%; height: 57px; padding: 0; box-sizing: border-box; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; background: url('@/assets/imgs/fengxian/fxpj-bg.png') center / 120% 100% no-repeat; color: #222527; font-family: 'AlibabaPuHuiTi', sans-serif; font-size: 18px; font-style: normal; font-weight: 700; line-height: 18px; }
.agent-header div { display: flex; align-items: center; gap: 8px; }.agent-header img { width: 20px; height: 20px; object-fit: contain; }.agent-header button { border: 0; background: transparent; cursor: pointer; color: #222527; }.agent-header i { font-size: 16px; }
.agent-body { height: calc(100% - 67px); padding: 20px; box-sizing: border-box; overflow-y: auto; font-size: 14px; line-height: 24px; }.intro { margin: 0 0 16px; color: #383c41; }.intro strong, .result b { color: #007bff; }
.analysis-item { margin-bottom: 12px; }.analysis-title { width: 100%; min-height: 46px; padding: 0 12px; display: flex; align-items: center; justify-content: space-between; border: 1px solid #dce3eb; border-radius: 10px; background: #f4f8ff; color: #007bff; font-size: 14px; cursor: pointer; text-align: left; }.analysis-title span { display: flex; align-items: center; gap: 8px; }.analysis-title span i { font-size: 16px; }.analysis-title > i { transition: transform .2s ease; }.analysis-title > i.is-folded { transform: rotate(180deg); }.analysis-detail { padding: 10px 12px 0; color: #9096a2; }.analysis-detail p { position: relative; margin: 0 0 8px; padding-left: 12px; }.analysis-detail p::before { content: ''; position: absolute; top: 10px; left: 0; width: 4px; height: 4px; border-radius: 50%; background: #a6acb8; }.result { margin: 20px 0 0; color: #617185; }.result b { color: #ff922c; }
.agent-panel-enter-active, .agent-panel-leave-active { transition: transform .24s ease, opacity .24s ease; }.agent-panel-enter-from, .agent-panel-leave-to { opacity: 0; transform: translateX(24px); }
</style>
