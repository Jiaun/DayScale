import type { LucideIcon } from 'lucide-react'
import {
  BellRing,
  BookOpen,
  Download,
  Ellipsis,
  HeartPulse,
  House,
  Plane,
  Popcorn,
  Shirt,
  ShoppingBag,
  Smartphone,
  Trash2,
  UtensilsCrossed,
  Wrench,
} from 'lucide-react'

export const DEMO_REFERENCE_DATE = '2026-03-26'

export type ExpenseCategory = {
  id: string
  name: string
  icon: LucideIcon
}

export type ExpenseRecord = {
  id: string
  categoryId: ExpenseCategory['id']
  name: string
  amount: number
  purchasedAt: string
  image: string
  note: string
}

export type RankedExpense = {
  rank: string
  name: string
  value: string
  note: string
}

export type CategoryBreakdown = {
  categoryId: string
  label: string
  amount: number
  dailyCost: number
  percentage: number
  widthClass: string
  toneClass: string
}

export type CategorySummary = {
  icon: LucideIcon
  name: string
  metric: string
  detail: string
  width: string
  solid: boolean
}

export type GoodsListItem = {
  id: string
  name: string
  category: string
  price: string
  daysHeld: string
  date: string
  daily: string
  dailyCost: number
  tone: string
  note: string
  image: string
}

export const EMPTY_GOODS_ITEM: GoodsListItem = {
  id: 'empty',
  name: '暂无商品',
  category: '未分类',
  price: '¥0',
  daysHeld: '0 天',
  date: DEMO_REFERENCE_DATE,
  daily: '¥0.00/天',
  dailyCost: 0,
  tone: 'text-[#667085]',
  note: '新增商品后可查看排行',
  image: '',
}

export type ExpenseDetailView = {
  id: string
  name: string
  amount: string
  purchasedAt: string
  category: string
  note: string
  image: string
  dailyCost: string
  daysHeld: string
  shareSegments: [number, number]
}

export const profileActions = [
  { icon: Download, label: '导出商品记录', value: '' },
] as const

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

export function parseDateOnly(dateString: string) {
  return new Date(`${dateString}T00:00:00`)
}

export function getDaysHeld(
  purchasedAt: string,
  referenceDate: string = DEMO_REFERENCE_DATE,
) {
  const purchase = parseDateOnly(purchasedAt)
  const reference = parseDateOnly(referenceDate)
  const milliseconds = reference.getTime() - purchase.getTime()
  const rawDays = Math.floor(milliseconds / 86_400_000) + 1

  return Math.max(rawDays, 1)
}

export function getDailyCost(
  amount: number,
  purchasedAt: string,
  referenceDate: string = DEMO_REFERENCE_DATE,
) {
  return amount / getDaysHeld(purchasedAt, referenceDate)
}

export function formatCurrency(value: number) {
  return `¥${Math.round(value).toLocaleString('zh-CN')}`
}

export function formatCurrencyCompact(value: number) {
  return `¥ ${Math.round(value).toLocaleString('zh-CN')}`
}

export function formatDailyCost(value: number) {
  return `¥ ${value.toFixed(2)}/天`
}

export function formatDailyCostInline(value: number) {
  return `¥${value.toFixed(2)}/天`
}

export function buildGoodsCategories(categories: readonly ExpenseCategory[]) {
  return ['全部', ...categories.map((category) => category.name)] as const
}

export function buildGoodsListItems(
  categories: readonly ExpenseCategory[],
  records: readonly ExpenseRecord[],
  referenceDate: string = DEMO_REFERENCE_DATE,
): GoodsListItem[] {
  const categoryMap = new Map(
    categories.map((category) => [category.id, category]),
  )

  return [...records]
    .sort(
      (left, right) =>
        getDailyCost(right.amount, right.purchasedAt, referenceDate) -
        getDailyCost(left.amount, left.purchasedAt, referenceDate),
    )
    .map((record) => {
      const dailyCost = getDailyCost(
        record.amount,
        record.purchasedAt,
        referenceDate,
      )
      const category = categoryMap.get(record.categoryId)?.name ?? '未分类'

      return {
        id: record.id,
        name: record.name,
        category,
        price: formatCurrency(record.amount),
        daysHeld: `${getDaysHeld(record.purchasedAt, referenceDate)} 天`,
        date: record.purchasedAt,
        daily: formatDailyCostInline(dailyCost),
        dailyCost,
        tone:
          dailyCost >= 20
            ? 'text-[#3d8a5a]'
            : dailyCost >= 8
              ? 'text-[#d89575]'
              : 'text-[#667085]',
        note: record.note,
        image: record.image,
      }
    })
}

export function buildOverviewStats(
  categories: readonly ExpenseCategory[],
  records: readonly ExpenseRecord[],
  referenceDate: string = DEMO_REFERENCE_DATE,
) {
  const totalItems = records.length
  const totalAmount = records.reduce((sum, record) => sum + record.amount, 0)
  const totalDailySpend = records.reduce(
    (sum, record) =>
      sum + getDailyCost(record.amount, record.purchasedAt, referenceDate),
    0,
  )
  const topItem =
    [...buildGoodsListItems(categories, records, referenceDate)][0] ??
    EMPTY_GOODS_ITEM

  return {
    totalItems,
    totalAmount,
    totalDailySpend,
    topItem,
  }
}

export function buildCategoryRatios(
  categories: readonly ExpenseCategory[],
  records: readonly ExpenseRecord[],
  referenceDate: string = DEMO_REFERENCE_DATE,
): CategoryBreakdown[] {
  const categoryMap = new Map(
    categories.map((category) => [category.id, category]),
  )
  const dailyTotal = records.reduce(
    (sum, record) =>
      sum + getDailyCost(record.amount, record.purchasedAt, referenceDate),
    0,
  )

  return categories
    .map((category, index) => {
      const items = records.filter(
        (record) => record.categoryId === category.id,
      )
      const amount = items.reduce((sum, item) => sum + item.amount, 0)
      const dailyCost = items.reduce(
        (sum, item) =>
          sum + getDailyCost(item.amount, item.purchasedAt, referenceDate),
        0,
      )
      const percentage =
        dailyTotal === 0 ? 0 : Math.round((dailyCost / dailyTotal) * 100)
      const width = Math.max(8, Math.round((percentage / 100) * 100))

      return {
        categoryId: category.id,
        label: categoryMap.get(category.id)?.name ?? category.name,
        amount,
        dailyCost,
        percentage,
        widthClass: `w-[${width}%]`,
        toneClass:
          index === 0
            ? 'text-[#101828]'
            : index === 1
              ? 'text-[#344054]'
              : 'text-[#667085]',
      }
    })
    .filter((category) => category.amount > 0 && category.dailyCost > 0)
    .sort((left, right) => right.dailyCost - left.dailyCost)
}

export function buildTopDailyItems(
  categories: readonly ExpenseCategory[],
  records: readonly ExpenseRecord[],
  referenceDate: string = DEMO_REFERENCE_DATE,
): RankedExpense[] {
  return buildGoodsListItems(categories, records, referenceDate)
    .slice(0, 3)
    .map((item, index) => ({
      rank: String(index + 1).padStart(2, '0'),
      name: item.name,
      value: item.daily,
      note:
        index === 0
          ? '当前占用最高'
          : index === 1
            ? '稳定日常消耗'
            : '长尾低频但持续',
    }))
}

export function buildRecentPurchase(
  categories: readonly ExpenseCategory[],
  records: readonly ExpenseRecord[],
) {
  const categoryMap = new Map(
    categories.map((category) => [category.id, category]),
  )
  const latest = [...records]
    .sort((left, right) => right.purchasedAt.localeCompare(left.purchasedAt))
    .at(0)

  if (!latest) {
    return {
      id: '',
      categoryId: '',
      name: '暂无商品',
      amount: 0,
      purchasedAt: DEMO_REFERENCE_DATE,
      image: '',
      note: '新增商品后可查看最近购入',
      categoryName: '未分类',
      amountLabel: formatCurrencyCompact(0),
    }
  }

  return {
    ...latest,
    categoryName: categoryMap.get(latest.categoryId)?.name ?? '未分类',
    amountLabel: formatCurrencyCompact(latest.amount),
  }
}

export function buildCategorySummaries(
  categories: readonly ExpenseCategory[],
  records: readonly ExpenseRecord[],
  referenceDate: string = DEMO_REFERENCE_DATE,
): CategorySummary[] {
  const goodsList = buildGoodsListItems(categories, records, referenceDate)

  return buildCategoryRatios(categories, records, referenceDate).map(
    (category, index) => {
      const categoryInfo = categories.find(
        (item) => item.id === category.categoryId,
      )
      const relatedItems = goodsList.filter(
        (item) => item.category === category.label,
      )
      const topItem = relatedItems.at(0)

      return {
        icon: categoryInfo?.icon ?? House,
        name: category.label,
        metric: `${relatedItems.length} 件 · ${formatCurrency(category.amount)} · ${formatDailyCostInline(category.dailyCost)}`,
        detail: topItem
          ? `日均最高商品：${topItem.name} · ${topItem.daily}`
          : '暂无商品',
        width: category.widthClass,
        solid: index === 0,
      }
    },
  )
}

export function buildNotifications(
  categories: readonly ExpenseCategory[],
  records: readonly ExpenseRecord[],
) {
  const goodsList = buildGoodsListItems(categories, records)
  const latest = goodsList.at(0)

  if (!latest) {
    return [
      {
        icon: BellRing,
        title: '暂无提醒',
        desc: '新增商品后将显示最新动态',
        time: '--:--',
        tone: 'text-[#667085]',
      },
      {
        icon: Trash2,
        title: '删除记录',
        desc: '当前没有可删除商品',
        time: '--',
        tone: 'text-[#98a2b3]',
      },
    ] as const
  }

  const removed = goodsList.at(-1) ?? latest

  return [
    {
      icon: BellRing,
      title: '新增成功',
      desc: `${latest.name} · ${formatCurrency(latest.dailyCost > 0 ? Number(latest.price.replace(/[^\d]/g, '')) : 0)}`,
      time: '09:20',
      tone: 'text-emerald-500',
    },
    {
      icon: Trash2,
      title: '删除成功',
      desc: `${removed.name} 已移出统计`,
      time: '昨天',
      tone: 'text-red-500',
    },
  ] as const
}

export function buildExpenseDetailView(
  categories: readonly ExpenseCategory[],
  record: ExpenseRecord,
  referenceDate: string = DEMO_REFERENCE_DATE,
): ExpenseDetailView {
  const category = categories.find((item) => item.id === record.categoryId)
  const dailyCost = getDailyCost(
    record.amount,
    record.purchasedAt,
    referenceDate,
  )
  const normalized = Math.min(
    78,
    Math.max(24, Math.round((dailyCost / 20) * 100)),
  )

  return {
    id: record.id,
    name: record.name,
    amount: `${formatCurrency(record.amount)}.00`,
    purchasedAt: record.purchasedAt,
    category: category?.name ?? '未分类',
    note: record.note,
    image: record.image,
    dailyCost: `¥${dailyCost.toFixed(2)} / day`,
    daysHeld: `${getDaysHeld(record.purchasedAt, referenceDate)} DAYS`,
    shareSegments: [normalized, 100 - normalized],
  }
}

export const categoryIconMap = {
  digital: Smartphone,
  coffee: UtensilsCrossed,
  cleaning: House,
  travel: Plane,
  maintenance: Wrench,
  shopping: ShoppingBag,
  clothing: Shirt,
  entertainment: Popcorn,
  health: HeartPulse,
  learning: BookOpen,
  other: Ellipsis,
} as const
