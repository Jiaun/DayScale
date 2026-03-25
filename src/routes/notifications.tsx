import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Check } from 'lucide-react'
import { motion } from 'motion/react'

import {
  ContentBlock,
  MobileShell,
  SectionCard,
} from '@/components/app/mobile-shell'
import { Button } from '@/components/ui/button'
import { notifications } from '@/lib/app-data'
import {
  itemVariants,
  listVariants,
  panelVariants,
} from '@/lib/motion/transitions'

export const Route = createFileRoute('/notifications')({
  component: NotificationsPage,
})

function NotificationsPage() {
  return (
    <MobileShell>
      <ContentBlock className="justify-between pb-4">
        <div className="flex flex-col gap-6">
          <header>
            <div className="flex items-center gap-2">
              <Link to="/" className="text-[#101828]">
                <ArrowLeft className="size-4" />
              </Link>
              <h1 className="text-[26px] leading-none font-semibold tracking-[-0.03em] text-[#101828]">
                操作提醒
              </h1>
            </div>
          </header>

          <motion.section
            variants={panelVariants}
            initial="initial"
            animate="animate"
          >
            <SectionCard className="px-4 py-5">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center bg-[#111827] text-white">
                  <Check className="size-4" />
                </div>
                <div className="flex-1">
                  <h2 className="text-[18px] font-semibold text-[#101828]">
                    商品已新增
                  </h2>
                  <p className="mt-0.5 text-[12px] text-[#667085]">
                    MacBook Air 已进入摊销计算
                  </p>
                </div>
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-[#344054]">
                系统已按购买日期开始计算日均摊销，你可以继续补充分类、备注或查看趋势。
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  asChild
                  className="h-11 flex-1 bg-[#111827] text-[14px] font-semibold text-white hover:bg-[#111827]/90"
                >
                  <Link to="/new">查看详情</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-11 flex-1 border-[#d9dee7] text-[14px] font-semibold text-[#344054]"
                >
                  <Link to="/new">继续新增</Link>
                </Button>
              </div>
            </SectionCard>
          </motion.section>

          <section className="space-y-0">
            <h2 className="text-[12px] font-semibold text-[#6d6c6a]">
              最近提醒
            </h2>
            <motion.div
              variants={listVariants}
              initial="initial"
              animate="animate"
              className="space-y-0"
            >
              {notifications.map((item) => {
                const Icon = item.icon

                return (
                  <motion.article
                    key={item.title}
                    variants={itemVariants}
                    className="flex items-center justify-between border-b border-[#d9dee7] py-[14px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`size-4 ${item.tone}`} />
                      <div>
                        <h3 className="text-[14px] text-[#101828]">
                          {item.title}
                        </h3>
                        <p className="mt-0.5 text-[12px] text-[#667085]">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                    <span className="text-[12px] text-[#98a2b3]">
                      {item.time}
                    </span>
                  </motion.article>
                )
              })}
            </motion.div>
          </section>
        </div>

        <div className="space-y-3">
          <Button
            asChild
            variant="outline"
            className="h-11 w-full border-[#d9dee7] text-[14px] font-semibold text-[#111827]"
          >
            <Link to="/">返回首页</Link>
          </Button>
        </div>
      </ContentBlock>
    </MobileShell>
  )
}
