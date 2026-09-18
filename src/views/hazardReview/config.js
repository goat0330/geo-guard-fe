/**
 * 隐患复核页面静态数据
 * 说明：后端接口（内网）暂不可访问，此处先以 Mock 数据驱动页面，
 *      接口就绪后只需把本文件导出的数据替换为 @/api 返回值即可。
 */

import iconRkyfhXzyhd from '@/assets/imgs/hazardReview/icon-rkyfh-xzyhd.webp'
import iconRkyfhYzyhd from '@/assets/imgs/hazardReview/icon-rkyfh-yzyhd.webp'
import iconRkyfhYrk from '@/assets/imgs/hazardReview/icon-rkyfh-yrk.webp'
import iconRkyfhYfh from '@/assets/imgs/hazardReview/icon-rkyfh-yfh.webp'
import iconZntclYcl from '@/assets/imgs/hazardReview/icon-zntcl-ycl.webp'
import iconZntclDcl from '@/assets/imgs/hazardReview/icon-zntcl-dcl.webp'
import iconZhlxHp from '@/assets/imgs/hazardReview/icon-zhlx-hp.webp'
import iconZhlxBt from '@/assets/imgs/hazardReview/icon-zhlx-bt.webp'
import iconFlfjjgBg1 from '@/assets/imgs/hazardReview/icon-flfjjg-bg1.webp'
import iconFlfjjgBg2 from '@/assets/imgs/hazardReview/icon-flfjjg-bg2.webp'
import iconFlfjjgBg3 from '@/assets/imgs/hazardReview/icon-flfjjg-bg3.webp'
import iconFlfjjgBg4 from '@/assets/imgs/hazardReview/icon-flfjjg-bg4.webp'
import iconFhbhWbh from '@/assets/imgs/hazardReview/icon-fhbh-wbh.webp'
import iconFhbhYbh from '@/assets/imgs/hazardReview/icon-fhbh-ybh.webp'


/** 统计日期 */
export const reviewDate = '2026-09-08'

/** 入库与复核 */
export const inventorySummary = [
  { key: 'new', label: '新增隐患点', value: 36, unit: '处', icon: iconRkyfhXzyhd },
  { key: 'known', label: '已知隐患点', value: 48, unit: '处', icon: iconRkyfhYzyhd },
  { key: 'stored', label: '已入库', value: 64, unit: '处', icon: iconRkyfhYrk },
  { key: 'reviewed', label: '已复核', value: 92, unit: '处', icon: iconRkyfhYfh },
]

/** 智能体处理 */
export const agentProcess = {
  processed: 216,
  pending: 24,
  rate: 90,
  processedIcon: iconZntclYcl,
  pendingIcon: iconZntclDcl,
}

/** 灾害类型 */
export const hazardTypes = [
  { key: 'landslide', label: '滑坡', value: 104, icon: iconZhlxHp, color: '#ff942c' },
  { key: 'collapse', label: '崩塌', value: 52, icon: iconZhlxBt, color: '#E45B5B' },
]

/** 分类分级结果 - 切换标签 */
export const gradeTabs = [
  { label: '规模等级', value: 'scale' },
  { label: '险情等级', value: 'danger' },
]

/** 分类分级结果 - 各标签下的分级列表 */
export const gradeListMap = {
  scale: [
    { key: 'small', label: '小型', value: 123, icon: iconFlfjjgBg1 },
    { key: 'medium', label: '中型', value: 8, icon: iconFlfjjgBg2 },
    { key: 'large', label: '大型', value: 7, icon: iconFlfjjgBg3 },
    { key: 'huge', label: '特大型', value: 6, icon: iconFlfjjgBg4 },
  ],
  danger: [
    { key: 'extreme', label: '极高风险', value: 96, icon: iconFlfjjgBg1 },
    { key: 'high', label: '高风险', value: 12, icon: iconFlfjjgBg2 },
    { key: 'medium', label: '中风险', value: 5, icon: iconFlfjjgBg3 },
    { key: 'low', label: '低风险', value: 3, icon: iconFlfjjgBg4 },
  ],
}

/** 智能体对比 */
export const agentCompare = {
  changed: 28,
  changedIcon: iconFhbhYbh,
  unchanged: 64,
  unchangedIcon: iconFhbhWbh,
}

/** 地图点位弹窗详情（默认展示的隐患点） */
export const hazardDetail = {
  name: '郁山镇米阳坝村3组滑坡',
  address: '重庆市彭水苗族土家族自治县郁山镇',
  level: '中风险',
  threatPeople: '18人',
  threatProperty: '500万元',
  stabilityNow: '不稳定',
  stabilityForecast: '不稳定',
  code: 'CQ-PS-2026-0137',
  disasterTime: '2026-07-19 14:20',
}

/** 隐患处理列表 - 状态标签配色（小圆点 + 文字） */
export const processStatusMap = {
  待复核: { color: '#FF922C', background: '#FFF4E8' },
  待入库: { color: '#FF922C', background: '#FFF4E8' },
  已复核: { color: '#21A366', background: '#E8F8EF' },
  已入库: { color: '#21A366', background: '#E8F8EF' },
}

/** 隐患处理列表 - 筛选选项 */
export const processFilterOptions = {
  hazardTypes: ['滑坡', '崩塌', '泥石流', '地面塌陷'],
  statuses: ['待复核', '已复核', '待入库', '已入库'],
}

/** 隐患处理列表 - 每页条数 */
export const processPageSize = 4

/** 隐患处理列表（Mock，接口就绪后替换为 @/api 返回值） */
export const processList = [
  {
    id: 'hd-001',
    name: '马岩危岩',
    status: '待复核',
    location: '重庆市-彭水县-柳村-土地堂组',
    hazardType: '崩塌',
    date: '2026-09-08',
    result: { label: '变化', text: '规模、威胁财产', tone: 'warning' },
  },
  {
    id: 'hd-002',
    name: '新增调查点A',
    status: '待入库',
    location: '重庆市-彭水县-柳村-土地堂组',
    hazardType: '崩塌',
    date: '2026-09-08',
    result: { label: '处理结果', text: '待补充位置', tone: 'info' },
  },
  {
    id: 'hd-003',
    name: '马鞍溪滑坡',
    status: '已复核',
    location: '重庆市-彭水县-柳村-土地堂组',
    hazardType: '崩塌',
    date: '2026-09-07',
    result: { label: '处理结果', text: '复核无变化', tone: 'info' },
  },
  {
    id: 'hd-004',
    name: '调查点B',
    status: '待复核',
    location: '重庆市-彭水县-柳村-土地堂组',
    hazardType: '崩塌',
    date: '2026-09-07',
    result: { label: '变化', text: '分类分级建议', tone: 'warning' },
  },
  {
    id: 'hd-005',
    name: '调查点C',
    status: '已入库',
    location: '重庆市-彭水县-柳村-土地堂组',
    hazardType: '崩塌',
    date: '2026-09-06',
    result: { label: '处理结果', text: '已更新台账', tone: 'info' },
  },
  {
    id: 'hd-006',
    name: '新增调查点A',
    status: '待入库',
    location: '重庆市-彭水县-柳村-土地堂组',
    hazardType: '崩塌',
    date: '2026-09-06',
    result: null,
  },
]

/** 智能体处理面板 - 地点与资料来源摘要（Mock，接口就绪后替换为 @/api 返回值） */
export const agentProcessBrief = {
  relation: '已有复核点 · 联合乡-回联村-5组',
  materials: '调查表1份 · 现场图片未提供',
  summary: '已整理调查资料并比对比历史台账，分类分级结果待正式标准校验。',
  /** 底部状态提示：text 常规文案，highlight 用主色强调 */
  footer: {
    text: '当前未更新台账，',
    highlight: '待人工确认。',
  },
}

/** 智能体处理面板 - 分类分级结果表（Mock） */
export const agentClassifyTable = {
  columns: ['分类项', '当前结果', '依据'],
  rows: [
    ['灾害类型', '崩塌', '现场调查'],
    ['稳定性', '差', '现场调查'],
    ['规模等级', '特大型', '原台账'],
    ['险情等级', '大型', '原台账'],
    ['防治等级', '一级', '原台账'],
  ],
}

/** 智能体处理面板 - 威胁指标（Mock，底板依次对应 icon-flfjjg-bg1~4） */
export const agentThreatMetrics = [
  { label: '威胁总人数', value: '907', unit: '人' },
  { label: '威胁总资产', value: '6369', unit: '万元' },
  { label: '面积', value: '0.5', unit: '万m²' },
  { label: '体积', value: '2652', unit: '万m³' },
]

/** 智能体处理面板 - 处理步骤（Mock） */
export const agentProcessSteps = [
  {
    key: 'materials',
    title: '已读资料并对比台账',
    points: ['已关联历史台账，发现规模、威胁财产变化；无图片时依据调查表继续处理'],
  },
  {
    key: 'classify',
    title: '已提取分类结果',
    subtitle: '当前分类结果：',
    classify: agentClassifyTable,
    metrics: agentThreatMetrics,
  },
  {
    key: 'standard',
    title: '分类分级依据待接入',
    points: ['百日攻坚分类标准待印发，接入后逐项匹配条款，完成分级校验。'],
  },
  {
    key: 'draft',
    title: '已生成复核建议草稿',
    draftNote: '已整理崩塌类隐患信息，建议核实现规模与威胁财产变化，完成标准校验后提交人工确认。',
  },
]
