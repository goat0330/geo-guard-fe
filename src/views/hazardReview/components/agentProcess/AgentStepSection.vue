<template>
  <section class="process-section">
    <!-- 折叠效果对齐 GroupDefenseReportDetail：胶囊标题条 + 箭头旋转 + 行高过渡 -->
    <button class="section-title" type="button" @click="emit('toggle', step.key)">
      <span>
        <el-icon><CircleCheck /></el-icon>{{ step.title }}
      </span>
      <el-icon class="section-arrow" :class="{ 'is-collapsed': !expanded }"><ArrowUp /></el-icon>
    </button>

    <!-- 用 grid 行高过渡实现展开/收起动画，无需测量内容高度 -->
    <div class="section-body" :class="{ 'is-collapsed': !expanded }">
      <div>
        <p v-if="step.subtitle" class="step-subtitle">{{ step.subtitle }}</p>

        <ul v-if="step.points?.length" class="point-list">
          <li v-for="point in step.points" :key="point">{{ point }}</li>
        </ul>

        <AgentClassifyResult
          v-if="step.classify"
          class="step-classify"
          :table="step.classify"
          :metrics="step.metrics || []"
        />

        <p v-if="step.draftNote" class="draft-note">{{ step.draftNote }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import AgentClassifyResult from './AgentClassifyResult.vue'

defineOptions({ name: 'AgentStepSection' })

defineProps({
  /** 单个处理步骤：{ key, title, subtitle, points, classify, metrics, draftNote } */
  step: {
    type: Object,
    required: true,
  },
  expanded: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['toggle'])
</script>

<style lang="less" scoped>
.process-section + .process-section {
  margin-top: 14px;
}

.section-title {
  display: flex;
  width: 100%;
  height: 44px;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border: 1px solid #dcedff;
  border-radius: 8px;
  background: #f5f9ff;
  color: #007bff;
  font-family: inherit;
  cursor: pointer;
}

.section-title > span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.section-arrow {
  transition: transform 0.24s ease;
}

.section-arrow.is-collapsed {
  transform: rotate(180deg);
}

.section-body {
  display: grid;
  grid-template-rows: 1fr;
  opacity: 1;
  transition: grid-template-rows 0.28s ease, opacity 0.2s ease;
}

.section-body.is-collapsed {
  grid-template-rows: 0fr;
  opacity: 0;
}

.section-body > div {
  min-height: 0;
  overflow: hidden;
}

.step-subtitle {
  margin: 0;
  padding: 14px 16px 0;
  color: #383C41;
  font-size: 14px;
  line-height: 22px;
  font-weight: 800;
}

.point-list {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 14px 16px 0;
  list-style: none;
}

.point-list li {
  position: relative;
  padding-left: 12px;
  color: #617185;
  font-size: 14px;
  line-height: 22px;
}

.point-list li::before {
  position: absolute;
  top: 9px;
  left: 0;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #617185;
  content: '';
}

.step-classify {
  padding: 14px 16px 0;
}

/* 复核建议草稿：浅蓝底 + 左侧 4px 主色竖条，两行文案正好 64px 高 */
.draft-note {
  box-sizing: border-box;
  min-height: 64px;
  /* 与同层内容统一缩进 16px（不写死宽度，面板宽度变化时自适应） */
  margin: 14px 16px 0;
  padding: 10px 12px;
  border-left: 4px solid #007bff;
  border-radius: 6px;
  background: #f1f7ff;
  color: #222527;
  font-size: 14px;
  line-height: 22px;
}
</style>
