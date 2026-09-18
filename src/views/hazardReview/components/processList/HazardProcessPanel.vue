<template>
  <section class="process-panel">
    <header class="panel-header">
      <button class="back-button" type="button" title="返回复核概况" @click="emit('back')">
        <img class="back-icon" :src="backIcon" alt="" />
      </button>
      <h1>隐患处理列表</h1>
    </header>

    <HazardProcessFilters @change="handleFilterChange" />

    <div ref="listRef" class="process-list">
      <HazardProcessCard v-for="item in pagedList" :key="item.id" :data="item" @process="emit('process', $event)" />
      <p v-if="!filteredList.length" class="empty-tip">暂无匹配的隐患点</p>
    </div>

    <!-- 分页条 -->
    <footer class="pagination-bar">
      <div class="page-summary">
        第 <span class="num-font">{{ currentPage }}</span> 页/共 <span class="num-font">{{ totalPages }}</span> 页，共
        <span class="num-font">{{ filteredList.length }}</span> 条数据
      </div>
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="processPageSize"
        :total="filteredList.length"
        :pager-count="5"
        layout="prev, pager, next"
        small
        background
      />
    </footer>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import HazardProcessCard from './HazardProcessCard.vue'
import HazardProcessFilters from './HazardProcessFilters.vue'
import { processList, processPageSize } from '../../config.js'
import backIcon from '@/assets/imgs/hazardReview/icon-left-arrow.webp'

const emit = defineEmits(['back', 'process'])

const listRef = ref(null)
const filters = ref({ keyword: '', hazardType: '', status: '', date: '' })
const currentPage = ref(1)

const handleFilterChange = (value) => {
  filters.value = value
  /* 筛选条件变化后回到第一页，避免停留在越界页码上出现空列表 */
  currentPage.value = 1
}

/** 列表筛选：关键字按名称匹配，其余条件按字段相等匹配（接口就绪后改为请求参数） */
const filteredList = computed(() =>
  processList.filter((item) => {
    const { keyword, hazardType, status, date } = filters.value
    const matchKeyword = !keyword || item.name.includes(keyword)
    const matchType = !hazardType || item.hazardType === hazardType
    const matchStatus = !status || item.status === status
    const matchDate = !date || item.date === date
    return matchKeyword && matchType && matchStatus && matchDate
  }),
)

/** 当前页数据：本地切片分页，接口就绪后改为按页请求 */
const pagedList = computed(() => {
  const start = (currentPage.value - 1) * processPageSize
  return filteredList.value.slice(start, start + processPageSize)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredList.value.length / processPageSize)))

/** 翻页后回到列表顶部，避免停留在上一页的滚动位置 */
watch(currentPage, () => {
  if (listRef.value) {
    listRef.value.scrollTop = 0
  }
})
</script>

<style lang="less" scoped>
.process-panel {
  height: 100%;
  min-height: 0;
  padding: 22px 0 18px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #1a1a1a;
  font-family: 'AlibabaPuHuiTi', sans-serif;
}

.panel-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0 24px 16px 0;

  h1{
    font-size: 18px;
    font-weight: 800;
  }
}

.back-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #222527;
  cursor: pointer;

  .back-icon {
    display: block;
    width: 18px;
    height: 18px;
    object-fit: contain;
  }
}

h1 {
  margin: 0;
  font-size: 18px;
  line-height: 26px;
  font-weight: 600;
  white-space: nowrap;
}

.process-list {
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 22px;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
}

.process-list::-webkit-scrollbar {
  width: 4px;
}

.process-list::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background: #d6dee8;
}

.empty-tip {
  margin: 40px 0 0;
  color: #a6b0bd;
  font-size: 14px;
  text-align: center;
}

/* 分页条：布局与 ConsultationUserPicker 保持一致 */
.pagination-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 12px 22px 0 0;
  padding-top: 10px;
  border-top: 1px solid #f2f5f9;
}

.page-summary {
  color: #617185;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
}

.num-font {
  color: #383c41;
  font-family: 'Alimama FangYuanTi VF', sans-serif;
  font-style: normal;
}

.pagination-bar :deep(.el-pagination) {
  padding: 0;
  font-weight: 400;
}

/* 页码块与翻页按钮：统一浅底圆角小块 */
.pagination-bar :deep(.el-pagination.is-background .btn-prev),
.pagination-bar :deep(.el-pagination.is-background .btn-next),
.pagination-bar :deep(.el-pagination.is-background .el-pager li) {
  min-width: 24px;
  height: 24px;
  margin: 0 2px;
  padding: 0 4px;
  border-radius: 6px;
  background: #f5f7fa;
  color: #617185;
  font-size: 14px;
  line-height: 24px;
  transition: background 0.2s ease, color 0.2s ease;
}

.pagination-bar :deep(.el-pagination.is-background .btn-prev:hover),
.pagination-bar :deep(.el-pagination.is-background .btn-next:hover),
.pagination-bar :deep(.el-pagination.is-background .el-pager li:hover) {
  color: #007bff;
}

.pagination-bar :deep(.el-pagination.is-background .el-pager li.is-active) {
  background: #007bff;
  color: #ffffff;
}

/* 首页/末页时禁用翻页按钮 */
.pagination-bar :deep(.el-pagination.is-background .btn-prev:disabled),
.pagination-bar :deep(.el-pagination.is-background .btn-next:disabled) {
  background: #f5f7fa;
  color: #c2c8d2;
}
</style>
