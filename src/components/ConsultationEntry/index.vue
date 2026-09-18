<template>
  <div class="consultation-entry">
    <!-- 会商研判浮动入口：地图左下角。无会议时点击拉人，有会议时点击显示会商室 -->
    <Transition name="consultation-float">
      <div
        v-if="showFloatingMeetingBtn"
        class="meeting-floating-btn"
        :class="{ 'is-dragging': isMeetingDragging }"
        :style="meetingButtonStyle"
        :title="isConsultationActive ? '显示应急会商室' : '启动会商研判'"
        role="button"
        tabindex="0"
        @pointerdown="startMeetingDrag"
        @keydown.enter="handleFloatingMeetingClick"
      >
        <img :src="meetingIcon" :alt="isConsultationActive ? '显示应急会商室' : '启动会商研判'" />
      </div>
    </Transition>

    <!-- 视频会议浮动入口：会商进行中且视频未开启时出现 -->
    <Transition name="consultation-float">
      <div
        v-if="showFloatingVideoBtn"
        class="video-calling-floating-btn"
        title="开启视频会议"
        role="button"
        tabindex="0"
        @click="openLiveRoom"
        @keydown.enter="openLiveRoom"
      >
        <img :src="callingIcon" alt="开启视频会议" />
      </div>
    </Transition>

    <ConsultationUserPicker
      v-model:visible="userPickerVisible"
      :mode="userPickerMode"
      :existing-member-ids="existingMemberIds"
      :submit-loading="isActionLoading"
      @confirm="handleUserPickerConfirm"
    />

    <EmergencyConsultationBar
      :visible="consultationRoomVisible"
      :meeting-title="currentMeeting?.title || '应急会商室'"
      :participants="currentParticipants"
      :is-mainer="isMainer"
      @open-video="openLiveRoom"
      @invite-member="handleOpenInvitePicker"
      @fold="foldConsultationRoom"
      @close-meeting="handleCloseOrLeaveMeeting"
    />

    <LiveRoom
      v-model:live-room-show="liveRoomShow"
      :meeting-id="meetingId"
      :mainer-id="mainerId"
      @meeting-closed="handleMeetingClosed"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import LiveRoom from '@/components/LiveRoom/index.vue'
import ConsultationUserPicker from '@/components/ConsultationUserPicker/index.vue'
import EmergencyConsultationBar from '@/components/EmergencyConsultationBar/index.vue'
import { useConsultation } from '@/composables/useConsultation.js'
import meetingIcon from '@/assets/imgs/meeting.png'
import callingIcon from '@/assets/imgs/calling.png'

defineOptions({ name: 'ConsultationEntry' })

const props = defineProps({
  /** 左侧业务面板是否收起：收起后浮动入口平移到地图左边缘 */
  panelCollapsed: {
    type: Boolean,
    default: false,
  },
  /** 面板展开时浮动入口的 left（px） */
  openLeft: {
    type: Number,
    default: 16,
  },
  /** 面板收起时浮动入口的 left（px） */
  collapsedLeft: {
    type: Number,
    default: 16,
  },
})

const userPickerVisible = ref(false)
const userPickerMode = ref('create')
const meetingPosition = ref({ left: null, top: null })
/** 拖动中：用于临时关闭位移动画，保证跟手 */
const isMeetingDragging = ref(false)

const {
  meetingId,
  mainerId,
  currentMeeting,
  currentParticipants,
  isMainer,
  consultationRoomVisible,
  liveRoomShow,
  isActionLoading,
  startOrJoinConsultation,
  checkAndJoinActiveMeeting,
  inviteNewUsers,
  endCurrentMeeting,
  foldConsultationRoom,
  openConsultationRoom,
  openLiveRoom,
  handleMeetingClosed,
} = useConsultation()

/** 是否已有进行中的会商 */
const isConsultationActive = computed(() => Boolean(meetingId.value))

/** 应急会商室未展开时才显示浮动入口（未开会或已收起） */
const showFloatingMeetingBtn = computed(() => !consultationRoomVisible.value)

/** 已开启会商且视频会议未打开时显示视频入口 */
const showFloatingVideoBtn = computed(() => isConsultationActive.value && !liveRoomShow.value)

/** 已在会中的成员 ID，用于选人弹窗去重 */
const existingMemberIds = computed(() => currentParticipants.value
  .filter((participant) => participant.status !== 'REMOVED')
  .map((participant) => String(participant.userId)))

const meetingButtonStyle = computed(() => ({
  left: `${meetingPosition.value.left ?? (props.panelCollapsed ? props.collapsedLeft : props.openLeft)}px`,
  ...(meetingPosition.value.top === null ? { bottom: '20px' } : { top: `${meetingPosition.value.top}px` }),
}))

const startMeetingDrag = (event) => {
  const button = event.currentTarget
  if (event.button !== 0) return
  /* 定位基准取「最近的已定位祖先」而非父节点：
     组件外层是 display: contents（不生成盒模型），其 getBoundingClientRect() 全为 0，
     若以它为基准，可拖动范围会退化成 0、初始偏移变成视口坐标，按钮会被夹到左上角。 */
  const container = button.offsetParent
  if (!container) return
  const containerRect = container.getBoundingClientRect()
  const buttonRect = button.getBoundingClientRect()
  const startX = event.clientX
  const startY = event.clientY
  const initialLeft = buttonRect.left - containerRect.left
  const initialTop = buttonRect.top - containerRect.top
  let moved = false
  /* 拖动期间关闭过渡，避免 left/top 被动画"追赶"产生顿挫 */
  isMeetingDragging.value = true
  button.setPointerCapture(event.pointerId)
  const move = (moveEvent) => {
    const dx = moveEvent.clientX - startX
    const dy = moveEvent.clientY - startY
    moved ||= Math.abs(dx) > 3 || Math.abs(dy) > 3
    meetingPosition.value = { left: Math.max(0, Math.min(containerRect.width - buttonRect.width, initialLeft + dx)), top: Math.max(0, Math.min(containerRect.height - buttonRect.height, initialTop + dy)) }
  }
  const end = (endEvent) => {
    isMeetingDragging.value = false
    button.removeEventListener('pointermove', move)
    button.removeEventListener('pointerup', end)
    button.removeEventListener('pointercancel', end)
    if (!moved) handleFloatingMeetingClick()
    if (button.hasPointerCapture(endEvent.pointerId)) button.releasePointerCapture(endEvent.pointerId)
  }
  button.addEventListener('pointermove', move)
  button.addEventListener('pointerup', end)
  button.addEventListener('pointercancel', end)
}

const handleFloatingMeetingClick = async () => {
  if (isConsultationActive.value) {
    openConsultationRoom()
    return
  }
  /* 本地未开会时，先判断远端是否已有人拉我入会 */
  if (await checkAndJoinActiveMeeting()) return
  userPickerMode.value = 'create'
  userPickerVisible.value = true
}

const handleUserPickerConfirm = async (selectedUsers) => {
  const userIds = selectedUsers.map((user) => String(user.userId)).filter(Boolean)
  if (userPickerMode.value === 'create') {
    userPickerVisible.value = false
    await startOrJoinConsultation({ participantIds: userIds })
    return
  }
  if (await inviteNewUsers(userIds)) userPickerVisible.value = false
}

const handleOpenInvitePicker = () => {
  userPickerMode.value = 'invite'
  userPickerVisible.value = true
}

const handleCloseOrLeaveMeeting = async () => {
  try {
    if (isMainer.value) {
      await ElMessageBox.confirm(
        '确定结束全员会商研判吗？结束后将自动关闭所有成员的应急会商室与视频会议。',
        '结束会议确认',
        { confirmButtonText: '确定结束', cancelButtonText: '取消', type: 'warning' },
      )
      await endCurrentMeeting()
      return
    }
    await ElMessageBox.confirm(
      '确定退出当前应急会商室吗？',
      '退出会商确认',
      { confirmButtonText: '确定退出', cancelButtonText: '取消', type: 'info' },
    )
    handleMeetingClosed()
  } catch {
    // 用户取消时保持当前会议状态
  }
}

onMounted(() => {
  /* 页面加载后自动加入已邀请我且进行中的会议 */
  checkAndJoinActiveMeeting()
})
</script>

<style lang="less" scoped>
/* 容器不生成盒子，浮动控件与弹层仍以地图容器为定位基准 */
.consultation-entry {
  display: contents;
}

/* 会商研判浮动图标：地图左下角，left 由 openLeft/collapsedLeft 控制并带位移动画 */
.meeting-floating-btn {
  position: absolute;
  bottom: 20px;
  z-index: 11;
  width: 80px;
  height: 84px;
  cursor: grab;
  touch-action: none;
  user-select: none;
  transition: left 0.28s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease, filter 0.2s ease;

  &:hover {
    filter: drop-shadow(0 6px 16px rgba(0, 123, 255, 0.46));
    transform: translateY(-2px) scale(1.05);
  }

  &:active {
    cursor: grabbing;
    transform: translateY(0) scale(0.96);
  }

  /* 拖动中：关闭过渡与悬浮位移，保证跟手不顿挫 */
  &.is-dragging {
    transition: none;
    transform: none;
    filter: none;
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
  }
}

/* 视频会议浮动图标：地图右下角 */
.video-calling-floating-btn {
  position: absolute;
  right: 24px;
  bottom: 24px;
  z-index: 1001;
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(0, 48, 120, 0.18);
  cursor: pointer;
  user-select: none;
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.28s ease;

  &:hover {
    box-shadow: 0 6px 20px rgba(0, 123, 255, 0.28);
    transform: scale(1.08);
  }

  &:active {
    transform: scale(0.96);
  }

  img {
    display: block;
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
}

/* 浮动图标显隐过渡 */
.consultation-float-enter-active,
.consultation-float-leave-active {
  transition: opacity 0.24s ease, transform 0.24s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.consultation-float-enter-from,
.consultation-float-leave-to {
  opacity: 0;
  transform: scale(0.66);
}
</style>
