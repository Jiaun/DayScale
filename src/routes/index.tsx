import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'motion/react'

import { BottomNav } from '@/components/app/bottom-nav'
import {
  ContentBlock,
  MobileShell,
  Mono,
  PageTransition,
  SectionCard,
} from '@/components/app/mobile-shell'
import * as appData from '@/lib/app-data'
import { expenseCategories } from '@/lib/app-data'
import {
  DEMO_REFERENCE_DATE,
  buildCategoryRatios,
  buildOverviewStats,
  buildTopDailyItems,
} from '@/lib/expense-metrics'

import type { ExpenseRecord } from '@/lib/expense-metrics'
import {
  itemVariants,
  listVariants,
  panelVariants,
} from '@/lib/motion/transitions'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
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
        topItem: null,
      }
  const categoryRatios = hasRecords
    ? buildCategoryRatios(expenseCategories, records, DEMO_REFERENCE_DATE)
    : []
  const topDailyItems = hasRecords
    ? buildTopDailyItems(expenseCategories, records, DEMO_REFERENCE_DATE)
    : []

  return (
    <MobileShell>
      <PageTransition>
        <ContentBlock className="gap-3 pt-1 pb-1.5">
          <motion.section
            variants={listVariants}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-3"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <h2 className="text-[16px] font-semibold text-[#101828]">
                核心总览
              </h2>
              <Mono className="text-[11px] font-semibold text-[#667085]">
                OVERVIEW
              </Mono>
            </motion.div>

            <motion.div variants={panelVariants}>
              <SectionCard className="flex flex-col gap-3 px-3.5 py-3.5">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <p className="text-[12px] font-medium text-[#667085]">
                      当前总日均摊销
                    </p>
                    <p className="font-mono text-[30px] leading-none font-bold tracking-[-0.06em] text-[#101828]">
                      ¥ {overviewStats.totalDailySpend.toFixed(2)} / 天
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <p className="font-mono text-[18px] leading-none font-bold text-[#101828]">
                      {overviewStats.totalItems} 件
                    </p>
                    <p className="text-[11px] text-[#98a2b3]">活跃商品</p>
                  </div>
                </div>

                <div className="flex gap-0 border-t border-[#d9dee7] pt-3">
                  <div className="flex flex-1 flex-col gap-1 px-3 pt-0 pb-0">
                    <p className="text-[11px] font-medium text-[#667085]">
                      总原始消费金额
                    </p>
                    <p className="font-mono text-[22px] leading-none font-bold tracking-[-0.05em] text-[#101828]">
                      ¥
                      {Math.round(overviewStats.totalAmount).toLocaleString(
                        'zh-CN',
                      )}
                    </p>
                  </div>
                  <div className="flex flex-1 flex-col gap-1 border-l border-[#d9dee7] px-3 pt-0 pb-0">
                    <p className="text-[11px] font-medium text-[#667085]">
                      日均最高商品
                    </p>
                    <p className="font-mono text-[22px] leading-none font-bold tracking-[-0.05em] text-[#101828]">
                      {overviewStats.topItem?.daily ?? '—'}
                    </p>
                    <p className="text-[11px] text-[#98a2b3]">
                      {overviewStats.topItem?.name ?? '暂无商品'}
                    </p>
                  </div>
                </div>
              </SectionCard>
            </motion.div>
          </motion.section>

          <motion.section
            variants={listVariants}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-2.5"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <h2 className="text-[16px] font-semibold text-[#101828]">
                分类消耗占比
              </h2>
              <Mono className="text-[11px] font-semibold text-[#667085]">
                RATIO
              </Mono>
            </motion.div>

            <motion.div variants={panelVariants}>
              <SectionCard className="flex flex-col gap-3 px-3.5 py-3.5">
                {categoryRatios.length === 0 ? (
                  <p className="text-[13px] text-[#667085]">
                    暂无分类消耗数据，请先新增商品
                  </p>
                ) : (
                  categoryRatios.map((ratio, index) => (
                    <motion.div
                      key={ratio.label}
                      variants={itemVariants}
                      className="flex flex-col gap-1"
                    >
                      <div className="flex items-end justify-between">
                        <p className="text-[15px] font-medium text-[#101828]">
                          {ratio.label}
                        </p>
                        <p
                          className={[
                            'font-mono text-[16px] leading-none font-bold tracking-[-0.06em]',
                            index === 0
                              ? 'text-[#101828]'
                              : index === 1
                                ? 'text-[#111827]'
                                : 'text-[#667085]',
                          ].join(' ')}
                        >
                          {ratio.percentage}%
                        </p>
                      </div>
                      <div className="h-2 w-full overflow-hidden bg-[#eef2f6]">
                        <div
                          className={[
                            'h-full',
                            ratio.widthClass,
                            index === 0
                              ? 'bg-[#101828]'
                              : index === 1
                                ? 'bg-[#111827]'
                                : 'bg-[#667085]',
                          ].join(' ')}
                        />
                      </div>
                    </motion.div>
                  ))
                )}
              </SectionCard>
            </motion.div>
          </motion.section>

          <motion.section
            variants={listVariants}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-2"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <h2 className="text-[16px] font-semibold text-[#101828]">
                日均消费前 3
              </h2>
              <Mono className="text-[11px] font-semibold text-[#667085]">
                RANKING
              </Mono>
            </motion.div>

            <motion.div variants={panelVariants}>
              <SectionCard className="overflow-hidden">
                {topDailyItems.length === 0 ? (
                  <motion.p
                    variants={itemVariants}
                    className="px-3.5 py-3 text-[13px] text-[#667085]"
                  >
                    暂无排行数据，请先新增商品
                  </motion.p>
                ) : (
                  topDailyItems.map((item, index) => (
                    <motion.article
                      key={item.rank}
                      variants={itemVariants}
                      className={[
                        'flex items-center justify-between px-3.5 py-3',
                        index === 0 ? '' : 'border-t border-[#d9dee7]',
                      ].join(' ')}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={[
                            'flex size-7 items-center justify-center',
                            index === 0
                              ? 'bg-[#344054] text-white'
                              : 'border border-[#d9dee7] text-[#101828]',
                          ].join(' ')}
                        >
                          <span className="font-mono text-[13px] font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <p className="text-[15px] font-semibold text-[#101828]">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-[#667085]">
                            {item.note}
                          </p>
                        </div>
                      </div>
                      <p className="font-mono text-[16px] font-bold text-[#101828]">
                        {item.value}
                      </p>
                    </motion.article>
                  ))
                )}
              </SectionCard>
            </motion.div>
          </motion.section>
        </ContentBlock>
      </PageTransition>

      <BottomNav active="/" />
    </MobileShell>
  )
}
