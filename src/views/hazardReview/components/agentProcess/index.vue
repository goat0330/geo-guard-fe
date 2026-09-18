<template>
  <section class="agent-panel">
    <header class="panel-header">
      <img class="header-icon" :src="headerIcon" alt="" />
      <h1>隐患复核智能体</h1>
      <button class="close-button" type="button" title="关闭" @click="emit('close')">
        <img :src="closeIcon" alt="" />
      </button>
    </header>

    <div class="panel-body">
      <!-- 隐患点摘要 -->
      <div class="hazard-card">
        <div class="card-title">
          <span class="pin-wrap"><i class="iconfont icon-a-Localyidingwei"></i></span>
          <h2>{{ data?.name }}</h2>
          <span v-if="data?.status" class="status-tag">{{ data.status }}</span>
        </div>
        <p class="card-meta"><i class="iconfont icon-a-Localyidingwei"></i>{{ brief.relation }}</p>
        <p class="card-meta"><i class="iconfont icon-file"></i>{{ brief.materials }}</p>
      </div>

      <p class="agent-summary">{{ brief.summary }}</p>

      <AgentStepSection v-for="step in steps" :key="step.key" :step="step" :expanded="expandedKeys.includes(step.key)"
        @toggle="toggleStep" />

      <p class="agent-footer">{{ brief.footer.text }}<em>{{ brief.footer.highlight }}</em></p>
    </div>

    <footer class="panel-footer">
      <button class="ghost-button" type="button" @click="emit('feedback')">
        <i class="iconfont icon-a-Commentpinglun"></i>提交反馈
      </button>
      <button class="primary-button" type="button" @click="emit('confirm')">
        <i class="iconfont icon-check"></i>确认复核结果
      </button>
    </footer>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import AgentStepSection from './AgentStepSection.vue'
import { agentProcessBrief, agentProcessSteps } from '../../config.js'
import headerIcon from '@/assets/imgs/hazardReview/icon-header-yhfhznt.webp'
import closeIcon from '@/assets/imgs/hazardReview/icon-close.webp'

defineOptions({ name: 'AgentProcessPanel' })

defineProps({
  /** 当前处理的隐患点：processList 中的条目 */
  data: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'feedback', 'confirm'])

const brief = agentProcessBrief
const steps = agentProcessSteps

/** 处理步骤默认全部展开，可逐项收起 */
const expandedKeys = ref(steps.map((step) => step.key))

const toggleStep = (key) => {
  expandedKeys.value = expandedKeys.value.includes(key)
    ? expandedKeys.value.filter((item) => item !== key)
    : [...expandedKeys.value, key]
}
</script>

<style lang="less" scoped>
.agent-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
  font-family: 'AlibabaPuHuiTi', sans-serif;
}

.panel-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 57px;
  padding: 0 20px;
  box-sizing: border-box;
  background: linear-gradient(180deg, #eef1ff 0%, #f6f8ff 46%, #ffffff 100%);
}

.header-icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.panel-header h1 {
  flex: 1;
  margin: 0;
  color: #222527;
  font-size: 16px;
  font-weight: 600;
}

.close-button {
  display: flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #eef2f7;
  }

  img {
    width: 14px;
    height: 14px;
    object-fit: contain;
  }
}

.panel-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 8px 20px 20px;

  /* 子项保持自然高度：否则内容超高时会被 flex 压扁，压扁的部分落在内部 overflow:hidden 里被裁掉 */
  > * {
    flex-shrink: 0;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: #dfe4ec;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #c6cedb;
  }
}

.hazard-card {
  padding: 14px;
  border: 1px solid #eef1f6;
  border-radius: 12px;
  background: linear-gradient(180deg, #F1F8FF 0%, #FFF 100%);
  box-shadow: 0 2px 6px 0 #1d64b133;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pin-wrap {
  display: flex;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fff0e8;
  color: #ff922c;
  font-size: 14px;
}

.card-title h2 {
  margin: 0;
  color: #222527;
  font-size: 16px;
  font-weight: 600;
}

.status-tag {
  flex-shrink: 0;
  padding: 0 12px;
  width: 72px;
  height: 24px;
  border-radius: 100px;
  background: #007bff29;
  color: #007BFF;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &::before {
    content: "";
    display: block;
    width: 4px;
    height: 4px;
    border-radius: 100%;
    background-color: #007BFF;
  }
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 10px 0 0;
  color: #9096a2;
  font-size: 12px;
  line-height: 18px;

  i {
    font-size: 14px;
  }
}

.agent-summary {
  margin: 16px 0 16px;
  color: #222527;
  font-size: 14px;
  line-height: 22px;

}

.agent-footer {
  margin: 18px 0 0;
  color: #222527;
  font-size: 14px;
  line-height: 22px;
}

/* 「待人工确认」用主色强调 */
.agent-footer em {
  color: #007bff;
  font-style: normal;
}

.panel-footer {
  flex-shrink: 0;
  display: flex;
  gap: 12px;
  padding: 12px 20px 20px;
  border-top: 1px solid #f2f5f9;
}

.ghost-button,
.primary-button {
  position: relative;
  z-index: 0;
  display: inline-flex;
  flex: 1;
  height: 44px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  border-radius: 10px;
  font-family: inherit;
  font-size: 16px;
  cursor: pointer;

  i {
    font-size: 18px;
  }
}

.ghost-button {
  border: 1px solid #007bff;
  background: #eff6ff;
  color: #007bff;
  transition: background 0.2s ease;

  &:hover {
    background: #e2efff;
  }
}

.primary-button {
  background: linear-gradient(90deg, #007bff 12.5%, #00b2ff 100%);
  color: #ffffff;

  /* hover 用叠加层过渡，避免渐变背景切换时的跳帧闪烁 */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    background: linear-gradient(90deg, #3395ff 12.5%, #40c4ff 100%);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &:hover::before {
    opacity: 1;
  }
}
</style>
