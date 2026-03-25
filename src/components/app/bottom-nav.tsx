import { ChartColumnBig, House, Plus, Rows3, User } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { motion } from 'motion/react'

import { cn } from '@/lib/utils'

const navItems = [
  { label: '首页', to: '/', icon: House },
  { label: '商品', to: '/goods', icon: Rows3 },
  { label: '新增', to: '/new', icon: Plus },
  { label: '统计', to: '/stats', icon: ChartColumnBig },
  { label: '我的', to: '/profile', icon: User },
] as const

export function BottomNav({
  active,
}: {
  active: (typeof navItems)[number]['to']
}) {
  return (
    <>
      <div aria-hidden="true" className="h-[74px]" />
      <nav className="fixed inset-x-0 bottom-0 z-50 flex justify-center">
        <div className="w-full border-t border-[#d9dee7] bg-white px-3 pt-2 pb-5">
          <div className="flex items-stretch justify-between gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = item.to === active

              return (
                <Link key={item.to} to={item.to} className="flex-1">
                  <motion.div
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 1 }}
                    className={cn(
                      'flex h-[54px] flex-col items-center justify-center gap-1 border text-[10px] font-medium transition-colors',
                      isActive
                        ? 'border-[#111827] bg-[#111827] text-white'
                        : 'border-transparent text-[#667085] hover:border-[#d9dee7] hover:bg-[#f8fafc] hover:text-[#101828]',
                    )}
                  >
                    <Icon className="size-[18px]" />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
