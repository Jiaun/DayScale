import {
  BellRing,
  CalendarDays,
  Download,
  House,
  MonitorSmartphone,
  Smartphone,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react'

export const dailySpend = 37.8

export const overviewStats = [
  { label: '商品总数', value: '28 件' },
  { label: '总原始消费金额', value: '¥ 4,286' },
  { label: '当前最高日均商品', value: '挂耳咖啡  ¥ 6.20/天' },
] as const

export const categoryRatios = [
  { label: '饮品与咖啡', value: '45%', width: 'w-[45%]' },
  { label: '清洁与纸品', value: '31%', width: 'w-[31%]' },
  { label: '零食与其他', value: '24%', width: 'w-[24%]' },
] as const

export const topDailyItems = [
  { rank: '01', name: '挂耳咖啡', value: '¥ 6.20/天' },
  { rank: '02', name: '抽纸', value: '¥ 4.10/天' },
  { rank: '03', name: '洗碗凝珠', value: '¥ 3.60/天' },
] as const

export const goodsCategories = ['全部', '电子', '家居', '出行'] as const

export const goodsItems = [
  {
    name: 'iPhone 15 Pro',
    category: '电子',
    price: '¥8,999',
    days: '287 天',
    date: '2024-01-18',
    daily: '¥31.36/天',
    tone: 'text-emerald-600',
  },
  {
    name: 'Bose QC Ultra',
    category: '电子',
    price: '¥2,299',
    days: '126 天',
    date: '2024-06-27',
    daily: '¥18.25/天',
    tone: 'text-emerald-600',
  },
  {
    name: 'Dyson V12 Detect',
    category: '家居',
    price: '¥3,899',
    days: '402 天',
    date: '2023-09-25',
    daily: '¥9.70/天',
    tone: 'text-orange-500',
  },
  {
    name: 'Switch OLED',
    category: '娱乐',
    price: '¥2,099',
    days: '233 天',
    date: '2024-03-12',
    daily: '¥9.01/天',
    tone: 'text-orange-400',
  },
  {
    name: 'Nespresso Vertuo',
    category: '家电',
    price: '¥1,688',
    days: '519 天',
    date: '2023-05-31',
    daily: '¥3.25/天',
    tone: 'text-orange-400',
  },
  {
    name: 'Rimowa Cabin S',
    category: '出行',
    price: '¥7,200',
    days: '95 天',
    date: '2024-07-28',
    daily: '¥75.79/天',
    tone: 'text-emerald-600',
  },
] as const

export const categoryStats = [
  {
    icon: House,
    name: '居家维护',
    metric: '8 件 · ¥2,460 · ¥19.2/天',
    detail: '日均最高商品：电暖器滤芯更换 · ¥6.4/天',
    width: 'w-[70%]',
    solid: true,
  },
  {
    icon: Smartphone,
    name: '数码订阅',
    metric: '11 件 · ¥1,680 · ¥21.7/天',
    detail: '日均最高商品：云备份年费 · ¥8.9/天',
    width: 'w-[78%]',
    solid: false,
  },
  {
    icon: UtensilsCrossed,
    name: '餐饮外卖',
    metric: '9 件 · ¥980 · ¥11.5/天',
    detail: '日均最高商品：咖啡月卡 · ¥3.6/天',
    width: 'w-[40%]',
    solid: false,
  },
] as const

export const profileSettings = [
  { icon: BellRing, label: '每日摊销提醒', value: '已开启' },
  { icon: MonitorSmartphone, label: '金额显示 2 位小数', value: '默认' },
  { icon: CalendarDays, label: '按日期口径计算', value: '规则说明' },
] as const

export const profileActions = [
  { icon: Download, label: '导出商品记录', value: '' },
  { icon: Trash2, label: '清空已删除记录', value: '', danger: true },
] as const

export const notifications = [
  {
    icon: BellRing,
    title: '新增成功',
    desc: 'iPhone 15 Pro · 8,999 元',
    time: '09:20',
    tone: 'text-emerald-500',
  },
  {
    icon: Trash2,
    title: '删除成功',
    desc: 'AirPods Pro 已移出统计',
    time: '昨天',
    tone: 'text-red-500',
  },
] as const

export const detailChartBars = [54, 50, 60, 72, 78] as const

export const onboardingExamples = [
  {
    title: '年度会员',
    meta: '¥365 / 365 天',
    value: '¥1.00',
  },
  {
    title: '降噪耳机',
    meta: '¥899 / 90 天',
    value: '¥9.99',
  },
  {
    title: '进阶课程',
    meta: '¥1999 / 180 天',
    value: '¥11.10',
  },
] as const

export const onboardingReasons = [
  {
    title: '为什么要看日均成本？',
    desc: '不是为了省，而是为了更快判断这笔消费会不会持续带来价值。',
  },
  {
    title: '减少冲动购买',
    desc: '看到“每天只花多少”，决策会更冷静。',
  },
  {
    title: '建立长期视角',
    desc: '订阅、课程、设备，都能回到真实使用周期。',
  },
  {
    title: '对比不同方案',
    desc: '月付、年付、买断，一眼看出哪个更划算。',
  },
] as const
