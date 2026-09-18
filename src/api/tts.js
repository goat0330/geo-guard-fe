import http from '@/utils/http.js'

const TTS_STREAM_URL = '/tts/api/tts/stream'

/**
 * 请求一段文本对应的 WAV 音频数据。
 * @param {object} options - 语音合成参数。
 * @param {string} options.text - 需要合成的文本。
 * @param {string|null} [options.voiceId='woman'] - 音色 ID。
 * @param {number} [options.chunkSize=100] - 服务端文本分块大小。
 * @param {AbortSignal} [options.signal] - 请求取消信号。
 * @returns {Promise<ArrayBuffer>} 完整的 WAV 音频数据。
 */
export async function synthesizeTts({ text, voiceId = 'boy', chunkSize = 100, signal } = {}) {
  const audioData = await http.post(
    TTS_STREAM_URL,
    {
      text,
      voice_id: voiceId,
      chunk_size: chunkSize,
    },
    {
      // http 实例默认前缀为 /api，TTS 使用独立的同源代理路径。
      baseURL: '/',
      responseType: 'arraybuffer',
      noCheckCode: true,
      throwRes: true,
      notUseError: true,
      signal,
    },
  )

  // http 的 throwRes 模式会将请求异常作为返回值交给调用方。
  if (audioData instanceof Error) {
    throw audioData
  }
  if (!(audioData instanceof ArrayBuffer) || !audioData.byteLength) {
    throw new Error('TTS 返回的音频数据为空或格式不正确')
  }

  return audioData
}
