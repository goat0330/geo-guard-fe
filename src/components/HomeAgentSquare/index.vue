<template>
  <section class="section-container agents-section">
    <div class="section-header">
      <div class="section-title">
        <span class="title-icon">🛒</span>
        <h2>智能体广场</h2>
      </div>
      <div class="more-link" @click="$emit('more')">
        <span>查看更多</span>
        <span class="arrow">&gt;</span>
      </div>
    </div>

    <!-- 6 大智能体推荐卡片 (2列 x 3行) -->
    <div class="agent-cards-grid">
      <div
        v-for="agent in list"
        :key="agent.title"
        class="agent-card"
        @click="$emit('agent-click', agent)"
      >
        <div class="agent-icon-wrap">
          <img :src="agent.icon" class="agent-3d-img" :alt="agent.title" />
        </div>
        <div class="agent-details">
          <h3 class="agent-name">{{ agent.title }}</h3>
          <p class="agent-desc">{{ agent.description }}</p>
          <div class="agent-actions">
            <button
              v-for="(action, aIndex) in agent.actions"
              :key="aIndex"
              class="agent-action-pill"
              @click.stop="$emit('action-click', { agent, action })"
            >
              {{ action }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

import agentImg1 from '@/assets/imgs/home/recommend-card-1.png'
import agentImg2 from '@/assets/imgs/home/recommend-card-2.png'
import agentImg3 from '@/assets/imgs/home/recommend-card-3.png'
import agentImg4 from '@/assets/imgs/home/recommend-card-4.png'
import agentImg5 from '@/assets/imgs/home/recommend-card-5.png'
import agentImg6 from '@/assets/imgs/home/recommend-card-6.png'

const props = defineProps({
  agents: {
    type: Array,
    default: () => [
      {
        title: '隐患复核智能体',
        description: '比对历次调查、巡查和监测资料，辅助判断在库状态并输出复核建议。',
        icon: agentImg1,
        actions: ['复核今日待办', '查看资料差异'],
      },
      {
        title: 'AI识图智能体',
        description: '识别现场照片中的裂缝、变形和异常迹象，形成辅助标注结果。',
        icon: agentImg2,
        actions: ['上传现场照片', '查看历史识图'],
      },
      {
        title: '动态预案智能体',
        description: '汇总风险点最新调查与监测数据，生成或更新单点应急预案草稿。',
        icon: agentImg3,
        actions: ['生成最新预案', '对比预演变化'],
      },
      {
        title: '复盘报告智能体',
        description: '汇总处置事件或应急演练记录，生成复盘报告、评分和改进建议。',
        icon: agentImg4,
        actions: ['复盘处置事件', '复盘应急演练'],
      },
      {
        title: '空间分析智能体',
        description: '关联隐患点、风险区、人员房屋和道路地形，分析基于坐标点的地上地下一体化信息。',
        icon: agentImg5,
        actions: ['空间数据汇聚', '地上地下对齐'],
      },
      {
        title: '风险评价智能体',
        description: '汇聚滑坡、崩塌等调查监测与气象数据，开展区域风险评价，生成分级结果。',
        icon: agentImg6,
        actions: ['动态风险评价', '生成研判报文'],
      },
    ],
  },
})

defineEmits(['agent-click', 'action-click', 'more'])

const list = computed(() => props.agents)
</script>

<style lang="less" scoped>
.section-container {
  width: 1000px;
  max-width: 100%;
  margin: 48px auto 0;
  padding-bottom: 40px; // 与最底部保持 40px 间隔
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;

      .title-icon {
        font-size: 18px;
        line-height: 1;
      }

      h2 {
        font-size: 18px;
        font-weight: 700;
        color: #222527;
        margin: 0;
        line-height: 20px;
      }
    }

    .more-link {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #007BFF;
      cursor: pointer;
      line-height: 20px;
      transition: opacity 0.2s;

      .arrow {
        font-size: 12px;
        line-height: 1;
      }

      &:hover {
        opacity: 0.8;
      }
    }
  }
}

.agent-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 492px);
  gap: 16px;

  .agent-card {
    width: 492px;
    height: 162px;
    box-sizing: border-box;
    background: linear-gradient(180deg, #F1F9FF 0%, #FFFFFF 100%);
    border: 1px solid #E6F0FA;
    border-radius: 8px;
    padding: 16px 20px;
    display: flex;
    align-items: center;
    gap: 16px;
    cursor: pointer;
    box-shadow: 0 2px 8px 0 rgba(10, 98, 192, 0.12);
    transition: all 0.25s;

    &:hover {
      background: #FFFFFF;
      border-color: #C2DCF7;
      transform: translateY(-2px);
      box-shadow: 0 4px 16px 0 rgba(10, 98, 192, 0.16);

      .agent-details .agent-name {
        color: #007BFF;
      }
    }

    .agent-icon-wrap {
      width: 98px;
      height: 98px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      .agent-3d-img {
        width: 98px;
        height: 98px;
        object-fit: contain;
        transition: transform 0.25s;
      }
    }

    &:hover .agent-3d-img {
      transform: scale(1.05);
    }

    .agent-details {
      flex: 1;
      min-width: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .agent-name {
        font-size: 18px;
        font-weight: 700;
        color: #383C41;
        line-height: 26px;
        margin: 0;
        transition: color 0.2s;
      }

      .agent-desc {
        font-size: 14px;
        color: #9096A2;
        line-height: 20px;
        margin: 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .agent-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;

        .agent-action-pill {
          height: 24px;
          padding: 0 10px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 400;
          color: #3595FB;
          background: #E0EEFA;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;

          &:hover {
            background: #D2E6F8;
            color: #007BFF;
          }
        }
      }
    }
  }
}
</style>
