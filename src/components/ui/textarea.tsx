import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex field-sizing-content min-h-[100px] w-full rounded-2xl border bg-white/60 backdrop-blur-sm px-4 py-3 text-sm font-medium shadow-[0_1px_4px_rgba(0,0,0,0.03)] transition-all outline-none focus-visible:ring-[3px] focus-visible:bg-white focus-visible:shadow-sm disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
