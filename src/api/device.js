import http from '@/utils/http.js'

// 获取三方监测设备分页列表
export const getDeviceListPage = (params) => {
  return http.get('/dizai/warningData/getMonitorWarningDisposal', params, {
    throwRes: true,
  })
}

export const getDeviceList = (params) => {
  return http.get('/dizai/warningData/getMonitorWarningDisposal', params)
}

// 获取三方监测设备树
export const getDeviceTree = (params) => {
  return http.get('/dizai/warningData/getMonitorDeviceTree', params)
}

// 全量监测设备，附加最近预警等级与三方设备状态
export const getAreaAllDevice = (params) => {
  return http.get('/dizai/warningData/listAllMonitorDevicesRuntime', params)
}

// 根据设备ID获取雨量与位移统计
export const getDeviceDataDetail = (id) => {
  return http.get(`/dizai/warningData/getDeviceRainfallAndDisplacement?deviceId=${id}`)
}

// 查看检测设备曲线
export const getDeivceStatData = (params) => {
  return http.post('/dizai/warningData/queryDeviceCure', params)
}

// 获取设备树
// export const getDeviceTreeInfo

// 根据监测点名称获取检测设备信息
export const getDeviceByMonitorNames = (params) => {
  return http.post('/dizai/monitorPoint/queryByMonitorNames', params)
}
