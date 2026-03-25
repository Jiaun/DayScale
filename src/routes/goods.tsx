import {createFileRoute} from '@tanstack/react-router'
import {ArrowDown, Search} from 'lucide-react'
import {motion} from 'motion/react'

import {BottomNav} from '@/components/app/bottom-nav'
import {
    ContentBlock,
    MobileShell,
    Mono,
    PageTransition,
    SectionCard,
} from '@/components/app/mobile-shell'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {goodsCategories, goodsItems} from '@/lib/app-data'
import {itemVariants, listVariants} from '@/lib/motion/transitions'
import {cn} from '@/lib/utils'

export const Route = createFileRoute('/goods')({
    component: GoodsPage,
})

function GoodsPage() {
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
                            <Search
                                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9c9b99]"/>
                            <Input
                                value=""
                                readOnly
                                className="h-10 rounded-none border-[#d9dee7] bg-white pl-9 text-[13px] font-medium text-[#9c9b99]"
                                placeholder="搜索名称 "
                            />
                        </div>
                    </header>


                    <div className="flex items-center justify-between">
                        <p className="text-[11px] font-semibold text-[#667085]">
                            排序方式
                        </p>
                        <Mono className="text-[11px] font-semibold text-[#667085]">
                            SORT
                        </Mono>
                    </div>
                    <div className="flex items-center gap-2">
                        {goodsCategories.map((category, index) => (
                            <Button
                                key={category}
                                variant={index === 0 ? 'default' : 'outline'}
                                className={cn(
                                    'h-[30px] rounded-none border px-[10px] text-[12px]',
                                    index === 0
                                        ? 'border-[#1a1918] bg-[#1a1918] font-semibold text-white hover:bg-[#1a1918]/95'
                                        : 'border-[#d1d0cd]  bg-white font-medium text-[#6d6c6a] hover:bg-[#efeee9]',
                                )}
                            >
                                {category}
                            </Button>
                        ))}
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
                            <Button
                                className="h-8 flex-1 rounded-none bg-[#111827] text-[11px] font-semibold text-white hover:bg-[#111827]/95">
                                日均摊销
                                <ArrowDown className="size-3"/>
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 flex-1 rounded-none border-[#d9dee7] bg-white text-[11px] font-medium text-[#667085] hover:bg-[#f8fafc]"
                            >
                                购买时间
                            </Button>
                            <Button
                                variant="outline"
                                className="h-8 flex-1 rounded-none border-[#d9dee7] bg-white text-[11px] font-medium text-[#667085] hover:bg-[#f8fafc]"
                            >
                                总价格
                            </Button>
                        </div>
                    </div>

                    <SectionCard className="overflow-hidden">
                        <motion.div
                            variants={listVariants}
                            initial="initial"
                            animate="animate"
                        >
                            {goodsItems.map((item) => (
                                <motion.article
                                    key={item.name}
                                    variants={itemVariants}
                                    className="flex h-[74px] items-center justify-between border-b border-[#d9dee7] px-[10px] py-3 last:border-none"
                                >
                                    <div className="w-[170px] space-y-1.5">
                                        <h2 className="text-[15px] leading-none font-semibold tracking-[-0.02em] text-[#1a1918]">
                                            {item.name}
                                        </h2>
                                        <p className="text-[11px] font-medium text-[#6d6c6a]">
                                            {item.category} · {item.days}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5 text-right">
                                        <p className="text-[14px] leading-none font-semibold tracking-[-0.02em] text-[#1a1918]">
                                            {item.price}
                                        </p>
                                        <p
                                            className={cn(
                                                'text-[11px] font-medium',
                                                item.tone.includes('emerald')
                                                    ? 'text-[#3d8a5a]'
                                                    : 'text-[#d89575]',
                                            )}
                                        >
                                            {item.date} · {item.daily}
                                        </p>
                                    </div>
                                </motion.article>
                            ))}
                        </motion.div>
                    </SectionCard>
                </ContentBlock>
            </PageTransition>
            <BottomNav active="/goods"/>
        </MobileShell>
    )
}
