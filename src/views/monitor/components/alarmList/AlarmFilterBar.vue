<template>
  <div class="alarm-filters">
    <label class="filter-row">
      <span>行政区划：</span>
      <el-select v-model="filters.region" placeholder="请选择" clearable>
        <el-option v-for="item in alarmFilterOptions.regions" :key="item" :label="item" :value="item" />
      </el-select>
    </label>

    <div class="filter-grid">
      <label class="filter-row">
        <span>预警等级：</span>
        <el-select v-model="filters.level" placeholder="请选择" clearable>
          <el-option v-for="item in alarmFilterOptions.levels" :key="item" :label="item" :value="item" />
        </el-select>
      </label>

      <label class="filter-row">
        <span>是否有效：</span>
        <el-select v-model="filters.validity" placeholder="请选择" clearable>
          <el-option v-for="item in alarmFilterOptions.validities" :key="item" :label="item" :value="item" />
        </el-select>
      </label>
    </div>

    <div class="filter-time">
      <label class="filter-row">
        <span>时间选择：</span>
        <el-date-picker v-model="filters.date" type="date" value-format="YYYY-MM-DD" placeholder="请选择" />
      </label>
      <button class="query-button" type="button" @click="notify">查询</button>
      <button class="reset-button" type="button" @click="handleReset">重置</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { alarmFilterOptions } from '../../config.js'

defineOptions({ name: 'AlarmFilterBar' })

const emit = defineEmits(['change'])

const filters = ref({ region: '', level: '', validity: '', date: '' })

const notify = () => emit('change', { ...filters.value })

/** 条件变化即时筛选，「查询」按钮用于手动触发同一逻辑 */
watch(filters, notify, { deep: true })

const handleReset = () => {
  filters.value = { region: '', level: '', validity: '', date: '' }
  notify()
}
</script>

<style lang="less" scoped>
.alarm-filters {
  flex-shrink: 0;
  margin: 0 24px 16px 0;
  font-family: 'AlibabaPuHuiTi', sans-serif;
}

.filter-row {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 6px;
  color: #617185;
  font-size: 14px;
  white-space: nowrap;
}

.filter-row :deep(.el-select),
.filter-row :deep(.el-date-editor) {
  flex: 1 1 0;
  min-width: 0;
  width: auto;
}

.filter-row :deep(.el-select__wrapper),
.filter-row :deep(.el-input__wrapper) {
  min-height: 34px;
  padding: 0 10px;
  border-radius: 6px;
  background: #ffffff;
  box-shadow: 0 0 0 1px #e4e8ee inset;
  font-size: 14px;
  transition: box-shadow 0.2s ease;
}

.filter-row :deep(.el-select__wrapper:hover),
.filter-row :deep(.el-select__wrapper.is-focused),
.filter-row :deep(.el-input__wrapper:hover),
.filter-row :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #bcd6f7 inset;
}

.filter-row :deep(.el-select__placeholder.is-transparent),
.filter-row :deep(.el-input__inner::placeholder) {
  color: #a6b0bd;
}

/* 下拉箭头与日期图标用设计稿图标 */
.filter-row :deep(.el-select__caret) {
  width: 16px;
  height: 16px;
  margin-left: 4px;
  background: url('@/assets/imgs/hazardReview/icon-arrow-down-select.webp') no-repeat center / contain;
}

.filter-row :deep(.el-select__caret svg) {
  display: none;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 14px;
}

.filter-time {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 14px;
}

.filter-time .filter-row {
  flex: 1 1 0;
}

.query-button,
.reset-button {
  flex-shrink: 0;
  height: 34px;
  padding: 0 16px;
  border-radius: 6px;
  font-family: inherit;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease;
}

.query-button {
  border: 0;
  background: #007bff;
  color: #ffffff;

  &:hover {
    background: #3395ff;
  }
}

.reset-button {
  border: 0;
  background: #ffffff;
  box-shadow: 0 0 0 1px #e4e8ee inset;
  color: #5c6673;

  &:hover {
    color: #007bff;
    box-shadow: 0 0 0 1px #bcd6f7 inset;
  }
}
</style>
