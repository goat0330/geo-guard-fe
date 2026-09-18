<template>
  <section class="review-panel">
    <header class="panel-header">
      <div class="title-box">
        <!-- <img :src="headerAgentIcon" class="title-icon" alt="" /> -->
        <h1>隐患复核情况</h1>
      </div>
      <StatDatePicker v-model="selectedDate" @change="handleDateChange" />
    </header>

    <div class="panel-body">
      <!-- 入库与复核 -->
      <section class="panel-section">
        <h2 class="section-title"><img :src="dotIcon" alt="" />入库与复核</h2>
        <div class="summary-grid">
          <div v-for="item in inventorySummary" :key="item.key" class="summary-card">
            <img :src="item.icon" :alt="item.label" />
            <div class="card-text">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}<em>{{ item.unit }}</em></strong>
            </div>
          </div>
        </div>
      </section>

      <!-- 智能体处理 -->
      <section class="panel-section">
        <h2 class="section-title">
          <span class="title-with-dot"><img :src="dotIcon" alt="" />智能体处理</span>
          <button class="detail-button" type="button" @click="emit('view-process-detail')">
            查看详情<i class="iconfont icon-arrow-right"></i>
          </button>
        </h2>
        <div class="process-stats">
          <div class="process-stat done">
            <img :src="agentProcess.processedIcon" alt="" />
            <div class="stat-info">
              <span>已处理</span>
              <strong>{{ agentProcess.processed }}<em>处</em></strong>
            </div>
          </div>
          <div class="process-stat pending">
            <img :src="agentProcess.pendingIcon" alt="" />
            <div class="stat-info">
              <span>待处理</span>
              <strong>{{ agentProcess.pending }}<em>处</em></strong>
            </div>
          </div>
        </div>
        <div class="process-rate">
          <div class="rate-head">
            <span class="rate-title">处理率<small>（已处理含待确认结果）</small></span>
            <strong class="rate-value">{{ agentProcess.rate }}%</strong>
          </div>
          <div class="rate-bar">
            <i :style="{ width: `${agentProcess.rate}%` }"></i>
          </div>
        </div>
      </section>

      <!-- 灾害类型 -->
      <section class="panel-section">
        <h2 class="section-title"><img :src="dotIcon" alt="" />灾害类型</h2>
        <div class="type-list">
          <div v-for="item in hazardTypes" :key="item.key" class="type-row">
            <img class="type-icon" :src="item.icon" :alt="item.label" />
            <span class="type-name">{{ item.label }}</span>
            <span class="type-bar">
              <i :style="{ width: getTypeWidth(item.value), background: item.color }"></i>
            </span>
            <strong class="type-value">{{ item.value }}<em>处</em></strong>
          </div>
        </div>
      </section>

      <!-- 分类分级结果 -->
      <section class="panel-section">
        <h2 class="section-title">
          <span class="title-with-dot"><img :src="dotIcon" alt="" />分类分级结果</span>
          <div class="grade-tabs">
            <button v-for="tab in gradeTabs" :key="tab.value" type="button"
              :class="{ 'is-active': activeGradeTab === tab.value }" @click="activeGradeTab = tab.value">
              {{ tab.label }}
            </button>
          </div>
        </h2>
        <div class="grade-list">
          <div v-for="(item, index) in currentGradeList" :key="item.key" class="grade-row">
            <div class="grade-head">
              <span class="grade-index">{{ index + 1 }}</span>
              <span class="grade-name">{{ item.label }}</span>
              <strong>{{ item.value }}</strong>
            </div>
            <span class="grade-bar">
              <i :style="{ width: getGradeWidth(item.value) }"></i>
            </span>
          </div>
        </div>
      </section>

      <!-- 复核变化 -->
      <section class="panel-section">
        <h2 class="section-title"><img :src="dotIcon" alt="" />复核变化</h2>
        <div class="compare-grid">
          <div class="compare-card changed">
            <img :src="agentCompare.changedIcon" alt="" />
            <div>
              <span>有变化</span>
              <strong>{{ agentCompare.changed }}<em>处</em></strong>
            </div>
          </div>
          <div class="compare-card unchanged">
            <img :src="agentCompare.unchangedIcon" alt="" />
            <div>
              <span>无变化</span>
              <strong>{{ agentCompare.unchanged }}<em>处</em></strong>
            </div>
          </div>
        </div>
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
  agentCompare,
  agentProcess,
  gradeListMap,
  gradeTabs,
  hazardTypes,
  inventorySummary,
  reviewDate,
} from '../config.js'
import StatDatePicker from '@/components/StatDatePicker/index.vue'
// import headerAgentIcon from '@/assets/imgs/hazardReview/icon-header-yhfhznt.webp'
import headerDotIcon from '@/assets/imgs/hazardReview/icon-header-dot.webp'

const dotIcon = headerDotIcon
const activeGradeTab = ref('scale')

const emit = defineEmits(['date-change', 'view-process-detail'])

/** 统计日期：默认取配置值，切换后向上抛出，便于后续按日期请求数据 */
const selectedDate = ref(reviewDate)

const handleDateChange = (value) => {
  emit('date-change', value)
}

const currentGradeList = computed(() => gradeListMap[activeGradeTab.value] || [])

/** 灾害类型进度条：以最大值为基准按比例换算宽度 */
const getTypeWidth = (value) => {
  const max = Math.max(...hazardTypes.map((item) => item.value))
  return `${Math.max(6, (value / max) * 100)}%`
}

/** 分类分级进度条：以当前列表最大值为基准按比例换算宽度 */
const getGradeWidth = (value) => {
  const list = currentGradeList.value
  const max = Math.max(...list.map((item) => item.value))
  return `${Math.max(6, (value / max) * 100)}%`
}
</script>

<style lang="less" scoped>
.review-panel {
  height: 100%;
  min-height: 0;
  padding: 22px 0 18px 24px;
  box-sizing: border-box;
  color: #1a1a1a;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'AlibabaPuHuiTi', sans-serif;
}

.panel-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 0 24px 18px 0;
}

.title-box {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  .title-icon {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  h1 {
    font-size: 18px;
    font-weight: 800;
  }
}

h1 {
  margin: 0;
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
  white-space: nowrap;
}

.panel-body {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  padding-right: 22px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.panel-body::-webkit-scrollbar {
  width: 4px;
}

.panel-body::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: #d6dee8;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  // gap: 10px;
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 800;
  line-height: 22px;



  img {
    width: 8px;
    height: 8px;
    margin-right: 9px;
    object-fit: contain;
  }
}

.title-with-dot {
  display: inline-flex;
  align-items: center;

  font-size: 16px;
  font-weight: 800;
  line-height: 22px;

  img {
    width: 8px;
    height: 8px;
    margin-right: 9px;
    object-fit: contain;
  }
}

/* 区块标题右侧「查看详情」文字按钮 */
.detail-button {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: #007bff;
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
  transition: color 0.2s ease;

  i {
    font-size: 12px;
  }

  &:hover {
    color: #3395ff;
  }
}

/* 入库与复核 */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  // gap: 10px;
  row-gap: 8px;
  column-gap: 12px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 24px;
  height: 86px;
  padding: 0 20px;
  box-sizing: border-box;
  border: 1px solid #dce3eb;
  border-radius: 8px;

  >img {
    width: 46px;
    height: 46px;
    flex-shrink: 0;
    object-fit: contain;
  }

  /* 新增隐患点：数值与单位同为橙色 */
  &:nth-child(1) {

    strong,
    em {
      color: #FF922C;
    }
  }

  /* 已知隐患点：数值与单位同为红色 */
  &:nth-child(2) {

    strong,
    em {
      color: #DD4739;
    }
  }
}

.card-text {
  min-width: 0;

  span {
    display: block;
    color: #617185;
    font-size: 14px;
    white-space: nowrap;
    font-family: "AlibabaPuHuiTi";
  }

  strong {
    display: block;
    margin-top: 6px;
    font-size: 26px;
    line-height: 26px;
    font-weight: 600;
    font-family: "Alimama FangYuanTi VF";
  }

  em {
    margin-left: 4px;
    font-size: 18px;
    font-style: normal;
    font-weight: 400;
    color: #7c8795;
    font-family: "Alimama FangYuanTi VF";
  }
}

/* 智能体处理 */
.process-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.process-stat {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 84px;
  padding: 0 16px;
  box-sizing: border-box;
  border-radius: 10px;

  >img {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    object-fit: contain;
  }

  .stat-info {
    min-width: 0;

    span {
      display: block;
      color: #617185;
      font-size: 14px;
      line-height: 20px;
    }

    strong {
      display: block;
      margin-top: 4px;
      color: #222527;
      font-size: 24px;
      line-height: 26px;
      font-weight: 600;
      font-family: 'Alimama FangYuanTi VF';
    }

    em {
      margin-left: 4px;
      color: #617185;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      font-family: 'Alimama FangYuanTi VF';
    }
  }

  /* 已处理：浅绿填充 */
  &.done {
    background: #effaf4;
  }

  /* 待处理：浅蓝填充 */
  &.pending {
    background: #eff6ff;
  }
}

.process-rate {
  padding: 12px 16px 14px;
  border-radius: 10px;
  background: #f6f8fb;

  .rate-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 10px;
  }

  .rate-title {
    color: #383C41;
    font-size: 12px;
    line-height: 20px;

    small {
      margin-left: 4px;
      color: #A6ACB8;
      font-size: 10px;
    }
  }

  .rate-value {
    color: #222527;
    font-size: 16px;
    line-height: 20px;
    font-weight: 600;
    font-family: 'Alimama FangYuanTi VF';
  }

  .rate-bar {
    height: 8px;
    border-radius: 4px;
    background: #e4e9f0;
    overflow: hidden;

    i {
      display: block;
      height: 100%;
      border-radius: 4px;
      background: linear-gradient(90deg, #3fa2ff 0%, #007bff 100%);
      transition: width 0.4s ease;
    }
  }
}

/* 灾害类型 / 分类分级 公共列表容器 */
.type-list,
.grade-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.grade-list {
  gap: 14px;
}

/* 灾害类型：单行 — 类型图标 / 名称 / 进度条 / 数值 */
.type-row {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 64px;
  padding: 0 16px;
  box-sizing: border-box;
  border-radius: 8px;
  background: #f7f9fc;
}

.type-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  object-fit: contain;
}

.type-row .type-name {
  flex-shrink: 0;
  color: #383C41;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.type-value {
  flex-shrink: 0;
  color: #222527;
  font-size: 22px;
  font-weight: 600;
  white-space: nowrap;
  font-family: 'Alimama FangYuanTi VF';
}

.type-value em {
  margin-left: 4px;
  color: #617185;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  font-family: 'Alimama FangYuanTi VF';
}

/* 分类分级结果：上行 序号-名称-数值，下行进度条 */
.grade-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.grade-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 分级序号块：第 4 个及以后统一使用第 4 套渐变 */
.grade-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 20px;
  flex-shrink: 0;
  border-radius: 4px;
  background: linear-gradient(180deg, #EDEFF5 0%, #edeff500 100%);
  color: #222527;
  font-size: 10px;
  font-weight: normal;
  font-family: 'AlibabaPuHuiTi';
}

.grade-row:nth-child(1) .grade-index {
  background: linear-gradient(180deg, #F3D5CD 0%, #edeff500 100%);
}

.grade-row:nth-child(2) .grade-index {
  background: linear-gradient(180deg, #F7E7C5 0%, #edeff500 100%);
}

.grade-row:nth-child(3) .grade-index {
  background: linear-gradient(180deg, #D2E2F7 0%, #edeff500 100%);
}

.grade-name {
  color: #383C41;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.grade-head strong {
  margin-left: auto;
  color: #383C41;
  font-size: 18px;
  font-weight: 800;
  white-space: nowrap;
  font-family: 'Alimama FangYuanTi VF';
}

.grade-head em {
  margin-left: 4px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  color: #617185;
  font-family: 'Alimama FangYuanTi VF';
}

/* 灾害类型进度条：8px 圆角，占据名称与数值之间的剩余宽度 */
.type-bar {
  flex: 1 1 0;
  min-width: 0;
  height: 5px;
  border-radius: 4px;
  background: #edf1f5;
  overflow: hidden;

  i {
    display: block;
    height: 100%;
    border-radius: 4px;
    background: linear-gradient(90deg, #3fa2ff 0%, #007bff 100%);
    transition: width 0.4s ease;
  }
}

/* 分类分级进度条：3px 直角，左缩进与序号后文字对齐 */
.grade-bar {
  display: block;
  height: 3px;
  margin-left: 26px;
  border-radius: 0;
  background: #edf1f5;
  overflow: hidden;

  i {
    display: block;
    height: 100%;
    border-radius: 0;
    background: linear-gradient(90deg, #3fa2ff 0%, #007bff 100%);
    transition: width 0.4s ease;
  }
}

/* 分类分级结果 - 分段切换 */
.grade-tabs {
  display: flex;
  align-items: center;
  margin-left: auto;
  border: 1px solid #007bff;
  border-radius: 8px;
  background: #ffffff;
  overflow: hidden;

  button {
    height: 32px;
    padding: 0 20px;
    border: 0;
    border-radius: 8px;
    background: #007bff1a;
    color: #007bff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;

    &.is-active {
  
      background: #007BFF;
      color: #ffffff;
      font-weight: 600;
    }
  }
}

/* 复核变化 */
.compare-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.compare-card {
  display: flex;
  align-items: center;
  height: 86px;
  padding: 0 12px;
  box-sizing: border-box;
  border: 1px solid #dce3eb;
  border-radius: 8px;

  span {
    display: block;
    color: #617185;
    font-size: 14px;
  }

  strong {
    display: block;
    margin-top: 6px;
    font-size: 26px;
    line-height: 26px;
    font-weight: 800;
        color: #383C41;
  }

  em {
    margin-left: 3px;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
      color: #383C41;
  }

  &.changed {
    gap: 24px;

    >img {
      width: 46px;
      height: 46px;
      flex-shrink: 0;
      object-fit: contain;
    }

  }

  &.unchanged {
    gap: 24px;

    >img {
      width: 46px;
      height: 46px;
      flex-shrink: 0;
      object-fit: contain;
    }

  }
}

@media (max-height: 850px) {
  .review-panel {
    padding-top: 16px;
  }

  .panel-header {
    margin-bottom: 12px;
  }

  .panel-body {
    gap: 16px;
  }

  .summary-card {
    height: 68px;
  }

  .process-stat {
    height: 68px;
  }
}
</style>
