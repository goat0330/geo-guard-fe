import { Components, splitTip } from '@/components/ChatBox/config.js'
import { editChatMsg } from '@/api/chat.js'
import { isJsonString, safeFixJsonString } from '@/utils/index.js'

// 添加消息
export const addChatMsg = (text, { type = 1, delay = 0, flowId = '' } = {}) => {
  const chat = window.__chatBox__
  if (!chat) {
    return
  }
  chat.pushMessage(
    {
      comp: Components.BUBBLE,
      props: {
        type,
        message: {
          content: text,
        },
      },
    },
    delay,
    { flowId },
  )
}

// 修改历史信息
export const updateHistoryMsg = async (data = {}, obj = {}) => {
  const { messageId } = data
  if (messageId) {
    // 修改历史记录
    await editChatMsg({
      id: messageId,
      messageMetadata: obj,
    })
  }
}

// 获取历史额外信息
export const getHistoryExtra = (data) => {
  const historyData = data?.historyData
  return historyData?.messageMetadata
}

// 剔除flowId为xx的
export const removeFlowId = (flowId) => {
  if (window.__chatBox__?.messageList?.value?.length) {
    window.__chatBox__.messageList.value = window.__chatBox__.messageList.value.filter((item) => item.flowId != flowId)
  }
}

const appendThinkContent = (message, content, md) => {
  if (!content) return
  message.originalThink = (message.originalThink || '') + content
  message.think = md ? md.render(message.originalThink) : message.originalThink
}

export const parseThinkStreamChunk = (message, data = '', md) => {
  const startTag = '<think>'
  const endTag = '</think>'
  let rest = data || ''
  let content = ''

  while (rest) {
    if (message.thinking) {
      const endIndex = rest.indexOf(endTag)
      if (endIndex === -1) {
        appendThinkContent(message, rest, md)
        break
      }

      appendThinkContent(message, rest.slice(0, endIndex), md)
      message.thinking = false
      rest = rest.slice(endIndex + endTag.length)
      continue
    }

    const startIndex = rest.indexOf(startTag)
    if (startIndex === -1) {
      content += rest
      break
    }

    content += rest.slice(0, startIndex)
    message.thinking = true
    rest = rest.slice(startIndex + startTag.length)
  }

  return content
}

export const normalizeRecommendQuestions = (value) => {
  if (!Array.isArray(value)) return []
  return value.filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim())
}

export const decodeJsonStringContent = (content = '') => {
  try {
    return JSON.parse(`"${content}"`)
  } catch (error) {
    return content.replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\')
  }
}

export const parseLooseRecommendQuestions = (content = '') => {
  const questions = []
  const questionReg = /(['"])((?:\\.|(?!\1).)*)\1/g
  let match

  while ((match = questionReg.exec(content))) {
    const question = decodeJsonStringContent(match[2]).trim()
    if (question) {
      questions.push(question)
    }
  }

  return questions
}

export const parseRecommendQuestionJson = (content = '') => {
  try {
    return normalizeRecommendQuestions(JSON.parse(content))
  } catch (error) {
    return parseLooseRecommendQuestions(content)
  }
}

export const getTrailingTagPrefixLength = (content = '', tag = '') => {
  const maxLength = Math.min(content.length, tag.length - 1)
  for (let length = maxLength; length > 0; length--) {
    if (content.endsWith(tag.slice(0, length))) {
      return length
    }
  }
  return 0
}

export const parseRecommendQuestions = (content = '') => {
  const startTag = '<推荐问题>'
  const endTag = '</推荐问题>'
  let rest = content || ''
  let displayContent = ''
  let refQ = []

  while (rest) {
    const startIndex = rest.indexOf(startTag)
    if (startIndex === -1) {
      const pendingTagLength = getTrailingTagPrefixLength(rest, startTag)
      displayContent += pendingTagLength ? rest.slice(0, -pendingTagLength) : rest
      break
    }

    displayContent += rest.slice(0, startIndex)
    const recommendStart = startIndex + startTag.length
    const endIndex = rest.indexOf(endTag, recommendStart)

    if (endIndex === -1) {
      break
    }

    const nextRefQ = parseRecommendQuestionJson(rest.slice(recommendStart, endIndex).trim())
    if (nextRefQ.length) {
      refQ = nextRefQ
    }
    rest = rest.slice(endIndex + endTag.length)
  }

  return {
    content: displayContent,
    refQ,
  }
}

/**
 * 解析一条完整或累计中的回答文本，统一提取正文、推荐问题、图表和业务数据。
 * @param {string} content - 当前累计的原始回答文本。
 * @returns {{content: string, refQ: string[], hasChartTask: boolean, chartDataStr: string, isOperateJson: boolean, pureJson: object|null}} 标准化后的回答数据。
 */
export const parseAnswerPayload = (content = '') => {
  // 推荐问题与可展示正文。
  const recommendParsed = parseRecommendQuestions(content)
  let answerContent = recommendParsed.content
  const protocolTags = ['(@json)', '(@report)', '(@apptype)']
  const pendingProtocolLength = Math.max(...protocolTags.map((tag) => getTrailingTagPrefixLength(answerContent, tag)))
  if (pendingProtocolLength) {
    answerContent = answerContent.slice(0, -pendingProtocolLength)
  }
  const jsonSplitter = '(@json)'
  const jsonIndex = answerContent.indexOf(jsonSplitter)

  if (jsonIndex > -1) {
    return {
      content: answerContent.slice(0, jsonIndex),
      refQ: recommendParsed.refQ,
      hasChartTask: true,
      chartDataStr: answerContent.slice(jsonIndex + jsonSplitter.length),
      isOperateJson: false,
      pureJson: null,
    }
  }

  const reportSplitter = '(@report)'
  if (answerContent.startsWith(reportSplitter)) {
    return {
      content: '',
      refQ: recommendParsed.refQ,
      hasChartTask: false,
      chartDataStr: '',
      isOperateJson: true,
      pureJson: {
        type: 'report',
        data: answerContent.slice(reportSplitter.length),
      },
    }
  }

  if (answerContent.startsWith('(@apptype)') || answerContent.startsWith('{')) {
    return {
      content: '',
      refQ: recommendParsed.refQ,
      hasChartTask: false,
      chartDataStr: '',
      isOperateJson: true,
      pureJson: null,
    }
  }

  return {
    content: answerContent,
    refQ: recommendParsed.refQ,
    hasChartTask: false,
    chartDataStr: '',
    isOperateJson: false,
    pureJson: null,
  }
}

/**
 * 解析工作流返回的业务 JSON，并兼容数组包装及附加说明文本。
 * @param {string} content - 工作流最终返回的回答文本。
 * @returns {object} 可直接交给业务调度器处理的数据对象。
 */
export const parseBusinessAnswer = (content = '') => {
  // 业务主体和附加说明分段。
  const splits = content?.split(splitTip) || []
  const jsonString = safeFixJsonString(splits[0]?.replace(/\s+/g, '') || '')
  let businessData = {}

  if (isJsonString(jsonString)) {
    businessData = JSON.parse(jsonString)
  }
  if (Array.isArray(businessData)) {
    businessData = businessData[0] || {}
  }
  if (splits.length > 1) {
    businessData.followText = splits[1]?.slice(1, -1)
  }

  return businessData
}
