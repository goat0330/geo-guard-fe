import deviceTotalIcon from '@/assets/imgs/monitor/icon-device-total.webp'
import onlineRateIcon from '@/assets/imgs/monitor/icon-online-rate.webp'
import alarmRedIcon from '@/assets/imgs/monitor/icon-alarm-red.webp'
import alarmOrangeIcon from '@/assets/imgs/monitor/icon-alarm-orange.webp'
import alarmYellowIcon from '@/assets/imgs/monitor/icon-alarm-yellow.webp'
import statusPendingIcon from '@/assets/imgs/monitor/icon-status-pending.webp'
import statusProcessingIcon from '@/assets/imgs/monitor/icon-status-processing.webp'
import statusClosedIcon from '@/assets/imgs/monitor/icon-status-closed.webp'

/** 统计日期（Mock，接口就绪后替换为 @/api 返回值） */
export const monitorDate = '2026-09-15'

/** 设备概况（Mock） */
export const deviceOverview = [
  { key: 'total', label: '设备总数', value: 334, unit: '', icon: deviceTotalIcon },
  { key: 'rate', label: '设备在线率', value: '97.6', unit: '%', icon: onlineRateIcon },
]

/** 设备概况底部 - 在线 / 离线数（Mock） */
export const deviceStatuses = [
  { key: 'online', label: '在线数', value: 326, tone: 'online' },
  { key: 'offline', label: '离线数', value: 8, tone: 'offline' },
]

/** 仪器告警情况（Mock） */
export const alarmSituation = {
  total: 22,
  totalIcon: deviceTotalIcon,
  levels: [
    { key: 'red', label: '红色', value: 3, icon: alarmRedIcon, color: '#e45b5b', borderColor: '#f3c9c9' },
    { key: 'orange', label: '橙色', value: 7, icon: alarmOrangeIcon, color: '#ff922c', borderColor: '#f7d9b8' },
    { key: 'yellow', label: '黄色', value: 12, icon: alarmYellowIcon, color: '#f0b429', borderColor: '#f4e3a6' },
  ],
}

/** 处置状态（Mock） */
export const disposeStatus = [
  { key: 'pending', label: '待处置', value: 3, icon: statusPendingIcon },
  { key: 'processing', label: '处置中', value: 2, icon: statusProcessingIcon },
  { key: 'closed', label: '已关闭', value: 17, icon: statusClosedIcon },
]

/** 设备类型（Mock） */
export const deviceTypes = [
  { key: 'gnss', label: 'GNSS', value: 96 },
  { key: 'crack', label: '裂缝计', value: 84 },
  { key: 'rain', label: '雨量计', value: 78 },
  { key: 'tilt', label: '倾斜计', value: 52 },
  { key: 'other', label: '其他', value: 24 },
]

/** 监测预警智能体 - 面板数据（Mock，接口就绪后替换为 @/api 返回值） */
export const warningAgentDetail = {
  name: '土地堂组斜坡',
  level: '红色预警',
  deviceName: '土地堂组斜坡_GNSS02',
  period: '09-07 10:00-09-08 10:00',
  summary: '已读取该设备近24小时监测数据，结合曲线变化与已有处置记录整理监测数据档案。',
  /** steps 中的 points 为说明文字数组，每项一行 */
  steps: [
    {
      key: 'data',
      title: '已读取监测数据与预警记录',
      points: [
        '已读取该设备近24小时监测数据与监测详情',
        '监测详情包含设备信息、预警记录与处置记录',
      ],
    },
    {
      key: 'curve',
      title: '已完成监测曲线描述',
      subtitle: '累计位移变化：',
      chart: true,
      points: [
        '曲线整体波动较小，末段出现一次短时升高，随后回落至此前水平；当前时段未见连续上升趋势。',
      ],
    },
    {
      key: 'summary',
      title: '已生成分析摘要',
      tip: '本阶段以平稳波动为主，存在单次累计位移，建议结合后现场记录与设备情况进一步核查。',
    },
  ],
  /** 累计位移曲线（近24小时，每 2 小时一个点） */
  chart: {
    times: ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '00:00', '02:00', '04:00', '06:00', '08:00', '10:00'],
    values: [3.5, 3.6, 4.8, 10.8, 11.4, 11.2, 10.3, 9.4, 8.2, 7.4, 7.6, 7.8, 11.5],
  },
  footer: {
    /** 已有处置记录：label 深色，value 用主色 */
    record: {
      label: '已有处置记录：',
      value: '数据异常导致误报。',
    },
    note: '以上为监测数据描述，预警有效性以人工核查结果为准。',
  },
}

/** 专业监测预警列表 - 等级配色 */
export const alarmLevelMap = {
  红色预警: { color: '#DD4739', background: '#FED8D8' },
  橙色预警: { color: '#FF922C', background: '#FEE6D8' },
  黄色预警: { color: '#FFB84E', background: '#FEEFD8' },
  无预警: { color: '#007bff', background: '#eaf2fe' },
}

/** 专业监测预警列表 - 筛选选项 */
export const alarmFilterOptions = {
  regions: ['彭水县', '武隆区', '丰都县'],
  levels: ['红色预警', '橙色预警', '黄色预警', '无预警'],
  validities: ['是', '否'],
}

/** 专业监测预警列表（Mock，接口就绪后替换为 @/api 返回值） */
export const alarmList = [
  {
    id: 'al-001',
    name: '土地堂组斜坡',
    level: '红色预警',
    detail: {
      address: '彭水县 郁山镇',
      disposeType: '数据异常导致误报',
      deviceName: '土地堂组斜坡_GNSS02',
      disposeUser: '胡艺',
      publishTime: '2026-09-07 09:18',
      disposeTime: '2026-09-06 15:03',
      validWarning: '无效',
    },
  },
  { id: 'al-002', name: '郁山镇楠木碉寨碉组滑坡', level: '黄色预警' },
  { id: 'al-003', name: '商家岭滑坡', level: '无预警' },
  { id: 'al-004', name: '琼池村下村组谭树明屋滑坡', level: '红色预警' },
  { id: 'al-005', name: '土地堂组滑坡', level: '红色预警' },
  { id: 'al-006', name: '柳家湾滑坡', level: '橙色预警' },
  { id: 'al-007', name: '土地堂组滑坡', level: '红色预警' },
  { id: 'al-008', name: '郁山镇楠木碉寨碉组滑坡', level: '黄色预警' },
  { id: 'al-009', name: '商家岭滑坡', level: '无预警' },
  { id: 'al-010', name: '琼池村下村组谭树明屋滑坡', level: '红色预警' },
]

/** 监测点详情（Mock，接口就绪后替换为 @/api 返回值） */
export const monitorPointDetail = {
  name: '果园崩塌',
  code: 'GP/QJ/502',
  displacement: [
    { key: 'd1', label: '近1天位移', value: '0.36', unit: 'mm' },
    { key: 'd3', label: '近3天位移', value: '1.23', unit: 'mm' },
    { key: 'd7', label: '近7天位移', value: '-0.07', unit: 'mm' },
  ],
  rainfall: [
    { key: 'h1', label: '近1小时降雨', caption: '雨量：', value: '12', unit: 'mm' },
    { key: 'h24', label: '近24小时降雨', caption: '雨量：', value: '12.1', unit: 'mm' },
    { key: 'd7', label: '近7天降雨', caption: '雨量：', value: '38.7', unit: 'mm' },
  ],
  /** span: 2 表示该行独占整行 */
  info: [
    { label: '地理位置：', value: '重庆市彭水县汉葭街道', span: 2 },
    { label: '监测单位', value: '无', span: 2 },
    { label: '灾害类型：', value: '滑坡' },
    { label: '预警状态：', value: '无' },
  ],
  deviceStatus: [
    { key: 'online', label: '在线', tone: 'online' },
    { key: 'offline', label: '离线', tone: 'offline' },
  ],
}
