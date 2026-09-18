<template>
  <div class="upload-file-loader">
    <template v-if="file.type === 'image'">
      <el-image v-if="imageUrl" class="preview-img" :src="imageUrl" :preview-src-list="[imageUrl]" fit="cover" />
      <div v-else class="img-placeholder" v-loading="true"></div>
    </template>
    <template v-else-if="file.type === 'document'">
      <div class="document-preview">
        <img src="@/assets/imgs/chatEngine/file-uploaded.png" class="upload-file-icon" />

        <div class="upload-file-info">
          <div class="upload-file-name" :title="file.name || '文档'">{{ file.name || '未命名' }}</div>
          <div class="upload-file-status">{{ getUploadStatusText(file) }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { getImageUrlById } from '@/api/common.js'

const props = defineProps({
  file: {
    type: Object,
    default: () => ({}),
  },
})

const imageUrl = ref('')

const fetchImageUrl = async () => {
  if (props.file && props.file.type === 'image' && props.file.uploadFileId) {
    try {
      const res = await getImageUrlById({ ids: [props.file.uploadFileId] })
      if (res && res.length > 0 && res[0]) {
        try {
          const urlObj = new URL(res[0])
          imageUrl.value = '/oss-service' + urlObj.pathname + urlObj.search
        } catch (e) {
          imageUrl.value = res[0]
        }
      }
    } catch (error) {
      console.error('获取图片地址失败:', error)
    }
  }
}

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

function getUploadStatusText(file) {
  console.log('file in getUploadStatusText:', file)
  const extension = file.name?.split('.').pop()?.toLowerCase() || ''
  return `${extension} · ${formatFileSize(file.size)}`
}

onMounted(() => {
  fetchImageUrl()
})

watch(
  () => props.file,
  () => {
    fetchImageUrl()
  },
  { deep: true },
)
</script>

<style lang="less" scoped>
.upload-file-loader {
  .preview-img {
    width: 80px;
    height: 80px;
    border-radius: 10px;
    border: 1px solid #d4d8dd;
    cursor: pointer;
    display: block;
  }

  .img-placeholder {
    width: 120px;
    height: 120px;
    border-radius: 10px;
    // border: 1px solid #d4d8dd;
    background: #f6f8fc;
  }

  .document-preview {
    display: flex;
    align-items: center;
    padding: 10px 12px;
    background: #f5f5f5;
    border-radius: 10px;
    column-gap: 10px;
    width: 220px;
    height: 54px;

    .upload-file-icon {
      color: #3561fa;
      flex-shrink: 0;
      width: 26px;
      height: 26px;
    }

    .upload-file-info {
      min-width: 0;
      flex: 1;
    }

    .upload-file-name {
      color: #222529;
      font-size: 14px;
      line-height: 20px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .upload-file-status {
      font-size: 14px;
      color: #8a93a6;
    }
  }
}
</style>
