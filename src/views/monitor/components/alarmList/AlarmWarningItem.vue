<template>
  <article class="alarm-card" :class="{ 'is-expanded': expanded, 'is-active': active }">
    <button class="card-head" type="button" @click="emit('toggle', data.id)">
      <i class="head-arrow"></i>
      <span class="hazard-name" :title="data.name">{{ data.name }}</span>
      <span class="level-tag" :style="levelStyle">{{ data.level }}</span>
      <span class="analysis-button" @click.stop="emit('analyze', data)">
        AI数据分析<span
          class="analysis-icon"
          :style="{ maskImage: `url(${arrowIcon})`, WebkitMaskImage: `url(${arrowIcon})` }"
        ></span>
      </span>
    </button>

    <!-- 详情：展开后显示，两列表格 -->
    <div v-if="data.detail" class="card-detail" :class="{ 'is-collapsed': !expanded }">
      <div class="detail-inner">
        <div class="detail-grid">
          <p class="detail-row">
            <span class="detail-label">详细地址：</span>{{ data.detail.address }}
          </p>
          <p class="detail-row">
            <span class="detail-label">处置类型：</span>{{ data.detail.disposeType }}
          </p>
          <p class="detail-row">
            <span class="detail-label">设备名称：</span>{{ data.detail.deviceName }}
          </p>
          <p class="detail-row">
            <span class="detail-label">处置人：</span>{{ data.detail.disposeUser }}
          </p>
          <p class="detail-row">
            <span class="detail-label">发布时间：</span>{{ data.detail.publishTime }}
          </p>
          <p class="detail-row">
            <span class="detail-label">处置时间：</span>{{ data.detail.disposeTime }}
          </p>
          <p class="detail-row is-full">
            <span class="detail-label">有效预警：</span>
            <span class="valid-tag">{{ data.detail.validWarning }}</span>
          </p>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { alarmLevelMap } from '../../config.js'
import arrowIcon from '@/assets/imgs/monitor/icon-arrow-right-btn.webp'

defineOptions({ name: 'AlarmWarningItem' })

const props = defineProps({
  /** 单条预警：{ id, name, level, detail? } */
  data: {
    type: Object,
    required: true,
  },
  expanded: {
    type: Boolean,
    default: false,
  },
  /** 是否为当前选中项 */
  active: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle', 'analyze'])

/** 未在字典中的等级使用中性配色兜底 */
const fallbackLevel = { color: '#617185', background: '#f1f4f8' }

const levelStyle = computed(() => {
  const config = alarmLevelMap[props.data.level] || fallbackLevel
  return { color: config.color, background: config.background }
})
</script>

<style lang="less" scoped>
.alarm-card {
  margin-bottom: 10px;
  border: 1px solid #e4eaef;
  border-radius: 8px;
  background: #f5f8fa;
  overflow: hidden;
}

/* 展开态卡片内部透明，靠描边区分 */
.alarm-card.is-expanded {
  background: transparent;
}

/* 选中态：浅蓝底 + 主色描边 + 投影（放在展开态之后，展开且选中时以选中态为准） */
.alarm-card.is-active {
  background: #f1f8ff;
  border-color: #007bff;
  filter: drop-shadow(0 2px 10px #1d64b133);
}

.alarm-card.is-active .analysis-button {
  background: #007bff;
  color: #ffffff;
}

.card-head {
  display: flex;
  width: 100%;
  height: 50px;
  align-items: center;
  gap: 8px;
  padding: 0 14px;
  border: 0;
  background: transparent;
  font-family: inherit;
  text-align: left;
  cursor: pointer;
}

/* 实心三角箭头：收起朝右，展开朝下 */
.head-arrow {
  width: 0;
  height: 0;
  flex-shrink: 0;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 7px solid #A6ACB8;
  transition: transform 0.24s ease;
}

.alarm-card.is-expanded .head-arrow {
  transform: rotate(90deg);
}

.hazard-name {
  min-width: 0;
  overflow: hidden;
  color: #222527;
  font-size: 14px;
  font-weight: 800;
  line-height: 18px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.level-tag {
  flex-shrink: 0;
  height: 18px;
  padding: 0 8px;
  border-radius: 4px;
  font-size: 10px;
  white-space: nowrap;
  line-height: 18px;
}

/* AI 数据分析：浅蓝底按钮块 */
.analysis-button {
  display: inline-flex;
  width: 92px;
  height: 24px;
  border-radius: 4px;
  background: #D9EBFF;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-left: auto;

  // padding: 0 10px;
  border-radius: 6px;
  color: #007BFF;
  font-size: 12px;
  line-height: 16px;
  transition: background 0.2s ease;

  .analysis-icon {
    display: block;
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    /* 用遮罩染色，颜色跟随按钮文字：默认蓝、选中白 */
    background: currentColor;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    -webkit-mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
    mask-size: contain;
  }

  &:hover {
    background: #dbeafe;
  }
}

/* 详情：grid 行高过渡展开收起 */
.card-detail {
  display: grid;
  grid-template-rows: 1fr;
  transition: grid-template-rows 0.24s ease;
}

.card-detail.is-collapsed {
  grid-template-rows: 0fr;
}

.detail-inner {
  min-height: 0;
  overflow: hidden;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 12px;
  padding: 14px;
  border-top: 1px solid #e4eaef;
}

.detail-row {
  display: flex;
  min-width: 0;
  align-items: center;
  margin: 0;
  color: #617185;
  font-size: 12px;
  line-height: 20px;
}

.detail-row.is-full {
  grid-column: 1 / -1;
}

.detail-label {
  flex-shrink: 0;
  color: #A6ACB8;
  width: 60px;

}

.valid-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  // padding: 0 8px;
  color: #58718F;
  font-size: 14px;
  line-height: 22px;

  width: 48px;
  height: 24px;
  border-radius: 100px;
  border: 1px solid #6F86A3;
  background: #D5DEE9;
}
</style>
