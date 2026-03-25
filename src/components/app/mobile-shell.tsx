import type { ReactNode } from 'react'

import { motion } from 'motion/react'

import { pageVariants } from '@/lib/motion/transitions'
import { cn } from '@/lib/utils'

export function MobileShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full justify-center bg-background">
      <main
        className={cn(
          'flex min-h-[874px] w-full max-w-[402px] flex-col overflow-hidden bg-background',
          className,
        )}
      >
        {children}
      </main>
    </div>
  )
}

export function PageTransition({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className={cn('flex flex-1 flex-col', className)}
    >
      {children}
    </motion.div>
  )
}

export function ContentBlock({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-1 flex-col gap-6 px-2 pt-8 pb-5', className)}>
      {children}
    </div>
  )
}

export function SectionCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('border border-[#d9dee7] bg-white', className)}>
      {children}
    </section>
  )
}

export function Mono({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span className={cn('font-mono tracking-[0.04em]', className)}>
      {children}
    </span>
  )
}
