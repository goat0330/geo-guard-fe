<template>
  <div class="wake-avatar-video" :class="{ mirrored: mirror }">
    <video :ref="(element) => setVideoRef(element, 0)" :class="{ active: activeVideoIndex === 0 }" autoplay muted playsinline></video>
    <video
      :ref="(element) => setVideoRef(element, 1)"
      :class="{ active: activeVideoIndex === 1 }"
      autoplay
      muted
      playsinline
    ></video>
    <el-switch
      v-if="showSwitch"
      class="wake-switch"
      :model-value="enabled"
      :width="34"
      @change="changeWakeStatus"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useWakeAssistantStore } from '@/store/wakeAssistant.js'

const videoRefs = ref([])
const activeVideoIndex = ref(0)
const wakeAssistantStore = useWakeAssistantStore()
const { enabled, avatarVideoLoop, avatarVideoPlaybackRate, avatarVideoSrc } = storeToRefs(wakeAssistantStore)
const ANSWER_VIDEO = '/video/dz-sh.webm'

const props = defineProps({
  // 是否正处于 TTS 音频播放阶段。
  isSpeaking: {
    type: Boolean,
    default: false,
  },
  // 是否显示语音唤醒开关。
  showSwitch: {
    type: Boolean,
    default: true,
  },
  // 是否水平镜像数字人画面。
  mirror: {
    type: Boolean,
    default: false,
  },
})

// 说话状态只临时覆盖展示视频，不影响唤醒流程维护的原始视频状态。
const displayVideoSrc = computed(() => (props.isSpeaking ? ANSWER_VIDEO : avatarVideoSrc.value))
const displayVideoLoop = computed(() => (props.isSpeaking ? true : avatarVideoLoop.value))
const displayVideoPlaybackRate = computed(() => (props.isSpeaking ? 1 : avatarVideoPlaybackRate.value))

function setVideoRef(element, index) {
  videoRefs.value[index] = element
}

/**
 * 切换语音唤醒监听状态。
 * @param {boolean} status - 是否启用语音唤醒。
 * @returns {void}
 */
function changeWakeStatus(status) {
  if (status) wakeAssistantStore.enable()
  else wakeAssistantStore.disable()
}

function waitUntilPlayable(video) {
  if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) return Promise.resolve()
  return new Promise((resolve) => {
    video.addEventListener('canplay', resolve, { once: true })
    video.addEventListener('error', resolve, { once: true })
  })
}

async function switchVideo() {
  await nextTick()
  const video = videoRefs.value[1 - activeVideoIndex.value]
  if (!video) return
  video.pause()
  video.src = displayVideoSrc.value
  video.loop = displayVideoLoop.value
  video.load()
  await waitUntilPlayable(video)
  video.playbackRate = displayVideoPlaybackRate.value
  await video.play().catch(() => {})

  const previousVideo = videoRefs.value[activeVideoIndex.value]
  activeVideoIndex.value = 1 - activeVideoIndex.value
  window.setTimeout(() => previousVideo?.pause(), 160)
}

onMounted(switchVideo)
watch([displayVideoSrc, displayVideoLoop, displayVideoPlaybackRate], switchVideo)
</script>

<style scoped>
.wake-avatar-video {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: visible;
}

video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
  transition: opacity 160ms linear;
}

.wake-avatar-video.mirrored video {
  transform: scaleX(-1);
}

video.active {
  opacity: 1;
}

.wake-switch {
  position: absolute;
  right: -36px;
  bottom: 6px;
  z-index: 2;
}

:deep(.wake-switch .el-switch__core) {
  --el-switch-on-color: #4394ef;
  --el-switch-off-color: #dce8f5;
}
</style>
