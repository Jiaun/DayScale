import * as React from 'react'
import { Label } from 'radix-ui'

import { cn } from '@/lib/utils'

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label.Root>) {
  return (
    <Label.Root
      data-slot="label"
      className={cn(
        'flex items-center text-sm font-medium text-foreground leading-none',
        className,
      )}
      {...props}
    />
  )
}

export { FormLabel as Label }
