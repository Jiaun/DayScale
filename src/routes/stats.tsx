import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'

import { BottomNav } from '@/components/app/bottom-nav'
import {
  ContentBlock,
  MobileShell,
  PageTransition,
  SectionCard,
} from '@/components/app/mobile-shell'
import * as appData from '@/lib/app-data'
import { expenseCategories } from '@/lib/app-data'
import {
  DEMO_REFERENCE_DATE,
  buildCategoryRatios,
  buildCategorySummaries,
  buildOverviewStats,
} from '@/lib/expense-metrics'

import type { ExpenseRecord } from '@/lib/expense-metrics'
import {
  itemVariants,
  listVariants,
  panelVariants,
} from '@/lib/motion/transitions'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/stats')({
  component: StatsRoutePage,
})

function StatsRoutePage() {
  const appDataAny = appData as Record<string, unknown>
  const useExpenseRecords = appDataAny.useExpenseRecords as
    | undefined
    | (() => ExpenseRecord[] | undefined)
  const records =
    useExpenseRecords?.() ??
    (
      appDataAny.expenseRecords as readonly ExpenseRecord[] | undefined
    )?.slice() ??
    []

  const hasRecords = records.length > 0
  const overviewStats = hasRecords
    ? buildOverviewStats(expenseCategories, records, DEMO_REFERENCE_DATE)
    : {
        totalItems: 0,
        totalAmount: 0,
        totalDailySpend: 0,
      }
  const categoryRatios = hasRecords
    ? buildCategoryRatios(expenseCategories, records, DEMO_REFERENCE_DATE)
    : []
  const categoryStats = hasRecords
    ? buildCategorySummaries(expenseCategories, records, DEMO_REFERENCE_DATE)
    : []

  const visibleCategoryRatios = categoryRatios.filter(
    (category) => category.amount > 0 && category.dailyCost > 0,
  )
  const visibleCategoryStats = categoryStats.filter(
    (category) => !category.metric.startsWith('0 件'),
  )
  const leadingCategory = visibleCategoryRatios.at(0)
  const leadingCategoryShare = leadingCategory?.percentage ?? 0
  const remainingShare = Math.max(0, 100 - leadingCategoryShare)

  return (
    <MobileShell>
      <PageTransition>
        <ContentBlock className="gap-6 pb-0">
          <header>
            <div className="flex flex-col gap-1">
              <h1 className="text-[26px] leading-none font-semibold tracking-[-0.02em] text-[#101828]">
                分类统计
              </h1>
              <p className="text-[13px] text-[#667085]">
                按分类查看商品数、摊销效率与重点商品
              </p>
            </div>
          </header>

          <motion.div
            variants={listVariants}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-6"
          >
            <motion.section variants={itemVariants}>
              <SectionCard className="p-4">
                <div className="flex gap-3">
                  <div className="flex flex-1 flex-col gap-1.5 border border-[#d9dee7] bg-[#f7f8fa] p-3">
                    <p className="text-[12px] font-medium text-[#667085]">
                      总原始消费
                    </p>
                    <p className="text-[26px] leading-none font-bold tracking-tight text-[#101828]">
                      ¥
                      {Math.round(overviewStats.totalAmount).toLocaleString(
                        'zh-CN',
                      )}
                    </p>
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 border border-[#d9dee7] bg-[#f7f8fa] p-3">
                    <p className="text-[12px] font-medium text-[#667085]">
                      总日均摊销
                    </p>
                    <p className="text-[26px] leading-none font-bold tracking-tight text-[#101828]">
                      ¥{overviewStats.totalDailySpend.toFixed(2)}/天
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-[12px] font-medium text-[#667085]">
                    分类日均占比（最高分类 vs 其他分类）
                  </p>
                  <div className="flex h-[10px] border border-[#d9dee7] bg-[#f2f4f7]">
                    <div
                      className="bg-[#101828]"
                      style={{ width: `${leadingCategoryShare}%` }}
                    />
                    <div
                      className="bg-[#98a2b3]"
                      style={{ width: `${remainingShare}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[12px] font-medium">
                    <span className="text-[#667085]">
                      分类商品数 {overviewStats.totalItems} 件
                    </span>
                    <span className="text-[#101828]">
                      {leadingCategory
                        ? `最高分类 ${leadingCategory.label} ¥${leadingCategory.dailyCost.toFixed(2)}/天`
                        : '最高分类 暂无数据'}
                    </span>
                  </div>
                </div>
              </SectionCard>
            </motion.section>

            <motion.section variants={itemVariants}>
              <h2 className="text-[18px] leading-none font-semibold text-[#101828]">
                分类排行
              </h2>
            </motion.section>

            <motion.section
              variants={listVariants}
              className="flex flex-col gap-3"
            >
              {visibleCategoryStats.length === 0 ? (
                <motion.div variants={panelVariants}>
                  <SectionCard className="p-4">
                    <p className="text-[13px] text-[#667085]">
                      暂无分类统计，请先新增商品
                    </p>
                  </SectionCard>
                </motion.div>
              ) : (
                visibleCategoryStats.map((row, index) => {
                  const Icon = row.icon

                  return (
                    <motion.article key={row.name} variants={panelVariants}>
                      <SectionCard className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            <div
                              className={cn(
                                'flex size-9 shrink-0 items-center justify-center border',
                                row.solid
                                  ? 'border-[#101828] bg-[#101828] text-white'
                                  : 'border-[#d9dee7] bg-[#f2f4f7] text-[#101828]',
                              )}
                            >
                              <Icon className="size-[18px]" />
                            </div>
                            <p className="truncate text-[15px] font-semibold text-[#101828]">
                              {row.name}
                            </p>
                          </div>
                          <span className="shrink-0 text-xs text-[#667085]">
                            {row.metric}
                          </span>
                        </div>
                        <p className="mt-2 text-[13px] text-[#667085]">
                          {row.detail}
                        </p>
                        <div className="mt-3 h-2 border border-[#d9dee7] bg-[#f2f4f7]">
                          <div
                            className={cn(
                              'h-full',
                              row.width,
                              index === 0
                                ? 'bg-[#101828]'
                                : index === 1
                                  ? 'bg-[#344054]'
                                  : 'bg-[#98a2b3]',
                            )}
                          />
                        </div>
                      </SectionCard>
                    </motion.article>
                  )
                })
              )}
            </motion.section>
          </motion.div>
        </ContentBlock>
      </PageTransition>

      <BottomNav active="/stats" />
    </MobileShell>
  )
}
