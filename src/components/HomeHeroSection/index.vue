<template>
  <div class="hero-section">
    <!-- 平台主标题 -->
    <div class="title-wrapper">
      <h1 class="main-title">
        <img class="chongqing-logo" :src="chongqingLogo" alt="重庆" />
        <span>地质灾害防治智能体</span>
      </h1>
    </div>

    <!-- 副标题 -->
    <div class="sub-title">
      <span>监测预警</span>
      <span class="dot">·</span>
      <span>会商研判</span>
      <span class="dot">·</span>
      <span>应急处置</span>
      <span class="dot">·</span>
      <span>复盘优化</span>
    </div>

    <!-- AI 搜索提问卡片 -->
    <div class="search-card">
      <!-- 左侧科技点阵装饰 -->
      <div class="tech-dot-grid"></div>

      <!-- 重庆城市地标建筑背景 -->
      <img :src="cqBg" class="cq-city-bg" alt="重庆城市背景" />

      <div class="badge-and-mascot">
        <div class="campaign-badge">
          <span class="badge-tag">{{ `百日攻坚\nAI赋能地质灾害` }}</span>
        </div>
        <img src="@/assets/imgs/home/ai-avatar.png" class="mascot-img" alt="AI吉祥物" />
      </div>
      <textarea
        :value="modelValue"
        class="search-input"
        placeholder="请输入你想问的问题"
        rows="2"
        @input="$emit('update:modelValue', $event.target.value)"
        @keydown.enter.prevent="handleEnter"
      ></textarea>
      <div class="search-bottom-bar">
        <div class="deep-think-pill" :class="{ 'is-active': isDeepThink }" @click="isDeepThink = !isDeepThink">
          <img :src="isDeepThink ? iconSparkleActive : iconSparkle" class="sparkle-icon" alt="深度思考" />
          <span>深度思考</span>
        </div>

        <div class="search-actions-right">
          <button class="voice-btn" title="语音提问" @click="$emit('voice')">
            <img :src="iconVoice" class="voice-icon" alt="语音提问" />
          </button>
          <span class="action-divider"></span>
          <button
            class="send-btn"
            :class="{ 'is-enabled': (modelValue || '').trim() }"
            title="发送"
            @click="handleSend"
          >
            <img :src="iconUp" class="send-icon" alt="发送" />
          </button>
        </div>
      </div>
    </div>

    <QuestionMarquee :questions="prompts" @select="applyPrompt" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import QuestionMarquee from '@/components/QuestionMarquee/index.vue'
import { useUserStore } from '@/store/user'
import { quesPool } from '@/utils/ques_pool'

import iconSparkle from '@/assets/imgs/home/icon-sparkle.png'
import iconSparkleActive from '@/assets/imgs/home/icon-sparkle-active.png'
import iconVoice from '@/assets/imgs/home/voice.svg?url'
import iconUp from '@/assets/imgs/home/up.svg?url'
import chongqingLogo from '@/assets/imgs/home/chongqing.png'
import cqBg from '@/assets/imgs/home/cq-bg.png'

defineOptions({ name: 'HomeHeroSection' })

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  quickPrompts: {
    type: Array,
    default: () => quesPool,
  },
})

const emit = defineEmits(['update:modelValue', 'search', 'voice'])

const userStore = useUserStore()
const { isDeepThink } = storeToRefs(userStore)

const prompts = computed(() => props.quickPrompts)

function handleEnter() {
  emit('search', props.modelValue)
}

function handleSend() {
  emit('search', props.modelValue)
}

function applyPrompt(text) {
  emit('update:modelValue', text)
  emit('search', text)
}
</script>

<style lang="less" scoped>
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 1000px;
  max-width: 100%;
  margin: 100px auto 0;

  /* 顶部背景流云光晕：位置精准对齐设计稿红框（副标题至输入框周边），色彩轻透自然，无棱角无重色边缘 */
  &::before {
    content: '';
    position: absolute;
    top: 64px;
    left: 50%;
    transform: translateX(-50%);
    width: 100vw;
    max-width: 1600px;
    height: 420px;
    background:
      /* 1. 右侧建筑与吉祥物周围的淡雅柔光（透明度极浅，自然向周边淡出） */
      radial-gradient(ellipse 55% 55% at 66% 38%, rgba(188, 226, 255, 0.32) 0%, rgba(216, 239, 255, 0.16) 45%, rgba(255, 255, 255, 0) 78%),
      /* 2. 左侧副标题与输入框上方的轻薄云雾 */
      radial-gradient(ellipse 50% 50% at 34% 34%, rgba(200, 232, 255, 0.24) 0%, rgba(228, 244, 255, 0.12) 40%, rgba(255, 255, 255, 0) 72%),
      /* 3. 横向大范围超柔和漫射底色（向屏幕两侧宽阔消融至纯白，周边色彩极浅接近白色） */
      radial-gradient(ellipse 75% 65% at 50% 42%, rgba(212, 236, 255, 0.22) 0%, rgba(236, 247, 255, 0.10) 50%, rgba(255, 255, 255, 0) 85%);
    z-index: 0;
    pointer-events: none;
  }
}

.title-wrapper {
  width: 100%;
  gap: 19px;
  position: relative;
  z-index: 2;

  .main-title {
    position: relative;
    left: -33px;
    display: flex;
    align-items: center;
    font-family: 'DingTalk JinBuTi', 'DingTalkJinBuTi', sans-serif;
    font-size: 60px;
    font-weight: 800;
    letter-spacing: 0;
    line-height: 1.2;
    margin: 0;

    .chongqing-logo {
      flex: 0 0 auto;
      width: 169.91px;
      height: 108px;
      margin-right: 8px;
      object-fit: contain;
    }

    span {
      position: relative;
      left: -25px;
      color: #007BFF;
      background: linear-gradient(90deg, #007BFF 12.5%, #00B2FF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

}

.sub-title {
  font-family: 'DingTalk JinBuTi', 'DingTalkJinBuTi', sans-serif;
  width: 100%;
  margin-top: 19px;
  margin-bottom: 48px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  font-weight: 400;
  color: #577BA4;
  letter-spacing: 0;
  position: relative;
  z-index: 2;

  .dot {
    color: #94a3b8;
    font-weight: bold;
  }
}

/* 搜索大输入框 */
.search-card {
  width: 100%;
  max-width: none;
  height: 184px;
  background: #ffffff;
  border: 1px solid #dce1ea;
  border-radius: 12px;
  box-shadow: none;
  padding: 16px;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  transition: all 0.25s;

  /* 左侧科技网格点阵：贴合卡片左沿，扇形向外自然淡出，色彩轻浅 */
  .tech-dot-grid {
    position: absolute;
    left: -118px;
    top: 6px;
    width: 120px;
    height: 180px;
    background-image: radial-gradient(rgba(53, 149, 251, 0.22) 1.5px, transparent 1.5px);
    background-size: 10px 10px;
    mask-image: radial-gradient(ellipse 100% 70% at 100% 60%, rgba(0, 0, 0, 0.75) 10%, transparent 80%);
    -webkit-mask-image: radial-gradient(ellipse 100% 70% at 100% 60%, rgba(0, 0, 0, 0.75) 10%, transparent 80%);
    pointer-events: none;
    z-index: 0;
  }

  .cq-city-bg {
    position: absolute;
    right: 2px;
    bottom: calc(100% - 10px);
    width: 556px;
    height: 286px;
    object-fit: contain;
    pointer-events: none;
    z-index: 0;
  }

  .badge-and-mascot {
    position: absolute;
    right: -8px;
    bottom: calc(100% + 8px);
    z-index: 2;
    display: flex;
    align-items: center;
    gap: 4px;
    height: 205px;
    pointer-events: none;
  }

  .campaign-badge {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    width: 168px;
    height: 88px;
    padding: 0 14px;
    box-sizing: border-box;
    border-radius: 16px 16px 0 16px;
    background: #FFFCFA;
    box-shadow: 0 4px 10px 0 #0087CA24;

    .badge-tag {
      display: block;
      font-family: 'Alimama FangYuanTi VF', sans-serif;
      font-size: 20px;
      line-height: 30px;
      font-weight: 600;
      white-space: pre-line;
      background: linear-gradient(90deg, #FF6E1A 0%, #FFA600 100%);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
    }
  }

  .mascot-img {
    width: 144px;
    height: 205px;
    object-fit: contain;
  }

  &:focus-within {
    border-color: #b9c8df;
    box-shadow: 0 2px 6px rgba(57, 126, 251, 0.1);
  }

  .search-input {
    width: 100%;
    resize: none;
    border: none;
    outline: none;
    font-size: 14px;
    color: #1a1a1a;
    line-height: 1.6;
    height: 108px;

    &::placeholder {
      color: #878898;
    }
  }

  .search-bottom-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0;
    padding-top: 0;

    .deep-think-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      height: 34px;
      padding: 0 14px;
      background: #f5f7fb;
      border: 0;
      border-radius: 999px;
      font-size: 14px;
      color: #222529;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s;

      .sparkle-icon {
        width: 16px;
        height: 16px;
      }

      &:hover {
        background: #e9edf5;
      }

      &.is-active {
        background: rgba(53, 97, 250, 0.1);
        color: #3561fa;
        font-weight: 500;
      }
    }

    .search-actions-right {
      display: flex;
      align-items: center;
      gap: 12px;

      .voice-btn {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        color: #506073;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: #f1f5f9;
          color: #2a6ff7;
        }

        .voice-icon {
          width: 20px;
          height: 20px;
        }
      }

      .action-divider {
        width: 1px;
        height: 24px;
        background: #d6d9e5;
      }

      .send-btn {
        width: 44px;
        height: 32px;
        border-radius: 47px;
        background: linear-gradient(130deg, #3561fa 10.99%, #44ceff 117.04%);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: none;
        opacity: 0.5;
        transition: all 0.2s;

        .send-icon {
          width: 20px;
          height: 20px;
        }

        &:hover {
          transform: scale(1.02);
        }

        &.is-enabled {
          opacity: 1;
        }
      }
    }
  }
}
</style>
