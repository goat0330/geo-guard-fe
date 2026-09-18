<template>
  <div class="layout-wrapper">
    <!-- 左侧侧边栏 -->
    <Aside />

    <!-- 右侧主体内容容器 -->
    <main class="layout-main" :class="{ 'is-fixed-page': isMapWorkspace }">
      <div class="page-container" :class="{ 'is-fixed-page': isMapWorkspace }">
        <RouterView />
      </div>
      <!-- 会商入口由布局统一维护，路由切换时不重复创建会议状态与音视频连接。 -->
      <ConsultationEntry />
    </main>
  </div>
</template>

<script setup>
import Aside from './aside.vue'
import { RouterView } from 'vue-router'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ConsultationEntry from '@/components/ConsultationEntry/index.vue'

defineOptions({ name: 'AppLayout' })

const route = useRoute()
// 地图类页面：主体不参与外层滚动与白底卡片，由页面自身铺满容器
const isMapWorkspace = computed(() => {
  return (
    route.name === 'RiskEval'
    || route.name === 'DynamicRiskReport'
    || route.name === 'Monitor'
    || route.name === 'HazardReview'
    || route.name === 'GroupDefense'
    || route.path.includes('risk-eval')
  )
})
</script>

<style lang="less" scoped>
.layout-wrapper {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: url('@/assets/imgs/bg.png') no-repeat center / cover;
}

.layout-main {
  flex: 1;
  min-width: 0;
  height: calc(100vh - 28px);
  margin: 14px 16px 14px 0;
  background: #ffffff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0, 32, 80, 0.04);
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;

  &.is-fixed-page {
    overflow: visible;
    background: transparent;
    box-shadow: none;
  }

  /* 优雅滚动条 */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(148, 163, 184, 0.3);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(148, 163, 184, 0.5);
  }
}

.page-container {
  flex: 1;
  min-width: 0;
  min-height: 0;
  height: 100%;
  display: flex;
  flex-direction: column;

  &.is-fixed-page {
    overflow: visible;
  }
}
</style>
