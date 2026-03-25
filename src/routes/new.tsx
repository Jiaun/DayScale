import { createFileRoute, Link } from '@tanstack/react-router'
import {
  CalendarDays,
  Check,
  ChevronRight,
  Image,
  SquarePen,
  X,
} from 'lucide-react'
import { motion } from 'motion/react'
import { useRef, useState } from 'react'

import { ContentBlock, MobileShell, Mono } from '@/components/app/mobile-shell'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { itemVariants, listVariants } from '@/lib/motion/transitions'

const basicRows = [
  { label: '名称', value: '索尼 WH-1000XM5' },
  { label: '价格', value: '¥2,399.00', tone: 'text-[#101828]', strong: true },
] as const

const categoryOptions = ['家电', '耳机', '会员订阅', '食品饮料'] as const
const defaultDate = '2025-02-18'
const trendSegments = [67, 33] as const

export const Route = createFileRoute('/new')({
  component: NewRoutePage,
})

function NewRoutePage() {
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [category, setCategory] = useState('数码')
  const [draftCategory, setDraftCategory] = useState(category)
  const [purchaseDate, setPurchaseDate] = useState(defaultDate)
  const [draftDate, setDraftDate] = useState(defaultDate)
  const dateInputRef = useRef<HTMLInputElement | null>(null)

  const today = new Date().toISOString().slice(0, 10)

  const openNativeDatePicker = () => {
    const input = dateInputRef.current
    if (!input) {
      return
    }
    if (typeof input.showPicker === 'function') {
      input.showPicker()
      return
    }
    input.click()
  }

  return (
    <MobileShell>
      <ContentBlock className="gap-5 px-4 pt-0 pb-6">
        <header className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="h-auto p-0 font-mono text-[14px] font-medium text-[#101828] hover:bg-transparent"
          >
            <Link to="/goods">‹ 返回</Link>
          </Button>
          <h1 className="w-[120px] text-center font-mono text-[18px] leading-none font-semibold tracking-[-0.02em] text-[#101828]">
            新增商品
          </h1>
          <div className="h-5 w-[42px]" />
        </header>

        <motion.div
          variants={listVariants}
          initial="initial"
          animate="animate"
          className="flex flex-col gap-5"
        >
          <motion.section
            variants={itemVariants}
            className="flex flex-col gap-0.5"
          >
            <Mono className="text-[12px] font-semibold text-[#667085]">
              基础信息
            </Mono>
            {basicRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between border-b border-[#d9dee7] py-[14px]"
              >
                <span className="font-mono text-[14px] font-medium text-[#101828]">
                  {row.label}
                </span>
                <span
                  className={`font-mono text-[14px] ${
                    row.strong ? 'font-semibold' : 'font-medium'
                  } ${row.tone ?? 'text-[#667085]'}`}
                >
                  {row.value}
                </span>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setDraftDate(purchaseDate)
                setDateOpen(true)
              }}
              className="flex items-center justify-between border-b border-[#d9dee7] py-[14px] text-left"
            >
              <span className="font-mono text-[14px] font-medium text-[#101828]">
                购入日期
              </span>
              <span className="flex items-center gap-2 font-mono text-[14px] font-medium text-[#667085]">
                {purchaseDate}
                <ChevronRight className="size-4 text-[#667085]" />
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setDraftCategory(category)
                setCategoryOpen(true)
              }}
              className="flex items-center justify-between border-b border-[#d9dee7] py-[14px] text-left"
            >
              <span className="font-mono text-[14px] font-medium text-[#101828]">
                分类
              </span>
              <span className="flex items-center gap-2 font-mono text-[14px] font-medium text-[#667085]">
                {category}
                <ChevronRight className="size-4 text-[#667085]" />
              </span>
            </button>
          </motion.section>

          <motion.section
            variants={itemVariants}
            className="flex flex-col gap-0.5"
          >
            <Mono className="text-[12px] font-semibold text-[#667085]">
              补充信息
            </Mono>
            <div className="flex items-center justify-between border-b border-[#d9dee7] py-[14px]">
              <span className="font-mono text-[14px] font-medium text-[#101828]">
                备注
              </span>
              <span className="font-mono text-[14px] font-medium text-[#667085]">
                高频使用
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-[#d9dee7] py-[14px]">
              <span className="font-mono text-[14px] font-medium text-[#101828]">
                图片
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3">
              {['img1', 'img2', 'img3'].map((key) => (
                <div
                  key={key}
                  className="flex h-[76px] items-center justify-center border border-[#d9dee7] bg-[#eceff3]"
                >
                  <Image className="size-4 text-[#98a2b3]" />
                </div>
              ))}
            </div>
          </motion.section>

          <motion.section
            variants={itemVariants}
            className="flex flex-col gap-0.5"
          >
            <Mono className="text-[12px] font-semibold text-[#667085]">
              详情态扩展
            </Mono>
            <div className="flex items-center justify-between border-b border-[#d9dee7] py-[14px]">
              <span className="font-mono text-[14px] font-medium text-[#101828]">
                当前日均摊销
              </span>
              <span className="font-mono text-[14px] font-semibold text-[#111827]">
                ¥6.57 / day
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-[#d9dee7] py-[14px]">
              <span className="font-mono text-[14px] font-medium text-[#101828]">
                已持有天数
              </span>
              <span className="font-mono text-[14px] font-semibold text-[#101828]">
                365 DAYS
              </span>
            </div>
            <div className="space-y-2 pt-3">
              <p className="text-[12px] font-medium text-[#667085]">
                原始消费 / 日均摊销占比
              </p>
              <div className="flex h-2.5 overflow-hidden border border-[#d9dee7] bg-[#f1f3f5]">
                <div
                  className="h-full bg-[#101828]"
                  style={{ width: `${trendSegments[0]}%` }}
                />
                <div
                  className="h-full bg-[#98a2b3]"
                  style={{ width: `${trendSegments[1]}%` }}
                />
              </div>
            </div>
          </motion.section>

          <motion.section
            variants={itemVariants}
            className="flex flex-col gap-2 pt-1"
          >
            <Button className="h-11 justify-between border border-[#111827] bg-[#111827] px-[14px] text-[14px] text-white hover:bg-[#111827]/95">
              保存
              <Check className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="h-11 justify-between border-[#d9dee7] bg-white px-[14px] text-[14px] font-semibold text-[#101828] hover:bg-[#f8f9fb]"
            >
              编辑
              <SquarePen className="size-4" />
            </Button>
          </motion.section>
        </motion.div>

        <Dialog open={categoryOpen} onOpenChange={setCategoryOpen}>
          <DialogContent
            showCloseButton={false}
            className="max-w-[calc(100%-2rem)] gap-3 rounded-none border border-[#d9dee7] bg-white p-4 shadow-none sm:max-w-[370px]"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[18px] leading-tight font-semibold text-[#101828]">
                  选择分类
                </h2>
                <p className="pt-1 text-[12px] text-[#667085]">
                  用于统计分类消耗占比
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="mt-[-4px] mr-[-6px] rounded-none text-[#667085] hover:bg-transparent"
                onClick={() => setCategoryOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between bg-[#111827] px-[14px] py-3">
              <span className="text-[15px] font-semibold text-white">
                {draftCategory}
              </span>
              <span className="text-[11px] text-white">当前选择</span>
            </div>

            <div className="border border-[#d9dee7]">
              {categoryOptions.map((option, index) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDraftCategory(option)}
                  className={`flex w-full items-center justify-between px-[14px] py-3 text-left ${
                    index > 0 ? 'border-t border-[#d9dee7]' : ''
                  }`}
                >
                  <span className="text-[14px] font-medium text-[#101828]">
                    {option}
                  </span>
                  <ChevronRight className="size-4 text-[#667085]" />
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-11 border-[#d9dee7] bg-white text-[14px] font-semibold text-[#101828] hover:bg-[#f8f9fb]"
                onClick={() => setCategoryOpen(false)}
              >
                取消
              </Button>
              <Button
                className="h-11 border border-[#111827] bg-[#111827] text-[14px] font-semibold text-white hover:bg-[#111827]/95"
                onClick={() => {
                  setCategory(draftCategory)
                  setCategoryOpen(false)
                }}
              >
                确定
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={dateOpen} onOpenChange={setDateOpen}>
          <DialogContent
            showCloseButton={false}
            className="max-w-[calc(100%-2rem)] gap-3 rounded-none border border-[#d9dee7] bg-white p-4 shadow-none sm:max-w-[370px]"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[18px] leading-tight font-semibold text-[#101828]">
                  选择购入日期
                </h2>
                <p className="pt-1 text-[12px] text-[#667085]">
                  仅按日期计算，不考虑时分秒
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="mt-[-4px] mr-[-6px] rounded-none text-[#667085] hover:bg-transparent"
                onClick={() => setDateOpen(false)}
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="flex items-center justify-between bg-[#111827] px-[14px] py-3">
              <span className="text-[15px] font-semibold text-white">
                {draftDate}
              </span>
              <span className="text-[11px] text-white">当前选择</span>
            </div>

            <div className="border border-[#d9dee7]">
              <button
                type="button"
                onClick={() => setDraftDate(today)}
                className="flex w-full items-center justify-between px-[14px] py-3 text-left"
              >
                <span className="text-[14px] font-medium text-[#101828]">
                  今天
                </span>
                <span className="text-[14px] text-[#667085]">{today}</span>
              </button>
              <button
                type="button"
                onClick={openNativeDatePicker}
                className="flex w-full items-center justify-between border-t border-[#d9dee7] px-[14px] py-3 text-left"
              >
                <span className="text-[14px] font-medium text-[#101828]">
                  日期选择器
                </span>
                <CalendarDays className="size-4 text-[#667085]" />
              </button>
              <input
                ref={dateInputRef}
                type="date"
                value={draftDate}
                onChange={(event) => setDraftDate(event.target.value)}
                className="sr-only"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="h-11 border-[#d9dee7] bg-white text-[14px] font-semibold text-[#101828] hover:bg-[#f8f9fb]"
                onClick={() => setDateOpen(false)}
              >
                取消
              </Button>
              <Button
                className="h-11 border border-[#111827] bg-[#111827] text-[14px] font-semibold text-white hover:bg-[#111827]/95"
                onClick={() => {
                  setPurchaseDate(draftDate)
                  setDateOpen(false)
                }}
              >
                确定
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </ContentBlock>
    </MobileShell>
  )
}
