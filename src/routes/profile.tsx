import { createFileRoute } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'

import { BottomNav } from '@/components/app/bottom-nav'
import {
  ContentBlock,
  MobileShell,
  PageTransition,
} from '@/components/app/mobile-shell'
import { profileActions, profileSettings } from '@/lib/app-data'
import { itemVariants, listVariants } from '@/lib/motion/transitions'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/profile')({
  component: ProfileRoutePage,
})

function ProfileRoutePage() {
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
                      已记录 42 件商品
                    </p>
                  </div>
                </div>
                <ChevronRight className="size-[18px] text-[#667085]" />
              </div>
            </motion.section>

            <motion.section variants={itemVariants} className="space-y-0">
              <p className="text-[12px] font-semibold text-[#667085]">
                偏好设置
              </p>
              <div>
                {profileSettings.map((item) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between border-b border-[#d9dee7] py-[14px]"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <Icon className="size-4 shrink-0 text-[#101828]" />
                        <p className="truncate text-[14px] leading-none text-[#101828]">
                          {item.label}
                        </p>
                      </div>
                      <span className="shrink-0 text-[12px] text-[#667085]">
                        {item.value}
                      </span>
                    </div>
                  )
                })}
              </div>
            </motion.section>

            <motion.section variants={itemVariants} className="space-y-0">
              <p className="text-[12px] font-semibold text-[#667085]">
                数据与账户
              </p>
              <div>
                {profileActions.map((item) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between border-b border-[#d9dee7] py-[14px]"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            'size-4',
                            item.danger ? 'text-[#ef4444]' : 'text-[#344054]',
                          )}
                        />
                        <p
                          className={cn(
                            'text-[14px] leading-none',
                            item.danger ? 'text-[#ef4444]' : 'text-[#101828]',
                          )}
                        >
                          {item.label}
                        </p>
                      </div>
                      {item.danger ? null : (
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
