<template>
  <section class="alarm-panel">
    <header class="panel-header">
      <button class="back-button" type="button" title="返回专业监测概况" @click="emit('back')">
        <img class="back-icon" :src="backIcon" alt="" />
      </button>
      <h1>专业监测预警列表</h1>
      <button class="export-button" type="button" @click="emit('export')">
        <i class="iconfont icon-export"></i>导出列表
      </button>
    </header>

    <AlarmFilterBar @change="handleFilterChange" />

    <div class="alarm-list">
      <AlarmWarningItem
        v-for="item in filteredList"
        :key="item.id"
        :data="item"
        :expanded="expandedIds.includes(item.id)"
        :active="activeId === item.id"
        @toggle="handleToggle"
        @analyze="emit('analyze', $event)"
      />
      <p v-if="!filteredList.length" class="empty-tip">暂无匹配的预警记录</p>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import AlarmFilterBar from './AlarmFilterBar.vue'
import AlarmWarningItem from './AlarmWarningItem.vue'
import { alarmList } from '../../config.js'
import backIcon from '@/assets/imgs/hazardReview/icon-left-arrow.webp'

defineOptions({ name: 'AlarmListPanel' })

const emit = defineEmits(['back', 'export', 'analyze'])

const filters = ref({ region: '', level: '', validity: '', date: '' })

/** 默认展开第一条，便于查看详情结构 */
const expandedIds = ref(alarmList[0] ? [alarmList[0].id] : [])

const handleFilterChange = (value) => {
  filters.value = value
}

const toggleItem = (id) => {
  expandedIds.value = expandedIds.value.includes(id)
    ? expandedIds.value.filter((item) => item !== id)
    : [...expandedIds.value, id]
}

/** 当前选中项：点击卡片即选中，同时切换展开态 */
const activeId = ref('')

const handleToggle = (id) => {
  activeId.value = id
  toggleItem(id)
}

/** 列表筛选：当前仅预警等级可本地匹配，其余条件待接口接入后作为请求参数 */
const filteredList = computed(() => alarmList.filter((item) => {
  const { level } = filters.value
  return !level || item.level === level
}))
</script>

<style lang="less" scoped>
.alarm-panel {
  display: flex;
  height: 100%;
  min-height: 0;
  flex-direction: column;
  padding: 22px 0 18px 24px;
  box-sizing: border-box;
  color: #1a1a1a;
  background: linear-gradient(180deg, #f0f2ff 0%, #ffffff 96px);
  font-family: 'AlibabaPuHuiTi', sans-serif;
}

.panel-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 4px;
  margin: 0 24px 16px 0;
}

.panel-header h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  line-height: 26px;
  white-space: nowrap;
}

.back-button {
  display: inline-flex;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;

  .back-icon {
    display: block;
    width: 18px;
    height: 18px;
    object-fit: contain;
  }
}

.alarm-list {
  flex: 1 1 0;
  min-height: 0;
  gap: 12px;
  padding-right: 24px;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* 导出列表：标题行右侧主按钮 */
.export-button {
  display: inline-flex;
  height: 34px;
  flex-shrink: 0;
  align-items: center;
  gap: 6px;
  margin-left: auto;
  padding: 0 14px;
  border: 0;
  border-radius: 8px;
  background: #007bff;
  color: #ffffff;
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease;

  i {
    font-size: 14px;
  }

  &:hover {
    background: #3395ff;
  }
}

.alarm-list::-webkit-scrollbar {
  width: 4px;
}

.alarm-list::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: #d6dee8;
}

.empty-tip {
  margin: 40px 0 0;
  color: #a6b0bd;
  font-size: 14px;
  text-align: center;
}
</style>
