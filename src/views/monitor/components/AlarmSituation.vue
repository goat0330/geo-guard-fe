<template>
  <section class="panel-section">
    <PanelSectionTitle title="仪器告警情况">
      <template #extra>
        <button class="today-filter" type="button">
          今日<i class="iconfont icon-arrow-down"></i>
        </button>
        <button class="detail-button" type="button" @click="emit('view-detail')">
          查看详情<i class="iconfont icon-arrow-right"></i>
        </button>
      </template>
    </PanelSectionTitle>

    <!-- 告警总数：白底描边卡片 -->
    <div class="alarm-total">
      <img class="alarm-total-icon" :src="alarmSituation.totalIcon" alt="" />
      <span class="alarm-total-label">仪器告警总数</span>
      <strong class="alarm-total-value num-font">{{ alarmSituation.total }}<em class="alarm-total-em">起</em></strong>
    </div>

    <!-- 红 / 橙 / 黄三档：白底 + 淡彩描边 -->
    <div class="alarm-levels">
      <div v-for="level in alarmSituation.levels" :key="level.key" class="level-card"
        :style="{ borderColor: level.borderColor }">
        <span class="level-head">
          <img class="level-icon" :src="level.icon" :alt="level.label" />
          <span class="level-label" :style="{ color: level.color }">{{ level.label }}</span>
        </span>
        <strong class="level-value num-font">{{ level.value }}<em>起</em></strong>
      </div>
    </div>
  </section>
</template>

<script setup>
import PanelSectionTitle from './PanelSectionTitle.vue'
import { alarmSituation } from '../config.js'

defineOptions({ name: 'MonitorAlarmSituation' })

const emit = defineEmits(['view-detail'])
</script>

<style lang="less" scoped>
/* 今日筛选：白底描边小胶囊 */
.today-filter {
  display: inline-flex;
  height: 24px;
  align-items: center;
  gap: 4px;
  margin-left: 16px;
  padding: 0 12px;
  border: 1px solid #e4e8ee;
  border-radius: 4px;
  background: #ffffff;
  color: #383c41;
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;

  i {
    font-size: 10px;
  }
}

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

/* 告警总数 */
.alarm-total {
  display: flex;
  height: 68px;
  align-items: center;
  gap: 14px;
  padding: 0 20px;
  box-sizing: border-box;
  border: 1px solid #e9edf3;
  border-radius: 10px;
  background: #ffffff;
}

.alarm-total-icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  object-fit: contain;
}

.alarm-total-label {
  color: #383C41;
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
  font-weight: 600;
  font-family: "Alimama FangYuanTi VF";
}

.alarm-total-value {
  margin-left: auto;
  color: #222527;
  font-size: 26px;
  line-height: 32px;
  font-weight: 700;
  font-family: "Alimama FangYuanTi VF";


}

.alarm-total-em {
  margin-left: 2px;
  color: #222527;
  font-size: 20px;
  font-weight: 700;
  /* em 默认斜体，需显式复位 */
  font-style: normal;
  font-family: "Alimama FangYuanTi VF";
}

/* 红 / 橙 / 黄三档告警 */
.alarm-levels {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 12px;
  height: 82px;
}

.level-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 14px 8px;
  box-sizing: border-box;
  border: 1px solid;
  border-radius: 12px;
  background: #ffffff;
}

.level-head {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.level-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  object-fit: contain;
}

.level-label {
  font-size: 14px;
  line-height: 18px;
  white-space: nowrap;
}

.level-value {
  color: #383C41;
  font-size: 18px;
  line-height: 28px;
  font-weight: 600;
}

.level-value em {
  margin-left: 2px;
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
}

/* 数字使用项目数字字体 */
.num-font {
  font-family: 'Alimama FangYuanTi VF', sans-serif;
  font-style: normal;
}
</style>
