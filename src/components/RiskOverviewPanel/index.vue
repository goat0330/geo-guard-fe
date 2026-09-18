<template>
  <section class="overview-panel">
    <header class="overview-header">
      <h1>风险情况概览</h1>
      <button class="report-button" type="button" @click="emit('open-risk-report')"><i class="iconfont icon-a-Frame21"></i>今日风险评价报文</button>
    </header>

    <div class="overview-scroll-area">
    <div class="overview-content">
      <div class="section-title">
        <span>总体范围</span>
        <span class="updated"><i class="iconfont icon-a-Frame1"></i> 更新 10:26</span>
      </div>

      <div class="summary-grid">
        <div v-for="item in summaryItems" :key="item.label" class="summary-item">
          <img :src="item.icon" :alt="item.label" />
          <div>
            <span>{{ item.label }}</span>
            <strong :class="item.emphasis">{{ item.value }}</strong>
          </div>
        </div>
      </div>

      <div class="section-title">
        <span>风险等级及今日变化</span>
        <button class="detail-button" @click="emit('show-detail')">
          查看详情<i class="iconfont icon-arrow-right"></i>
        </button>
      </div>
      <div class="risk-levels">
        <div v-for="item in riskLevels" :key="item.label" class="risk-level-item">
          <img :src="item.icon" :alt="item.label" />
          <span class="level-name">{{ item.label }}</span>
          <span class="level-bar"><i :style="{ width: item.width, background: item.color }"></i></span>
          <strong>{{ item.count }}</strong>
          <b>{{ item.percent }}</b>
          <span class="today">今日 <em :class="item.trendClass">{{ item.trendText }}<img v-if="item.trendIcon" :src="item.trendIcon" alt="" /></em></span>
        </div>
      </div>

      <div class="section-title">乡镇风险对象排序</div>
      <div class="legend"><i></i>极高风险单元 <i></i>高风险单元</div>
      <div class="town-list">
        <div v-for="(town, index) in towns" :key="town.name" class="town-row">
          <div class="town-line"><span>{{ index + 1 }}</span>{{ town.name }}<strong>{{ town.total }}</strong></div>
          <div class="town-progress"><i :style="{ width: town.highest }"></i><b :style="{ width: town.high }"></b></div>
        </div>
      </div>
    </div>
    </div>

  </section>
</template>

<script setup>

import hazardOrange from '@/assets/imgs/fengxian/hazard-orange.png'
import hazardRed from '@/assets/imgs/fengxian/hazard-red.png'
import coverageArea from '@/assets/imgs/fengxian/coverage-area.png'
import affectedPeople from '@/assets/imgs/fengxian/affected-people.png'
import affectedBuildings from '@/assets/imgs/fengxian/affected-buildings.png'
import affectedTowns from '@/assets/imgs/fengxian/affected-towns.png'
import riskExtreme from '@/assets/imgs/fengxian/risk-extreme.png'
import riskHigh from '@/assets/imgs/fengxian/risk-high.png'
import riskMedium from '@/assets/imgs/fengxian/risk-medium.png'
import riskLow from '@/assets/imgs/fengxian/risk-low.png'
import trendUp from '@/assets/imgs/fengxian/trend-up.png'
import trendDown from '@/assets/imgs/fengxian/trend-down.png'

const summaryItems = [
  { label: '风险斜坡(处)', value: '1,468', icon: hazardOrange, emphasis: 'orange' },
  { label: '崩塌条带(处)', value: '573', icon: hazardRed, emphasis: 'red' },
  { label: '覆盖面积(km²)', value: '326.8', icon: coverageArea },
  { label: '涉及人数(人)', value: '12,680', icon: affectedPeople },
  { label: '影响房屋(栋)', value: '3,420', icon: affectedBuildings },
  { label: '覆盖乡镇(个)', value: '39', icon: affectedTowns },
]

const riskLevels = [
  { label: '极高', count: 0, percent: '0%', trendText: '0 -', icon: riskExtreme, width: '0%', color: '#ef655a' },
  { label: '高', count: 2, percent: '0.1%', trendText: '+1', trendIcon: trendUp, trendClass: 'up', icon: riskHigh, width: '13%', color: '#ff942c' },
  { label: '中', count: 7, percent: '0.3%', trendText: '+2', trendIcon: trendUp, trendClass: 'up', icon: riskMedium, width: '30%', color: '#ffbd63' },
  { label: '低', count: 2032, percent: '99.5%', trendText: '-1', trendIcon: trendDown, trendClass: 'down', icon: riskLow, width: '92%', color: '#087df5' },
]

const towns = [
  { name: '郁山镇', total: 126, highest: '55%', high: '42%' },
  { name: '龙溪镇', total: 118, highest: '25%', high: '55%' },
  { name: '宝家镇', total: 103, highest: '36%', high: '44%' },
  { name: '普子镇', total: 97, highest: '20%', high: '42%' },
  { name: '桑柘镇', total: 91, highest: '16%', high: '34%' },
]

const emit = defineEmits(['show-detail', 'open-risk-report'])
</script>

<style lang="less" scoped>
.overview-panel {
  height: 100%;
  min-height: 0;
  padding: 24px 26px 20px;
  color: #1a1a1a;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.overview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  margin: 0 0 26px;
}

h1 {
  flex-shrink: 0;
  margin: 0;
  font-size: 18px;
  line-height: 26px;
}

.overview-scroll-area {
  flex: 1 1 0;
  min-height: 0;
  margin-right: -26px;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
}

.overview-content {
  padding-right: 26px;
  box-sizing: border-box;
}

.overview-scroll-area::-webkit-scrollbar {
  width: 4px;
}

.overview-scroll-area::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: #d6dee8;
}

.section-title { position: relative; display: flex; align-items: center; justify-content: space-between; margin: 0 0 14px; padding-left: 18px; font-size: 16px; font-weight: 600; }
.section-title::before { content: ''; position: absolute; left: 0; width: 8px; height: 8px; background: url('@/assets/imgs/point.png') center / contain no-repeat; }
.detail-button { display: inline-flex; align-items: center; gap: 2px; padding: 0; border: 0; background: transparent; color: #087df5; font-size: 12px; cursor: pointer; }
.detail-button i { font-size: 12px; }
.updated { color: #8d98a7; font-size: 12px; font-weight: 400; }
.updated i { margin-right: 4px; font-size: 14px; }
.summary-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 24px; }
.summary-item { height: 86px; display: flex; align-items: center; gap: 8px; padding: 12px; box-sizing: border-box; border: 1px solid #dce3eb; border-radius: 8px; }
.summary-item img { width: 36px; height: 36px; object-fit: contain; }
.summary-item span { display: block; color: #7c8795; font-size: 14px; white-space: nowrap; }
.summary-item strong { display: block; margin-top: 8px; font-size: 22px; line-height: 26px; }
.summary-item strong.orange { color: #ff8b27; }
.summary-item strong.red { color: #ef4c46; }
.risk-levels { display: grid; gap: 8px; margin-bottom: 26px; }
.risk-level-item { height: 52px; display: grid; grid-template-columns: 24px 28px minmax(64px, 1fr) 38px 42px 54px; align-items: center; column-gap: 6px; padding: 0 10px; border-radius: 8px; background: #f6f9fc; font-size: 14px; }
.risk-level-item img { width: 24px; height: 24px; }
.level-name { color: #667382; }
.level-bar { height: 6px; border-radius: 3px; background: #e3e9ef; overflow: hidden; }
.level-bar i { display: block; height: 100%; border-radius: 3px; }
.risk-level-item strong { font-size: 14px; text-align: right; white-space: nowrap; }
.risk-level-item b { font-weight: 600; text-align: left; white-space: nowrap; }
.today { display: inline-flex; align-items: center; gap: 3px; color: #a0a9b5; font-size: 12px; white-space: nowrap; }
.today em { display: inline-flex; align-items: center; flex-shrink: 0; font-style: normal; }.today .up { color: #ef5c57; }.today .down { color: #25ad91; }
.today img { flex-shrink: 0; width: 10px; height: 10px; margin-left: 2px; }
.legend { margin: -4px 0 14px 66px; color: #9aa5b2; font-size: 12px; }
.legend i { display: inline-block; width: 12px; height: 3px; margin: 0 6px 3px 14px; background: #f3a783; }.legend i:nth-child(2) { background: #8fb8f5; }
.town-list { display: grid; gap: 14px; }
.town-line { display: flex; align-items: center; color: #697687; font-size: 14px; }
.town-line span { width: 18px; height: 18px; margin-right: 14px; border-radius: 4px; background: #f5f6f8; text-align: center; line-height: 18px; font-size: 10px; }
.town-line strong { margin-left: auto; color: #2d333b; font-size: 18px; }
.town-progress { display: flex; height: 4px; margin: 7px 0 0 32px; overflow: hidden; border-radius: 2px; background: #edf1f5; }
.town-progress i { background: #f3a783; }.town-progress b { background: #8fb8f5; }
.report-button { display: inline-flex; align-items: center; justify-content: center; gap: 6px; height: 32px; padding: 0 10px; border: 0; border-radius: 6px; background: #007bff; color: #ffffff; font-size: 12px; cursor: pointer; }
.report-button i { font-size: 14px; }
@media (max-height: 850px) {
  .overview-panel { padding-top: 16px; }
  .overview-header { margin-bottom: 14px; }
  .summary-item { height: 70px; }
  .risk-level-item { height: 44px; }
  .town-list { gap: 8px; }
}
</style>
