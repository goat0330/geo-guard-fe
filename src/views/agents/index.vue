<template>
  <section class="agents-page">
    <div class="agents-content">
      <header class="page-title">
        <h1>智能体广场</h1>
        <p>您的智能办公伙伴，助力每一项任务</p>
      </header>

      <div class="toolbar">
        <div class="category-tabs" role="tablist" aria-label="智能体分类">
          <button
            v-for="category in AGENT_CATEGORIES"
            :key="category.value"
            type="button"
            class="category-button"
            :class="{ 'is-active': activeCategory === category.value }"
            @click="activeCategory = category.value"
          >
            {{ category.label }}
          </button>
        </div>
        <el-input
          v-model.trim="keyword"
          class="search-input"
          placeholder="搜索AI工具"
          clearable
          :prefix-icon="Search"
        />
      </div>

      <div v-if="filteredTools.length" class="tool-grid">
        <article
          v-for="tool in filteredTools"
          :key="tool.title"
          class="tool-card"
          tabindex="0"
          @click="openTool(tool)"
          @keydown.enter="openTool(tool)"
        >
          <span v-if="tool.tag" class="tool-tag" :class="`is-${tool.tag.toLowerCase()}`">{{ tool.tag }}</span>
          <div class="tool-main">
            <img v-if="tool.image" :src="tool.image" :alt="tool.title" class="tool-avatar" />
            <span v-else class="tool-avatar icon-avatar" :style="{ color: tool.color, background: tool.background }">
              <el-icon><component :is="iconMap[tool.icon]" /></el-icon>
            </span>
            <div class="tool-copy">
              <h2>{{ tool.title }}</h2>
              <p>{{ tool.description }}</p>
            </div>
          </div>
          <footer class="tool-footer">
            <span class="tool-hot"
              ><el-icon><Histogram /></el-icon><b>{{ tool.hot }}</b></span
            >
            <span>来自 地质灾害防治智能体</span>
          </footer>
        </article>
      </div>
      <el-empty v-else description="未找到匹配的智能体" />
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user.js'
import { AGENT_CATEGORIES, AGENT_TOOLS } from '@/utils/agentTools.js'
import {
  Calendar,
  ChatDotRound,
  CircleCheck,
  DataAnalysis,
  Document,
  EditPen,
  Grid,
  Histogram,
  List,
  Microphone,
  Picture,
  Present,
  Search,
  Switch,
  Tickets,
} from '@element-plus/icons-vue'

defineOptions({ name: 'AgentSquarePage' })

const router = useRouter()
const userStore = useUserStore()
const keyword = ref('')
const activeCategory = ref('all')

const iconMap = {
  Calendar,
  ChatDotRound,
  CircleCheck,
  DataAnalysis,
  Document,
  EditPen,
  Grid,
  List,
  Microphone,
  Picture,
  Present,
  Switch,
  Tickets,
}

const filteredTools = computed(() => {
  const searchValue = keyword.value.toLocaleLowerCase()
  return AGENT_TOOLS.filter((tool) => {
    const matchesCategory = activeCategory.value === 'all' || tool.category === activeCategory.value
    const matchesKeyword = !searchValue || `${tool.title}${tool.description}`.toLocaleLowerCase().includes(searchValue)
    return matchesCategory && matchesKeyword
  })
})

function openTool(tool) {
  if (tool.route) {
    router.push(tool.route)
    return
  }
  userStore.saveUserQuestion(tool.prompt)
  router.push({ path: '/chat-engine/chatting', query: { _refresh: Date.now() } })
}
</script>

<style lang="less" scoped>
.agents-page {
  flex: 1;
  min-height: 0;
  overflow: auto;
  color: #222527;
  background: linear-gradient(180deg, rgba(220, 237, 255, 0.44) 0, rgba(255, 255, 255, 0) 220px), #ffffff;
}

.agents-content {
  width: min(1120px, calc(100% - 64px));
  margin: 0 auto;
  padding: 44px 0 48px;
}

.page-title {
  text-align: center;

  h1 {
    margin: 0;
    color: #222527;
    font-family: 'Alimama FangYuanTi VF', sans-serif;
    font-size: 32px;
    line-height: 44px;
    font-weight: 500;
  }

  p {
    margin: 4px 0 0;
    color: #617185;
    font-size: 14px;
    line-height: 22px;
  }
}

.toolbar {
  margin: 48px 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-button {
  min-height: 34px;
  padding: 6px 12px;
  border: 0;
  border-radius: 6px;
  color: #617185;
  background: transparent;
  font: inherit;
  font-size: 14px;
  cursor: pointer;
  transition:
    color 0.2s ease,
    background-color 0.2s ease;

  &:hover,
  &.is-active {
    color: #007bff;
    background: #dcedff;
  }
}

.search-input {
  width: 240px;
  flex: 0 0 auto;

  :deep(.el-input__wrapper) {
    border-radius: 6px;
    background: #f4f7fa;
    box-shadow: 0 0 0 1px transparent inset;

    &.is-focus {
      background: #ffffff;
      box-shadow: 0 0 0 1px #007bff inset;
    }
  }
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.tool-card {
  position: relative;
  min-width: 0;
  min-height: 156px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #e1e6ee;
  border-radius: 8px;
  background: #ffffff;
  cursor: pointer;
  overflow: hidden;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:hover,
  &:focus-visible {
    outline: none;
    transform: translateY(-2px);
    border-color: #9bc8ff;
    box-shadow: 0 8px 20px rgba(0, 64, 140, 0.1);
  }
}

.tool-tag {
  position: absolute;
  top: 0;
  right: 0;
  width: 48px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 0 0 0 8px;
  color: #ffffff;
  font-family: 'Alimama FangYuanTi VF', sans-serif;
  font-size: 12px;

  &.is-hot {
    background: #ff922c;
  }
  &.is-new {
    background: #007bff;
  }
}

.tool-main {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.tool-avatar {
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border-radius: 50%;
  object-fit: cover;
}

.icon-avatar {
  display: grid;
  place-items: center;
  font-size: 24px;
}

.tool-copy {
  min-width: 0;

  h2 {
    margin: 0 0 8px;
    color: #222527;
    font-size: 16px;
    line-height: 22px;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: #9096a2;
    font-size: 12px;
    line-height: 18px;
  }
}

.tool-footer {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #a6acb8;
  font-size: 12px;
  line-height: 18px;
}

.tool-hot {
  display: inline-flex;
  align-items: center;
  gap: 4px;

  b {
    font-family: 'Alimama FangYuanTi VF', sans-serif;
    font-weight: 400;
  }
}

@media (max-width: 1080px) {
  .tool-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .toolbar {
    align-items: flex-start;
  }
}

@media (max-width: 720px) {
  .agents-content {
    width: calc(100% - 32px);
    padding-top: 28px;
  }
  .toolbar {
    margin-top: 32px;
    flex-direction: column;
  }
  .search-input {
    width: 100%;
  }
  .tool-grid {
    grid-template-columns: 1fr;
  }
}
</style>
