<template>
  <section class="meeting-page">
    <AgentPageHeader title="会议纪要" description="语音转文字 · 实时记录 · 智能总结" />
    <div class="meeting-content">
      <div class="meeting-intro">
        <div><h2>会议记录设置</h2><p>完成设置后进入平台现有问答页，使用语音输入进行记录。</p></div>
        <img src="@/assets/imgs/agents/meeting.png" alt="会议纪要" />
      </div>
      <div class="setting-panel">
        <div class="setting-row">
          <span>音频语言</span>
          <el-radio-group v-model="formData.language">
            <el-radio-button value="中文">中文</el-radio-button>
            <el-radio-button value="英文">英文</el-radio-button>
            <el-radio-button value="中英自由对话">中英自由对话</el-radio-button>
          </el-radio-group>
        </div>
        <div class="setting-row">
          <span>翻译</span>
          <el-select v-model="formData.translation">
            <el-option label="不翻译" value="不翻译" />
            <el-option label="翻译" value="翻译" />
          </el-select>
        </div>
        <div class="setting-row">
          <span>区分发言人</span>
          <el-segmented v-model="formData.speaker" :options="speakerOptions" />
        </div>
        <el-button class="record-button" type="primary" round :icon="Microphone" @click="startMeeting">开始录音</el-button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Microphone } from '@element-plus/icons-vue'
import AgentPageHeader from '@/components/AgentPageHeader/index.vue'

defineOptions({ name: 'AgentMeetingPage' })

const router = useRouter()
const formData = reactive({ language: '中文', translation: '不翻译', speaker: true })
const speakerOptions = [{ label: '智能区分', value: true }, { label: '暂不区分', value: false }]

function startMeeting() {
  router.push({ path: '/chat-engine/chatting', query: { source: 'meeting', _refresh: Date.now() } })
}
</script>

<style lang="less" scoped>
.meeting-page { flex: 1; min-height: 0; display: flex; flex-direction: column; background: #f7faff; }
.meeting-content { width: min(680px, calc(100% - 32px)); margin: auto; padding: 36px 0 64px; }
.meeting-intro { min-height: 140px; padding: 0 20px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.meeting-intro h2 { margin: 0 0 8px; color: #222527; font-size: 24px; line-height: 32px; }
.meeting-intro p { max-width: 400px; margin: 0; color: #617185; font-size: 14px; line-height: 22px; }
.meeting-intro img { width: 144px; height: 136px; object-fit: contain; }
.setting-panel { padding: 36px 40px; border-radius: 8px; background: #ffffff; box-shadow: 0 8px 28px rgba(0, 64, 140, 0.08); }
.setting-row { min-height: 48px; display: grid; grid-template-columns: 100px minmax(0, 1fr); align-items: center; gap: 20px; }
.setting-row > span { color: #222527; font-size: 14px; }
.setting-row :deep(.el-select) { width: 100%; }
.record-button { min-width: 148px; margin: 32px auto 0; display: flex; }
@media (max-width: 620px) {
  .meeting-intro { padding: 0; }
  .meeting-intro img { width: 104px; height: 104px; }
  .setting-panel { padding: 24px 16px; }
  .setting-row { margin-bottom: 16px; grid-template-columns: 1fr; gap: 8px; }
  .setting-row :deep(.el-radio-group) { display: grid; grid-template-columns: 1fr; }
  .setting-row :deep(.el-radio-button__inner) { width: 100%; }
}
</style>
