<template>
  <div class="process-filters">
    <!-- 关键字搜索 -->
    <div class="search-row">
      <el-input v-model="keyword" class="search-input" placeholder="隐患点名称关键字" clearable>
        <template #prefix>
          <i class="iconfont icon-search"></i>
        </template>
      </el-input>
      <button class="search-button" type="button" @click="notify">搜索</button>
    </div>

    <!-- 分割线 -->
    <div class="filter-divider"></div>

    <!-- 灾害类型 / 处理状态 -->
    <div class="filter-row">
      <label class="filter-cell">
        <span>灾害类型：</span>
        <el-select v-model="hazardType" placeholder="请选择" clearable>
          <el-option v-for="item in processFilterOptions.hazardTypes" :key="item" :label="item" :value="item" />
        </el-select>
      </label>
      <label class="filter-cell">
        <span>处理状态：</span>
        <el-select v-model="status" placeholder="请选择" clearable>
          <el-option v-for="item in processFilterOptions.statuses" :key="item" :label="item" :value="item" />
        </el-select>
      </label>
    </div>

    <!-- 时间选择 / 查询 / 重置 -->
    <div class="time-row">
      <label class="time-cell">
        <span>时间选择：</span>
        <el-date-picker v-model="date" type="date" value-format="YYYY-MM-DD" placeholder="请选择" />
      </label>
      <button class="query-button" type="button" @click="notify">查询</button>
      <button class="reset-button" type="button" @click="handleReset">重置</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { processFilterOptions } from '../../config.js'

const emit = defineEmits(['change'])

const keyword = ref('')
const hazardType = ref('')
const status = ref('')
const date = ref('')

const getFilters = () => ({
  keyword: keyword.value.trim(),
  hazardType: hazardType.value,
  status: status.value,
  date: date.value,
})

const notify = () => emit('change', getFilters())

/** 条件变化即时筛选，「搜索 / 查询」按钮用于手动触发同一逻辑 */
watch([keyword, hazardType, status, date], notify)

const handleReset = () => {
  keyword.value = ''
  hazardType.value = ''
  status.value = ''
  date.value = ''
  notify()
}
</script>

<style lang="less" scoped>
.process-filters {
  flex-shrink: 0;
  margin: 0 24px 16px 0;
  font-family: 'AlibabaPuHuiTi', sans-serif;
}

/* 搜索行 */
.search-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 搜索与筛选条件之间的分割线，上下各留 20px */
.filter-divider {
  height: 1px;
  margin: 20px 0;
  background: #dee2ec;
}

.search-input {
  flex: 1 1 0;
  min-width: 0;

  :deep(.el-input__wrapper) {
    height: 32px;
    padding: 0 12px;
    border-radius: 8px;
    background: #f5f7fa;
    box-shadow: none;
    transition: background 0.2s ease, box-shadow 0.2s ease;
  }

  :deep(.el-input__wrapper:hover),
  :deep(.el-input__wrapper.is-focus) {
    background: #ffffff;
    box-shadow: 0 0 0 1px #bcd6f7 inset;
  }

  :deep(.el-input__prefix) {
    color: #a6b0bd;
    font-size: 14px;
  }

  :deep(.el-input__inner) {
    color: #222527;
    font-size: 14px;
  }
}

.search-button,
.query-button {
  flex-shrink: 0;
  border: 0;
  border-radius: 8px;
  background: #007bff;
  color: #ffffff;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #3395ff;
  }
}

.search-button {
  width: 56px;
  height: 32px;
  font-size: 12px;
}

/* 灾害类型 / 处理状态 */
.filter-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.filter-cell,
.time-cell {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #5c6673;
  font-size: 14px;
  white-space: nowrap;
}

.filter-cell :deep(.el-select),
.time-cell :deep(.el-date-editor) {
  flex: 1 1 0;
  min-width: 0;
  width: auto;
}

.filter-cell :deep(.el-select__wrapper) {
  min-height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 0 0 1px #e4e8ee inset;
  font-size: 14px;
  transition: box-shadow 0.2s ease;
}

.filter-cell :deep(.el-select__wrapper:hover),
.filter-cell :deep(.el-select__wrapper.is-focused) {
  box-shadow: 0 0 0 1px #bcd6f7 inset;
}

.filter-cell :deep(.el-select__placeholder) {
  color: #222527;
}

.filter-cell :deep(.el-select__placeholder.is-transparent) {
  color: #a6b0bd;
}

/* 下拉箭头改用设计稿图标，并隐藏 Element Plus 自带箭头 */
.filter-cell :deep(.el-select__caret) {
  width: 16px;
  height: 16px;
  margin-left: 4px;
  background: url('@/assets/imgs/hazardReview/icon-arrow-down-select.webp') no-repeat center / contain;
}

.filter-cell :deep(.el-select__caret svg) {
  display: none;
}

/* 时间选择行 */
.time-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-cell {
  flex: 1 1 0;
  min-width: 0;
}

.time-cell :deep(.el-input__wrapper) {
  height: 32px;
  padding: 0 10px;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 0 0 1px #e4e8ee inset;
  transition: box-shadow 0.2s ease;
}

.time-cell :deep(.el-input__wrapper:hover),
.time-cell :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #bcd6f7 inset;
}

.time-cell :deep(.el-input__inner) {
  color: #222527;
  font-size: 14px;
}

/* 日期图标：设计稿为深色 */
.time-cell :deep(.el-input__icon) {
  color: #222527;
  font-size: 14px;
}

.query-button,
.reset-button {
  width: 56px;
  height: 32px;
  font-size: 12px;
}

.reset-button {
  flex-shrink: 0;
  border: 0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 0 0 1px #e4e8ee inset;
  color: #5c6673;
  font-family: inherit;
  cursor: pointer;
  transition: color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    color: #007bff;
    box-shadow: 0 0 0 1px #bcd6f7 inset;
  }
}
</style>
