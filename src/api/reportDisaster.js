// 查询任务派发清单列表
import http from '@/utils/http.js'

// 查询信息报送列表
export function taskDistList(params) {
  return http.get('/dizai/reportDisaster/list', params, {
    throwRes: true,
  })
}

// 处理当前报灾
export function handleDisReport(id) {
  return http.post(`/dizai/reportDisaster/handle/${id}`)
}

// 关闭上报
export function closeDisReport(id) {
  return http.delete(`/dizai/reportDisaster/closeReport/${id}`)
}

// 统计当前报灾
export function getDisStatData(params) {
  return http.post('/dizai/reportDisaster/stat', params)
}

// 获取当前所有正在处理的报灾
export function getDealingDisaster(params) {
  return http.get('/dizai/reportDisaster/getAllHandling', params)
}

// 获取信息报送详细信息
export function getDisReportDetail(id) {
  return http.get(`/dizai/reportDisaster/${id}`)
}

// 添加报灾人工反馈
export function addDisReportFeedback(params) {
  return http.post('/dizai/reportDisaster/feedback', params)
}
