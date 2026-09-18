import assistantImg from '@/assets/imgs/agents/assistant.png'
import dispatcherImg from '@/assets/imgs/agents/distritor.png'
import lawImg from '@/assets/imgs/agents/law.png'
import translatorImg from '@/assets/imgs/agents/translator.png'
import writerImg from '@/assets/imgs/agents/writter.png'

export const AGENT_CATEGORIES = [
  { label: '全部分类', value: 'all' },
  { label: '业务助手', value: 'business' },
  { label: '文档制作', value: 'document' },
  { label: '日常办公', value: 'office' },
  { label: '实用工具', value: 'utility' },
  { label: '其他', value: 'other' },
]

export const AGENT_PROFILES = {
  dispatcher: {
    title: '调度助手',
    description: '帮助您规划任务分配、协调人员安排并跟进工作进度。',
    image: dispatcherImg,
    questions: ['如何合理安排今天的巡查任务？', '多部门联合处置时如何分工？', '帮我整理一份任务跟进清单'],
  },
  government: {
    title: '政务助手',
    description: '提供政务办理指南、材料梳理、流程说明与时限提醒。',
    image: writerImg,
    questions: ['地质灾害隐患点认定需要哪些材料？', '群测群防员工作流程是什么？', '帮我梳理地灾项目申报流程'],
  },
  law: {
    title: '法规助手',
    description: '查询法律法规条文、解读政策要求并梳理合规要点。',
    image: lawImg,
    questions: ['地质灾害防治条例有哪些核心要求？', '隐患排查责任如何划分？', '应急避险转移有哪些法规依据？'],
  },
  newcomer: {
    title: '新人助手',
    description: '快速了解岗位职责、业务流程、平台操作与常见问题。',
    image: assistantImg,
    questions: ['日常巡查需要重点关注什么？', '如何上报新的地质灾害隐患？', '预警信息发布后需要做哪些工作？'],
  },
  statistic: {
    title: '地灾统计',
    description: '汇总地质灾害业务数据，辅助生成日报、周报和月报。',
    image: assistantImg,
    questions: ['帮我生成地质灾害统计日报', '帮我生成地质灾害统计周报', '帮我生成地质灾害统计月报'],
  },
}

export const AGENT_TOOLS = [
  { title: '调度助手', description: '工作调度有序推进', category: 'business', tag: 'HOT', image: dispatcherImg, route: '/agents/assistant?type=dispatcher', hot: '1200+' },
  { title: '政务助手', description: '政务问题快速解答', category: 'business', tag: 'HOT', image: writerImg, route: '/agents/assistant?type=government', hot: '1200+' },
  { title: '法规助手', description: '法规政策清晰解读', category: 'business', tag: 'HOT', image: lawImg, route: '/agents/assistant?type=law', hot: '1200+' },
  { title: '新人助手', description: '工作手册随时问', category: 'business', tag: 'HOT', image: assistantImg, route: '/agents/assistant?type=newcomer', hot: '1200+' },
  { title: '公文撰写', description: '专业规范生成公文', category: 'document', tag: 'NEW', icon: 'Document', color: '#007BFF', background: '#DCEDFF', route: '/agents/writing', hot: '1200+' },
  { title: '地灾统计', description: '快速生成业务统计', category: 'document', tag: 'NEW', icon: 'DataAnalysis', color: '#007BFF', background: '#DCEDFF', route: '/agents/assistant?type=statistic', hot: '1200+' },
  { title: '写作大纲', description: '创建清晰的写作结构', category: 'document', icon: 'Tickets', color: '#E35D6A', background: '#FFF0F0', prompt: '请帮我创建一份结构清晰的写作大纲。', hot: '1200+' },
  { title: 'PPT制作', description: '一句话梳理演示文稿', category: 'document', icon: 'Present', color: '#E35D6A', background: '#FFF0F0', prompt: '请根据我的需求生成一份PPT内容大纲。', hot: '1200+' },
  { title: 'Excel函数大师', description: '解答表格与函数问题', category: 'document', icon: 'Grid', color: '#27A59D', background: '#E8F7F5', prompt: '请帮助我解决Excel函数或数据处理问题。', hot: '1200+' },
  { title: '文本润色大师', description: '优化表达与行文质量', category: 'document', icon: 'EditPen', color: '#FF922C', background: '#FFF4E8', prompt: '请对我接下来提供的文本进行润色。', hot: '1200+' },
  { title: '内容校对', description: '检查错漏与表达问题', category: 'document', icon: 'CircleCheck', color: '#666FD8', background: '#F0F0FF', prompt: '请校对我接下来提供的内容，并指出需要修改的地方。', hot: '1200+' },
  { title: '会议纪要', description: '语音转写并智能总结', category: 'office', tag: 'NEW', icon: 'Microphone', color: '#27A59D', background: '#E8F7F5', route: '/agents/meeting', hot: '1200+' },
  { title: '工作周报', description: '总结一周工作成果', category: 'office', icon: 'Calendar', color: '#007BFF', background: '#DCEDFF', prompt: '请根据我提供的工作内容生成一份工作周报。', hot: '1200+' },
  { title: '工作月报', description: '全面回顾每月工作', category: 'office', icon: 'Calendar', color: '#007BFF', background: '#DCEDFF', prompt: '请根据我提供的工作内容生成一份工作月报。', hot: '1200+' },
  { title: '工作计划', description: '量身制定工作计划', category: 'office', icon: 'List', color: '#FF922C', background: '#FFF4E8', prompt: '请根据我的目标制定一份可执行的工作计划。', hot: '1200+' },
  { title: '格式转换', description: '常用文件格式转换', category: 'utility', tag: 'NEW', icon: 'Switch', color: '#007BFF', background: '#DCEDFF', route: '/agents/conversion', hot: '1200+' },
  { title: 'AI翻译', description: '多语种文本智能翻译', category: 'utility', image: translatorImg, prompt: '请翻译我接下来提供的内容，并保留原文语义和格式。', hot: '1200+' },
  { title: '图片处理', description: '识别并分析图片内容', category: 'utility', icon: 'Picture', color: '#666FD8', background: '#F0F0FF', prompt: '请分析我接下来上传的图片。', hot: '1200+' },
  { title: '调整语气', description: '适配不同沟通场景', category: 'other', icon: 'ChatDotRound', color: '#666FD8', background: '#F0F0FF', prompt: '请根据我说明的使用场景，调整文本语气。', hot: '1200+' },
]
