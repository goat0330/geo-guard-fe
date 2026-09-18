import http from '@/utils/http.js'

/**
 * 创建会议
 * @param {object} data
 * @param {string} data.title 会议主题（必填非空白，最大100字符）
 * @param {string|null} [data.description] 会议说明（可不传/null，最大2000字符）
 * @param {string[]} [data.participantIds] 初始受邀系统用户 ID 数组（字符串）
 * @returns {Promise<{ meeting: object, participants: object[] }>}
 */
export const createMeeting = (data) => {
  return http.post('/meeting/meetings', data)
}

/**
 * 获取当前用户的会议列表（分页）
 * @param {object} params
 * @param {number} [params.pageNum=1] 页码（从1开始）
 * @param {number} [params.pageSize=20] 每页条数（显式传参）
 * @returns {Promise<{ total: number, data: object[], code: number, msg: string }>}
 */
export const getMeetingList = (params = {}) => {
  const { pageNum = 1, pageSize = 20, ...rest } = params
  return http.get(
    '/meeting/meetings',
    { pageNum, pageSize, ...rest },
    { throwRes: true },
  )
}

/**
 * 获取会议详情与成员列表
 * @param {string} meetingId 会议 ID（字符串）
 * @returns {Promise<{ meeting: object, participants: object[] }>}
 */
export const getMeetingDetail = (meetingId) => {
  return http.get(`/meeting/meetings/${String(meetingId)}`)
}

/**
 * 更新会议展示内容（仅主持人可调用）
 * @param {string} meetingId 会议 ID（字符串）
 * @param {object} data
 * @param {string} data.title 完整会议主题（必填）
 * @param {string|null} [data.description] 新说明（省略或传 null 清空原说明）
 * @returns {Promise<{ meeting: object, participants: object[] }>}
 */
export const updateMeeting = (meetingId, data) => {
  return http.put(`/meeting/meetings/${String(meetingId)}`, data)
}

/**
 * 删除已结束会议（仅主持人且必须为 ENDED 状态）
 * @param {string} meetingId 会议 ID（字符串）
 */
export const deleteMeeting = (meetingId) => {
  return http.delete(`/meeting/meetings/${String(meetingId)}`)
}

/**
 * 获取 LiveKit 入会短期凭证
 * @param {string} meetingId 会议 ID（字符串）
 * @returns {Promise<{ token: string, url: string, roomName: string, expiresAt: string }>}
 */
export const getMeetingToken = (meetingId) => {
  return http.post(`/meeting/meetings/${String(meetingId)}/token`)
}

/**
 * 邀请成员（仅主持人可调用）
 * @param {string} meetingId 会议 ID（字符串）
 * @param {string[]} userIds 待邀请用户 ID 数组（字符串、去重且非空）
 */
export const addMeetingParticipants = (meetingId, userIds) => {
  const cleanIds = Array.from(new Set((userIds || []).map(String).filter(Boolean)))
  if (!cleanIds.length) {
    return Promise.reject(new Error('待邀请用户 ID 数组不能为空'))
  }
  return http.post(`/meeting/meetings/${String(meetingId)}/participants`, {
    userIds: cleanIds,
  })
}

/**
 * 移除成员（仅主持人可调用，不能移除主持人）
 * @param {string} meetingId 会议 ID（字符串）
 * @param {string} userId 被移除系统用户 ID（字符串）
 */
export const removeMeetingParticipant = (meetingId, userId) => {
  return http.delete(`/meeting/meetings/${String(meetingId)}/participants/${String(userId)}`)
}

/**
 * 结束会议（仅主持人可调用）
 * @param {string} meetingId 会议 ID（字符串）
 * @returns {Promise<{ meeting: object, participants: object[] }>}
 */
export const endMeeting = (meetingId) => {
  return http.post(`/meeting/meetings/${String(meetingId)}/end`)
}

/**
 * 获取可邀请系统用户目录（分页）
 * @param {object} params
 * @param {string} [params.keyword] 搜索关键词（匹配账号名或昵称）
 * @param {number} [params.pageNum=1] 页码（从1开始）
 * @param {number} [params.pageSize=20] 每页条数
 * @returns {Promise<{ total: number, data: object[], code: number, msg: string }>}
 */
export const getMeetingUsers = (params = {}) => {
  const { pageNum = 1, pageSize = 20, keyword, ...rest } = params
  return http.get(
    '/meeting/users',
    { pageNum, pageSize, keyword, ...rest },
    { throwRes: true },
  )
}
