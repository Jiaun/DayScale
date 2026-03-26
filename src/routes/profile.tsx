import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'

import { BottomNav } from '@/components/app/bottom-nav'
import {
  ContentBlock,
  MobileShell,
  PageTransition,
} from '@/components/app/mobile-shell'
import * as appData from '@/lib/app-data'
import { profileActions } from '@/lib/app-data'
import { itemVariants, listVariants } from '@/lib/motion/transitions'
import { cn } from '@/lib/utils'

import type { ExpenseRecord } from '@/lib/expense-metrics'

export const Route = createFileRoute('/profile')({
  component: ProfileRoutePage,
})

function ProfileRoutePage() {
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

  return (
    <MobileShell>
      <PageTransition>
        <ContentBlock className="gap-6 pb-0">
          <header>
            <div className="flex flex-col gap-1">
              <h1 className="text-[26px] leading-none font-semibold tracking-[-0.02em] text-[#101828]">
                我的
              </h1>
              <p className="text-[12px] text-[#667085]">账户、偏好与数据管理</p>
            </div>
          </header>

          <motion.div
            variants={listVariants}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-6"
          >
            <motion.section variants={itemVariants}>
              <div className="flex items-center justify-between border-b border-[#d9dee7] py-4">
                <div className="flex items-center gap-3">
                  <div className="size-11 bg-[#eaecf5]" />
                  <div className="flex-1">
                    <p className="text-[15px] leading-none font-semibold text-[#101828]">
                      Jiaunun
                    </p>
                    <p className="mt-0.5 text-[12px] text-[#667085]">
                      已记录 {records.length} 件商品
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-[18px] text-[#667085]" />
              </div>
            </motion.section>

            <motion.section variants={itemVariants} className="space-y-0">
              <p className="text-[12px] font-semibold text-[#667085]">
                数据与账户
              </p>
              <div>
                {profileActions.map((item) => {
                  const Icon = item.icon
                  const isDanger = 'danger' in item && Boolean(item.danger)

                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between border-b border-[#d9dee7] py-[14px]"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            'size-4',
                            isDanger ? 'text-[#ef4444]' : 'text-[#344054]',
                          )}
                        />
                        <p
                          className={cn(
                            'text-[14px] leading-none',
                            isDanger ? 'text-[#ef4444]' : 'text-[#101828]',
                          )}
                        >
                          {item.label}
                        </p>
                      </div>
                      {isDanger ? null : (
                        <ChevronRight className="size-4 text-[#667085]" />
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.section>

            <motion.p
              variants={itemVariants}
              className="pb-3 text-[12px] text-[#667085]"
            >
              Amortize v1.0 · 计算只按日期，不计时分秒
            </motion.p>
          </motion.div>
        </ContentBlock>
      </PageTransition>

      <BottomNav active="/profile" />
    </MobileShell>
  )
}
