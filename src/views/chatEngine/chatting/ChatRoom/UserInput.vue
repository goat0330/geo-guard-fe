<template>
  <div class="user-input">
    <div class="input-box" :class="{ 'has-upload-preview': fileList.length }">
      <!-- 上传预览 -->
      <div v-if="fileList.length" class="upload-preview-list">
        <div
          v-for="file in fileList"
          :key="file.uid"
          class="upload-preview-item"
          :class="{
            'is-file': !isImageUploadFile(file),
            'is-uploading': file.status === 'uploading',
            'is-error': file.status === 'fail',
          }"
          :style="getUploadFileProgressStyle(file)"
        >
          <!-- 图片 -->
          <template v-if="isImageUploadFile(file)">
            <img class="upload-preview-img" :src="getUploadPreview(file)" :alt="file.name" />

            <div v-if="file.status !== 'success'" class="upload-progress-mask">
              <el-progress
                v-if="file.status === 'uploading'"
                type="circle"
                :percentage="getUploadPercent(file)"
                :width="36"
                :stroke-width="4"
                color="#ffffff"
              />

              <el-icon v-else-if="file.status === 'fail'" class="upload-error-icon">
                <WarningFilled />
              </el-icon>
            </div>
          </template>

          <!-- 文件 -->
          <template v-else>
            <img :src="file.status === 'uploading' ? fileUploadingIcon : fileUploadedIcon" class="upload-file-icon" />

            <div class="upload-file-info">
              <div class="upload-file-name" :title="file.name">
                {{ file.name }}
              </div>

              <div class="upload-file-status">
                <el-icon v-if="file.status === 'fail'" class="upload-error-icon">
                  <WarningFilled />
                </el-icon>

                <template v-else>
                  {{ getUploadStatusText(file) }}
                </template>
              </div>
            </div>
          </template>

          <!-- 删除 -->
          <button class="upload-remove-btn" type="button" @click="removeUploadFile(file)">
            <i class="iconfont icon-close" />
          </button>
        </div>
      </div>

      <!-- 输入框 -->
      <el-input
        ref="RInputRef"
        v-model="inputContent"
        type="textarea"
        resize="none"
        :placeholder="placeholderText"
        @keydown="handleKeydown"
        :disabled="isInputDisabled"
      />
    </div>

    <!-- 工具栏 -->
    <div class="tool-box">
      <div class="tool-left">
        <!-- 深度思考 -->
        <div
          class="deep-think-pill"
          :class="{ 'is-active': isDeepThink }"
          @click="isDeepThink = !isDeepThink"
        >
          <img
            :src="isDeepThink ? iconSparkleActive : iconSparkle"
            class="sparkle-icon"
            alt="深度思考"
          />
          <span>深度思考</span>
        </div>

        <!-- AI识图（暂时隐藏） -->
        <!--
        <div
          v-if="!selectUploadType || selectUploadType === 'img'"
          class="upload-common"
          :class="{ 'is-active': selectUploadType === 'img' }"
          @click="setUploadType('img')"
        >
          <i class="iconfont icon-img" />
          <span class="upload-text">AI识图</span>

          <i v-if="selectUploadType === 'img'" class="iconfont icon-close" @click.stop="setUploadType('')" />
        </div>
        -->

        <!-- 数字人模式仅在聊天详情页展示（暂时隐藏） -->
        <!--
        <div v-if="showHumanMode" class="human-mode-switch">
          <span>数字人模式</span>
          <el-switch :model-value="humanMode" :width="34" @change="changeHumanMode" />
        </div>
        -->
      </div>

      <!-- 发送 -->
      <div class="tool-right">
        <div
          class="
        "
        >
          <div v-if="!isRecording && !mikeLauncing && !isRecognizing" class="circle-box open-mike">
            <i class="iconfont icon-mic" @click="openMike"></i>
          </div>
          <div
            v-if="!isRecording && (mikeLauncing || isRecognizing)"
            class="is-loading"
            :title="isRecognizing ? '正在整理语音识别结果' : '正在连接麦克风'"
          ></div>
          <div v-if="isRecording" class="voice-work-animate" @click="shutdownMike">
            <div class="dot-1 dot-common"></div>
            <div class="dot-2 dot-common"></div>
            <div class="dot-3 dot-common"></div>
            <div class="dot-4 dot-common"></div>
            <div class="dot-5 dot-common"></div>
          </div>
        </div>
        <div class="split-line"></div>
        <div v-if="!isAnswering" class="send-btn" :class="{ 'send-btn-disabled': !inputContent }" @click="sendMsg">
          <i class="iconfont icon-a-Arrow-upjiantoushang" />
        </div>
        <div v-else class="stop-btn" @click="stopOutput">
          <i class="iconfont icon-stop" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Link, WarningFilled } from '@element-plus/icons-vue'
import { getToken } from '@/utils'
import fileUploadingIcon from '@/assets/imgs/chatEngine/file-uploading.png'
import fileUploadedIcon from '@/assets/imgs/chatEngine/file-uploaded.png'
import iconSparkle from '@/assets/imgs/home/icon-sparkle.png'
import iconSparkleActive from '@/assets/imgs/home/icon-sparkle-active.png'
import { useWakeAudio } from '@/hooks/useWakeAudio.js'
import { useWakeAssistantStore } from '@/store/wakeAssistant.js'
import { useUserStore } from '@/store/user.js'

const props = defineProps({
  noAgentSelctor: {
    type: Boolean,
    default: false,
  },
  isAnswering: {
    type: Boolean,
    default: false,
  },
  humanMode: {
    type: Boolean,
    default: false,
  },
  showHumanMode: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['send', 'stop', 'update:humanMode'])
const route = useRoute()
const wakeAssistantStore = useWakeAssistantStore()
const userStore = useUserStore()
const { isDeepThink } = storeToRefs(userStore)

const headers = {
  [import.meta.env.VITE_APP_TOKEN_KEY]: getToken(),
}

const inputContent = ref('')
const fileList = ref([])
const selectUploadType = ref('')
const uploadRef = ref()
const isInputDisabled = ref(false)

const audioText = ref('')
const isRecording = ref(false)
const isRecognizing = ref(false)
const mikeLauncing = ref(false)

/**
 * 更新数字人模式状态。
 * @param {boolean} enabled - 是否开启数字人模式。
 * @returns {void}
 */
function changeHumanMode(enabled) {
  emits('update:humanMode', enabled)
}

const placeholderText = computed(() => {
  if (isDeepThink.value) {
    return '已开启深度思考，请输入您的问题...'
  }
  if (selectUploadType.value === 'img') return '上传照片后，我将为您识别地灾迹象'
  if (selectUploadType.value === 'file')
    return '请上传最新发布的【恩施州地质灾害气象风险预警】，我将自动提取关键信息并同步入库'
  return '有问题，随时问我...'
})

const uploadAccept = computed(() => {
  if (selectUploadType.value === 'img') return 'image/*'
  return '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar,.7z'
})

// 解析允许的文件后缀
function getAcceptExtensions() {
  const accept = uploadAccept.value
  if (!accept || accept === 'image/*') return []
  return accept
    .split(',')
    .map((ext) => ext.trim().toLowerCase())
    .filter(Boolean)
}

const wakeAudioActive = computed(
  () =>
    route.meta.notUseChat === true &&
    !props.isAnswering &&
    !(route.path === '/chat-engine/chatting' && (userStore.userQuestion || userStore.userFiles?.length)),
)
const playWakeFeedback = () => {
  if (route.path === '/chat-engine/chatting') {
    return userStore.isHumanMode ? wakeAssistantStore.playWakeAnimations() : wakeAssistantStore.playWakeAudio()
  }
  return wakeAssistantStore.playWakeAnimations()
}

const { audio } = useWakeAudio({
  textRef: audioText,
  statusRef: isRecording,
  recognizingStatusRef: isRecognizing,
  activeRef: wakeAudioActive,
  autoStopCb: () => sendMsg(),
  wakeDetectedCb: playWakeFeedback,
})

const removeLeadingPunctuation = (text = '') => text.replace(/^[\p{P}\p{Z}\s]+/gu, '')

watch(
  () => audioText.value,
  (val) => {
    inputContent.value = val
  },
)

watch(inputContent, (value) => {
  const normalizedValue = removeLeadingPunctuation(value)
  if (normalizedValue !== value) inputContent.value = normalizedValue
  if (audioText.value !== normalizedValue) audioText.value = normalizedValue
})

async function openMike() {
  mikeLauncing.value = true
  await audio.open()
  audioText.value = inputContent.value
  // 连接动画过渡
  setTimeout(() => {
    mikeLauncing.value = false
    audio.startManualInput()
  }, 200)
}

async function shutdownMike() {
  audio.deactivateInput()
}

function stopOutput() {
  emits('stop')
}

// 上传类型
function setUploadType(type) {
  if (type && fileList.value.length > 0) {
    ElMessage.warning('只能上传一个文件或图片')
    return
  }

  const pre = selectUploadType.value

  selectUploadType.value = pre === type ? '' : type

  if (pre !== selectUploadType.value) {
    clearUploadFiles()
  }
}

// 上传前
function beforeUpload(file) {
  const maxSize = 50

  const isLt = file.size / 1024 / 1024 < maxSize

  // 限制selectUploadType只能上传对应类型的文件
  if (selectUploadType.value === 'img' && !file.type.startsWith('image/')) {
    ElMessage.error('只能上传图片文件')
    return false
  }

  if (selectUploadType.value === 'file') {
    const ext = '.' + (file.name?.split('.').pop()?.toLowerCase() || '')
    if (!getAcceptExtensions().includes(ext)) {
      ElMessage.error('只能上传文件（支持 pdf、doc、docx、xls、xlsx、ppt、pptx、txt、csv、zip、rar、7z 等格式）')
      return false
    }
  }

  if (!isLt) {
    ElMessage.error(`文件不能超过 ${maxSize}MB`)
    return false
  }

  return true
}

// 文件变化
function handleFileChange(uploadFile, uploadFiles) {
  if (uploadFiles.length > 1) {
    uploadFiles.splice(0, uploadFiles.length - 1)
  }

  uploadFiles.forEach((file) => {
    if (isImageUploadFile(file) && file.raw && !file.previewUrl) {
      file.previewUrl = URL.createObjectURL(file.raw)
    }
  })

  fileList.value = uploadFiles
}

// 上传进度
function handleUploadProgress(event, uploadFile) {
  syncUploadFileInfo(uploadFile, {
    status: 'uploading',
    percentage: Math.round(event.percent || 0),
  })
}

// 上传成功
function handleFileSuccess(response, uploadFile) {
  const res = typeof response === 'string' ? JSON.parse(response) : response

  if (res.code !== 200) {
    syncUploadFileInfo(uploadFile, {
      status: 'fail',
    })

    ElMessage.error(res.msg || '上传失败')

    return
  }

  syncUploadFileInfo(uploadFile, {
    status: 'success',
    response: res,
    ossId: res?.data,
  })

  if (selectUploadType.value === 'img') {
    inputContent.value = '帮我识别这张图片'
    isInputDisabled.value = true
  } else if (selectUploadType.value === 'file') {
    inputContent.value = '帮我解读这份报告，并提取关键信息入库'
    isInputDisabled.value = true
  }

  // 上传成功后，隐藏上传按钮
  selectUploadType.value = ''
}

// 上传失败
function handleFileError(err, uploadFile) {
  console.error(err)

  syncUploadFileInfo(uploadFile, {
    status: 'fail',
  })

  ElMessage.error('文件上传失败')
}

// 同步文件
function syncUploadFileInfo(uploadFile, info = {}) {
  Object.assign(uploadFile, info)

  const target = fileList.value.find((item) => item.uid === uploadFile.uid)

  if (target) {
    Object.assign(target, info)
  }
}

// 是否图片
function isImageUploadFile(file) {
  return file?.raw?.type?.startsWith('image/')
}

// 图片预览
function getUploadPreview(file) {
  return file.previewUrl || file.url
}

// 百分比
function getUploadPercent(file) {
  return Math.round(file?.percentage || 0)
}

// 文件大小
function formatFileSize(size) {
  if (!size) return ''

  if (size < 1024) {
    return `${size}B`
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)}KB`
  }

  return `${(size / 1024 / 1024).toFixed(1)}MB`
}

// 状态
function getUploadStatusText(file) {
  if (file.status === 'success') {
    const extension = file.name?.split('.').pop()?.toLowerCase() || ''
    return `${extension} · ${formatFileSize(file.size)}`
  }

  if (file.status === 'fail') {
    return '上传失败'
  }

  return `上传中...${getUploadPercent(file)}%`
}

// 文件上传进度条样式
function getUploadFileProgressStyle(file) {
  if (isImageUploadFile(file) || file.status !== 'uploading') {
    return null
  }
  const percent = getUploadPercent(file)
  return {
    background: `linear-gradient(to right, #E7E7E7 ${percent}%, #F5F5F5 ${percent}%)`,
  }
}

// 删除
function removeUploadFile(file) {
  if (file.previewUrl) {
    URL.revokeObjectURL(file.previewUrl)
  }

  fileList.value = fileList.value.filter((item) => item.uid !== file.uid)

  inputContent.value = ''
  isInputDisabled.value = false

  if (fileList.value.length === 0) {
    selectUploadType.value = ''
  }

  uploadRef.value?.handleRemove?.(file)
}

// 清空
function clearUploadFiles() {
  fileList.value.forEach((file) => {
    if (file.previewUrl) {
      URL.revokeObjectURL(file.previewUrl)
    }
  })

  fileList.value = []

  uploadRef.value?.clearFiles?.()
}

// 发送
async function sendMsg() {
  if (props.isAnswering) return

  // 必须有文本才能发送
  if (!inputContent.value) {
    return
  }

  const uploading = fileList.value.some((item) => item.status === 'uploading')
  if (uploading) {
    ElMessage.warning('文件上传中')
    return
  }

  const fail = fileList.value.some((item) => item.status === 'fail')

  if (fail) {
    ElMessage.warning('请删除失败文件')
    return
  }

  const file = fileList.value.length ? fileList.value[0] : null
  let finalUploadType = selectUploadType.value
  if (file) {
    finalUploadType = isImageUploadFile(file) ? 'img' : 'file'
  }

  audio.stop()

  emits('send', inputContent.value, fileList.value, finalUploadType)
}

// enter发送
function handleKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMsg()
  }
}

function clearInput() {
  audio.clearRecognizedText()
  inputContent.value = ''
  clearUploadFiles()
  isInputDisabled.value = false
  selectUploadType.value = ''
}

defineExpose({
  clearInput,
})
</script>

<style scoped lang="less">
.user-input {
  flex: 1;
  min-height: 0;
  border: 1px solid #dce1ea;
  border-radius: 12px;
  padding: 16px;
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}

.input-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
  min-height: 0;

  :deep(.el-textarea__inner) {
    border: none;
    box-shadow: none;
    padding: 0;
    font-size: 14px;
    line-height: 24px;
    height: 100%;
  }

  :deep(.el-textarea.is-disabled .el-textarea__inner) {
    background-color: transparent;
    color: var(--el-input-text-color);
    -webkit-text-fill-color: var(--el-input-text-color);
  }

  :deep(.el-textarea) {
    flex: 1;
  }
}

.upload-preview-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.upload-preview-item {
  position: relative;
}

/* 图片 */
.upload-preview-img {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  object-fit: cover;
}

/* 文件 */
.upload-preview-item.is-file {
  width: 13.75rem;
  height: 3.375rem;
  border-radius: 0.625rem;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem;
  box-sizing: border-box;
  overflow: visible;
}

.upload-file-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.upload-file-info {
  flex: 1;
  min-width: 0;
}

.upload-file-name {
  font-size: 14px;
  color: #222529;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.upload-file-status {
  margin-top: 6px;
  font-size: 14px;
  color: #8a93a6;
}

/* 上传中 */
.is-uploading::after {
  content: '';
  position: absolute;
  inset: 0;
  // background: rgba(255, 255, 255, 0.4);
}

/* 删除 */
.upload-remove-btn {
  position: absolute;
  top: -3px;
  right: -3px;
  width: 14px;
  height: 14px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  cursor: pointer;
  opacity: 0;
  transition: 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 10px;
  }
}

.upload-preview-item:not(.is-uploading):hover .upload-remove-btn {
  opacity: 1;
}

/* 工具栏 */
.tool-box {
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.tool-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

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

.human-mode-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
  padding-left: 16px;
  border-left: 1px solid #d6d9e5;
  color: #3561fa;
  font-size: 14px;

  :deep(.el-switch__core) {
    --el-switch-on-color: #4d73ff;
  }
}

.upload-common {
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  background: #f5f7fb;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: 0.2s;
  font-size: 14px;

  &:hover {
    background: #e9edf5;
  }

  &.is-active {
    background: rgba(53, 97, 250, 0.1);
    color: #3561fa;
  }

  .upload-text {
    font-size: 14px;
  }
}

.tool-right {
  display: flex;
  align-items: center;
}

.mike-box {
  display: flex;
  align-items: center;
}

.circle-box {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.open-mike {
  &:hover {
    background-color: #dfe4f0;
  }
  img {
    width: 26px;
    height: 26px;
    cursor: pointer;
  }

  i {
    color: #506073;
    font-size: 18px;
    cursor: pointer;
  }
}

.split-line {
  margin: 0 16px 0 12px;
  width: 1px;
  height: 24px;
  background-color: #d6d9e5;
}

/* 发送 */
.send-btn {
  width: 44px;
  height: 32px;
  border-radius: 47px;
  background: linear-gradient(130deg, #3561fa 10.99%, #44ceff 117.04%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: 0.2s;
}

.send-btn:hover {
  transform: scale(1.02);
}

.send-btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stop-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(243deg, #2f82ff 11.23%, #535cf6 85.89%);
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
  i {
    color: #fff;
  }
}

.is-loading {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-block;
  border-top: 3px solid #506073;
  border-right: 3px solid transparent;
  box-sizing: border-box;
  animation: rotation 1.2s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.voice-work-animate {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(130deg, #3561fa 10.99%, #44ceff 117.04%);
  cursor: pointer;
  gap: 2px;
  .dot-common {
    width: 1.8px;
    height: 4px;
    border-radius: 999px;
    background-color: #ffffff;
  }
  .dot-1 {
    animation: dot-animation 1.5s linear infinite;
    animation-delay: 0.8s;
  }
  .dot-2 {
    animation: dot-animation 1.5s linear infinite;
    animation-delay: 0.5s;
  }
  .dot-3 {
    animation: dot-animation 1.5s linear infinite;
    animation-delay: 0.2s;
  }
  .dot-4 {
    animation: dot-animation 1.5s linear infinite;
    animation-delay: 0.5s;
  }
  .dot-5 {
    animation: dot-animation 1.5s linear infinite;
    animation-delay: 0.8s;
  }
}
@keyframes dot-animation {
  0% {
    height: 4px;
  }
  15% {
    height: 6px;
  }
  30% {
    height: 8px;
  }
  50% {
    height: 10px;
  }
  65% {
    height: 8px;
  }
  85% {
    height: 6px;
  }
  100% {
    height: 4px;
  }
}

.upload-progress-mask {
  position: absolute;
  inset: 0;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  --el-progress-text-color: #ffffff;
  :deep(.el-progress-circle) {
    width: 36px !important;
    height: 36px !important;
  }
  :deep(.el-progress__text) {
    min-width: unset;
    font-size: 12px !important;
    color: #ffffff !important;
  }
}

.upload-error-icon {
  color: #f56c6c;
}
</style>
