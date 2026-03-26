import { LayoutGrid } from 'lucide-react'

import {
  DEMO_REFERENCE_DATE,
  onboardingExamples,
  onboardingReasons,
  profileActions,
  buildCategoryRatios,
  buildCategorySummaries,
  buildExpenseDetailView,
  buildGoodsCategories,
  buildGoodsListItems,
  buildNotifications,
  buildOverviewStats,
  buildRecentPurchase,
  buildTopDailyItems,
  categoryIconMap,
} from '@/lib/expense-metrics'
import {
  clearExpenseRecords,
  createExpenseRecord,
  deleteExpenseRecord,
  getExpenseRecord,
  listExpenseRecords,
  updateExpenseRecord,
  useExpenseRecord,
  useExpenseRecords,
} from '@/lib/local-db'
import type { ExpenseRecord } from '@/lib/expense-metrics'

const emptyExpenseRecord: ExpenseRecord = {
  id: 'empty-expense',
  categoryId: 'other',
  name: '暂无商品',
  amount: 0,
  purchasedAt: DEMO_REFERENCE_DATE,
  image: '',
  note: '创建第一条商品后即可查看详情与趋势',
}

export const expenseCategories = [
  {
    id: 'digital',
    name: '数码',
    icon: categoryIconMap.digital,
  },
  {
    id: 'coffee',
    name: '食品饮料',
    icon: categoryIconMap.coffee,
  },
  {
    id: 'cleaning',
    name: '日用清洁',
    icon: categoryIconMap.cleaning,
  },
  {
    id: 'travel',
    name: '出行',
    icon: categoryIconMap.travel,
  },
  {
    id: 'maintenance',
    name: '居家维护',
    icon: categoryIconMap.maintenance,
  },
  {
    id: 'shopping',
    name: '日常购物',
    icon: categoryIconMap.shopping,
  },
  {
    id: 'clothing',
    name: '服饰穿搭',
    icon: categoryIconMap.clothing,
  },
  {
    id: 'entertainment',
    name: '娱乐休闲',
    icon: categoryIconMap.entertainment,
  },
  {
    id: 'health',
    name: '医疗健康',
    icon: categoryIconMap.health,
  },
  {
    id: 'learning',
    name: '学习成长',
    icon: categoryIconMap.learning,
  },
  {
    id: 'other',
    name: '其他',
    icon: categoryIconMap.other,
  },
] as const

export const expenseCategoryMap = new Map<
  string,
  (typeof expenseCategories)[number]
>(expenseCategories.map((category) => [category.name, category]))

export const goodsCategoryOptions = [
  {
    id: 'all',
    name: '全部',
    icon: LayoutGrid,
  },
  ...expenseCategories,
] as const

export { onboardingExamples, onboardingReasons, profileActions }

export const expenseRecords: ExpenseRecord[] = []

export const expenseRecordCrud = {
  list: listExpenseRecords,
  getById: getExpenseRecord,
  create: createExpenseRecord,
  update: updateExpenseRecord,
  remove: deleteExpenseRecord,
  clear: clearExpenseRecords,
}

export {
  clearExpenseRecords,
  createExpenseRecord,
  deleteExpenseRecord,
  getExpenseRecord,
  listExpenseRecords,
  updateExpenseRecord,
  useExpenseRecord,
  useExpenseRecords,
}

export function useExpenseAppData(referenceDate: string = DEMO_REFERENCE_DATE) {
  const records = useExpenseRecords()
  const goodsCategories = buildGoodsCategories(expenseCategories)
  const goodsItems = buildGoodsListItems(expenseCategories, records, referenceDate)
  const overviewStatsBase = buildOverviewStats(
    expenseCategories,
    records,
    referenceDate,
  )
  const overviewStats = {
    ...overviewStatsBase,
    topItem: overviewStatsBase.topItem,
  }
  const categoryRatios = buildCategoryRatios(
    expenseCategories,
    records,
    referenceDate,
  )
  const topDailyItems = buildTopDailyItems(
    expenseCategories,
    records,
    referenceDate,
  )
  const recentPurchase = buildRecentPurchase(expenseCategories, records)
  const categoryStats = buildCategorySummaries(
    expenseCategories,
    records,
    referenceDate,
  )
  const notifications = buildNotifications(expenseCategories, records)
  const selectedExpenseDetail = buildExpenseDetailView(
    expenseCategories,
    records[0] ?? emptyExpenseRecord,
    referenceDate,
  )

  return {
    expenseRecords: records,
    goodsCategories,
    goodsItems,
    overviewStats,
    dailySpend: overviewStats.totalDailySpend,
    categoryRatios,
    topDailyItems,
    recentPurchase,
    categoryStats,
    notifications,
    selectedExpenseDetail,
  }
}
