import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowUpRight,
  CalendarRange,
  GitCompareArrows,
  ScanSearch,
  WalletCards,
} from 'lucide-react'
import { motion } from 'motion/react'

import {
  ContentBlock,
  MobileShell,
  Mono,
  SectionCard,
} from '@/components/app/mobile-shell'
import { Button } from '@/components/ui/button'
import { onboardingExamples, onboardingReasons } from '@/lib/app-data'
import {
  itemVariants,
  listVariants,
  panelVariants,
} from '@/lib/motion/transitions'

export const Route = createFileRoute('/guide')({
  component: GuidePage,
})

function GuidePage() {
  return (
    <MobileShell>
      <ContentBlock className="gap-6">
        <header className="flex flex-col gap-3">
          <div className="flex w-fit items-center gap-2 border border-[#d9dee7] bg-white px-2 py-[5px]">
            <WalletCards className="size-3.5 text-[#101828]" />
            <Mono className="text-[10px] font-semibold text-[#374151]">
              AMORTIZE SPENDING
            </Mono>
          </div>
          <div className="space-y-2">
            <h1 className="text-[32px] leading-[1.1] font-semibold tracking-[-0.04em] text-[#101828]">
              把一次性消费
              <br />
              变成日均摊销
            </h1>
            <p className="text-[13px] leading-relaxed text-[#667085]">
              每次大额支出，都自动拆成你真正每天在用的成本。更容易判断值不值，也更容易坚持长期消费决策。
            </p>
          </div>
        </header>

        <motion.section
          variants={panelVariants}
          initial="initial"
          animate="animate"
        >
          <SectionCard>
            <div className="flex items-center justify-between px-3.5 py-3.5">
              <Mono className="text-[11px] font-semibold text-[#667085]">
                示意数据
              </Mono>
              <Mono className="text-[11px] font-semibold text-[#667085]">
                VALUE / DAY
              </Mono>
            </div>
            {onboardingExamples.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between border-t border-[#d9dee7] px-3.5 py-3.5"
              >
                <div>
                  <p className="text-[16px] leading-none font-medium tracking-[-0.02em] text-[#101828]">
                    {item.title}
                  </p>
                  <p className="mt-1 font-mono text-[11px] font-normal text-[#667085]">
                    {item.meta}
                  </p>
                </div>
                <p className="font-mono text-[24px] leading-none font-semibold tracking-[-0.03em] text-[#101828]">
                  {item.value}
                </p>
              </div>
            ))}
          </SectionCard>
        </motion.section>

        <motion.section
          variants={listVariants}
          initial="initial"
          animate="animate"
        >
          <SectionCard>
            {onboardingReasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                variants={itemVariants}
                className={[
                  'px-3.5',
                  index === 0 ? 'py-4' : 'py-3.5',
                  index === 0 ? '' : 'border-t border-[#d9dee7]',
                ].join(' ')}
              >
                <div className="flex items-center justify-between">
                  <h2
                    className={[
                      'leading-none tracking-[-0.02em] text-[#101828]',
                      index === 0
                        ? 'text-[20px] font-semibold'
                        : 'text-[16px] font-medium',
                    ].join(' ')}
                  >
                    {reason.title}
                  </h2>
                  {index === 0 ? (
                    <ArrowUpRight className="size-[18px] text-[#111111]" />
                  ) : index === 1 ? (
                    <ScanSearch className="size-[18px] text-[#111111]" />
                  ) : index === 2 ? (
                    <CalendarRange className="size-[18px] text-[#111111]" />
                  ) : (
                    <GitCompareArrows className="size-[18px] text-[#111111]" />
                  )}
                </div>
                <p
                  className={[
                    index === 0
                      ? 'mt-1.5 text-[13px] leading-[1.5]'
                      : 'mt-1 text-[12px] leading-[1.45]',
                    'text-[#667085]',
                  ].join(' ')}
                >
                  {reason.desc}
                </p>
              </motion.div>
            ))}
          </SectionCard>
        </motion.section>

        <div className="pt-2">
          <Button
            asChild
            className="h-11 w-full rounded-none bg-[#111827] text-[16px] font-semibold tracking-[-0.02em] text-white hover:bg-[#111827]/95"
          >
            <Link to="/">开始使用</Link>
          </Button>
        </div>
      </ContentBlock>
    </MobileShell>
  )
}
