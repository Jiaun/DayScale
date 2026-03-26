import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowDown, Search, Trash2 } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import { BottomNav } from '@/components/app/bottom-nav'
import {
  ContentBlock,
  MobileShell,
  Mono,
  PageTransition,
  SectionCard,
} from '@/components/app/mobile-shell'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  deleteExpenseRecord,
  goodsCategoryOptions,
  useExpenseAppData,
} from '@/lib/app-data'
import type { GoodsListItem } from '@/lib/expense-metrics'
import { itemVariants, listVariants } from '@/lib/motion/transitions'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/goods')({
  component: GoodsPage,
})

const sortOptions = [
  { key: 'daily', label: '日均摊销' },
  { key: 'date', label: '购买时间' },
  { key: 'price', label: '总价格' },
] as const

type SortKey = (typeof sortOptions)[number]['key']
type SortDirection = 'desc' | 'asc'
type CategoryId = (typeof goodsCategoryOptions)[number]['id']
type GoodsItem = GoodsListItem

const sortTransition = {
  duration: 0.28,
  ease: [0.22, 1, 0.36, 1],
} as const

const swipeTransition = {
  type: 'spring',
  stiffness: 420,
  damping: 36,
  mass: 0.72,
} as const

const deleteRevealWidth = 88

function getSortedGoodsItems(
  items: GoodsItem[],
  sortKey: SortKey,
  sortDirection: SortDirection,
) {
  const sorted = [...items].sort((left, right) => {
    if (sortKey === 'daily') {
      return right.dailyCost - left.dailyCost
    }

    if (sortKey === 'date') {
      return right.date.localeCompare(left.date)
    }

    const leftPrice = Number(left.price.replace(/[^\d]/g, ''))
    const rightPrice = Number(right.price.replace(/[^\d]/g, ''))
    return rightPrice - leftPrice
  })

  return sortDirection === 'desc' ? sorted : sorted.reverse()
}

function GoodsRow({
  item,
  isSwipeOpen,
  onOpenSwipe,
  onCloseSwipe,
  onDeleteRequest,
}: {
  item: GoodsItem
  isSwipeOpen: boolean
  onOpenSwipe: (id: GoodsItem['id']) => void
  onCloseSwipe: () => void
  onDeleteRequest: (item: GoodsItem) => void
}) {
  const navigate = useNavigate()
  const didDragRef = useRef(false)

  return (
    <motion.div
      layout
      variants={itemVariants}
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: -14,
      }}
      transition={{
        ...sortTransition,
        layout: sortTransition,
      }}
      className="overflow-hidden border-b border-[#d9dee7] bg-white last:border-none"
    >
      <div className="relative px-2 py-1">
        <div className="absolute inset-y-1 right-2 z-0 flex w-[88px] items-stretch">
          <button
            type="button"
            onClick={() => onDeleteRequest(item)}
            className="flex w-full items-center justify-center bg-[#d92d20] text-[13px] font-semibold text-white"
          >
            <Trash2 className="mr-1.5 size-4" />
            删除
          </button>
        </div>

        <motion.div
          drag="x"
          dragDirectionLock
          dragConstraints={{
            left: -deleteRevealWidth,
            right: 0,
          }}
          dragElastic={0.02}
          dragMomentum={false}
          dragTransition={{
            bounceStiffness: 520,
            bounceDamping: 34,
            power: 0.08,
            timeConstant: 120,
          }}
          animate={{
            x: isSwipeOpen ? -deleteRevealWidth : 0,
          }}
          transition={swipeTransition}
          onDragEnd={(_, info) => {
            didDragRef.current = Math.abs(info.offset.x) > 6

            const projectedOffset = info.offset.x + info.velocity.x * 0.08
            const shouldOpen =
              projectedOffset < -32 || (isSwipeOpen && projectedOffset < 28)

            if (!shouldOpen) {
              onCloseSwipe()
              return
            }

            onOpenSwipe(item.id)
          }}
          style={{ touchAction: 'pan-y' }}
          className="relative z-10 w-full bg-white will-change-transform"
        >
          <article
            onClick={() => {
              if (didDragRef.current) {
                didDragRef.current = false
                return
              }

              if (isSwipeOpen) {
                onCloseSwipe()
                return
              }

              navigate({
                to: '/new',
                search: {
                  mode: 'edit',
                  id: item.id,
                },
              })
            }}
            className="flex min-h-[96px] items-center gap-3 p-3 transition-colors"
          >
            <div className="flex size-16 shrink-0 items-center justify-center border border-[#d9dee7] bg-[#eceff3]">
              <Mono className="text-[11px] font-semibold text-[#667085]">
                IMG
              </Mono>
            </div>

            <div className="flex flex-1 flex-col gap-2">
              <div className="mb-1 flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <h2 className="text-[16px] leading-none font-semibold tracking-[-0.02em] text-[#1a1918]">
                    {item.name}
                  </h2>
                </div>
                <div className="flex flex-col items-end gap-0.5 text-right">
                  <p className="font-mono text-[16px] leading-none font-bold text-[#1a1918]">
                    {item.price}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#d9dee7] pt-3">
                <p className="text-[12px] font-medium text-[#6d6c6a]">
                  {item.category} · 已持有 {item.daysHeld}
                </p>
                <p className={cn('font-mono text-[13px] font-bold', item.tone)}>
                  {item.daily}
                </p>
              </div>
            </div>
          </article>
        </motion.div>
      </div>
    </motion.div>
  )
}

function GoodsPage() {
  const navigate = useNavigate()
  const { goodsItems } = useExpenseAppData()
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<CategoryId>('all')
  const [sortKey, setSortKey] = useState<SortKey>('daily')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<GoodsItem | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filteredGoodsItems = goodsItems.filter((item) => {
    if (selectedCategoryId === 'all') {
      return true
    }

    const selectedCategory = goodsCategoryOptions.find(
      (category) => category.id === selectedCategoryId,
    )

    return item.category === selectedCategory?.name
  })

  const sortedGoodsItems = getSortedGoodsItems(
    filteredGoodsItems,
    sortKey,
    sortDirection,
  )

  useEffect(() => {
    if (
      swipedItemId &&
      !sortedGoodsItems.some((item) => item.id === swipedItemId)
    ) {
      setSwipedItemId(null)
    }
  }, [sortedGoodsItems, swipedItemId])

  const handleSortChange = (nextSortKey: SortKey) => {
    setSwipedItemId(null)

    if (nextSortKey === sortKey) {
      setSortDirection((currentDirection) =>
        currentDirection === 'desc' ? 'asc' : 'desc',
      )
      return
    }

    setSortKey(nextSortKey)
    setSortDirection('desc')
  }

  return (
    <MobileShell>
      <PageTransition>
        <ContentBlock className="gap-4 px-4 pt-0 pb-4">
          <header className="space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-[26px] leading-none font-semibold tracking-[-0.03em] text-[#1a1918]">
                商品列表
              </h1>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9c9b99]" />
              <Input
                value=""
                readOnly
                className="h-10 rounded-none border-[#d9dee7] bg-white pl-9 text-[13px] font-medium text-[#9c9b99]"
                placeholder="搜索名称 "
              />
            </div>
          </header>

          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold text-[#667085]">消费分类</p>
            <Mono className="text-[11px] font-semibold text-[#667085]">
              CLASSIFY
            </Mono>
          </div>
          <div className="flex items-center gap-2 overflow-y-auto">
            {goodsCategoryOptions.map((category) => {
              const Icon = category.icon
              const active = category.id === selectedCategoryId

              return (
                <Button
                  key={category.id}
                  variant={active ? 'default' : 'outline'}
                  onClick={() => {
                    setSelectedCategoryId(category.id)
                    setSwipedItemId(null)
                  }}
                  className={cn(
                    'h-[30px] rounded-none border px-[10px] text-[12px] transition-colors duration-200',
                    active
                      ? 'border-[#1a1918] bg-[#1a1918] font-semibold text-white hover:bg-[#1a1918]/95'
                      : 'border-[#d1d0cd] bg-white font-medium text-[#6d6c6a] hover:bg-[#efeee9]',
                  )}
                >
                  <Icon className="size-3.5" />
                  {category.name}
                </Button>
              )
            })}
          </div>

          <div className="flex flex-col gap-2 border-b border-[#d9dee7] pb-2.5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold text-[#667085]">
                排序方式
              </p>
              <Mono className="text-[11px] font-semibold text-[#667085]">
                SORT
              </Mono>
            </div>
            <div className="flex items-center gap-2">
              {sortOptions.map((option) => {
                const active = option.key === sortKey

                return (
                  <Button
                    key={option.key}
                    variant={active ? 'default' : 'outline'}
                    onClick={() => handleSortChange(option.key)}
                    className={cn(
                      'h-8 flex-1 rounded-none border text-[11px] transition-colors duration-200',
                      active
                        ? 'border-[#111827] bg-[#111827] font-semibold text-white hover:bg-[#111827]/95'
                        : 'border-[#d9dee7] bg-white font-medium text-[#667085] hover:bg-[#f8fafc]',
                    )}
                  >
                    {option.label}
                    {active ? (
                      <motion.span
                        initial={false}
                        animate={{
                          rotate: sortDirection === 'desc' ? 0 : 180,
                        }}
                        transition={sortTransition}
                        className="inline-flex"
                      >
                        <ArrowDown className="size-3" />
                      </motion.span>
                    ) : null}
                  </Button>
                )
              })}
            </div>
          </div>

          <SectionCard className="overflow-hidden">
            <motion.div
              variants={listVariants}
              initial="initial"
              animate="animate"
              layout
            >
              {sortedGoodsItems.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center"
                >
                  <p className="text-[15px] font-semibold text-[#101828]">
                    暂无商品
                  </p>
                  <p className="text-[12px] text-[#667085]">
                    去新增页创建第一条记录，再回来查看列表、排序和统计。
                  </p>
                  <Button
                    type="button"
                    onClick={() =>
                      navigate({
                        to: '/new',
                        search: {
                          mode: 'create',
                        },
                      })
                    }
                    className="mt-2 h-9 rounded-none bg-[#111827] px-4 text-[13px] font-semibold text-white hover:bg-[#111827]/95"
                  >
                    去新增
                  </Button>
                </motion.div>
              ) : (
                <AnimatePresence initial={false} mode="popLayout">
                  {sortedGoodsItems.map((item) => (
                    <GoodsRow
                      key={item.id}
                      item={item}
                      isSwipeOpen={swipedItemId === item.id}
                      onOpenSwipe={setSwipedItemId}
                      onCloseSwipe={() => setSwipedItemId(null)}
                      onDeleteRequest={(target) => {
                        setSwipedItemId(null)
                        setDeleteTarget(target)
                      }}
                    />
                  ))}
                </AnimatePresence>
              )}
            </motion.div>
          </SectionCard>
        </ContentBlock>
      </PageTransition>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null)
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="max-w-[calc(100%-2rem)] gap-3 rounded-none border border-[#d9dee7] bg-white p-4 shadow-none sm:max-w-[360px]"
        >
          <DialogHeader className="gap-1">
            <DialogTitle className="text-[18px] font-semibold text-[#101828]">
              确认删除商品
            </DialogTitle>
            <DialogDescription className="text-[12px] text-[#667085]">
              删除后将从当前列表中移除，操作不可撤销。
            </DialogDescription>
          </DialogHeader>

          <div className="border border-[#d9dee7] bg-[#f8fafc] px-3 py-3">
            <p className="text-[14px] font-semibold text-[#101828]">
              {deleteTarget?.name}
            </p>
            <p className="mt-1 text-[12px] text-[#667085]">
              {deleteTarget?.category} · {deleteTarget?.price}
            </p>
          </div>

          <DialogFooter className="grid grid-cols-2 gap-2 sm:flex-none">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-none border-[#d9dee7] bg-white text-[14px] font-semibold text-[#101828] hover:bg-[#f8f9fb]"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              取消
            </Button>
            <Button
              type="button"
              className="h-11 rounded-none border border-[#d92d20] bg-[#d92d20] text-[14px] font-semibold text-white hover:bg-[#b42318]"
              onClick={async () => {
                if (!deleteTarget) {
                  return
                }

                setDeleting(true)
                try {
                  await deleteExpenseRecord(deleteTarget.id)
                  setDeleteTarget(null)
                } finally {
                  setDeleting(false)
                }
              }}
              disabled={deleting}
            >
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav active="/goods" />
    </MobileShell>
  )
}
