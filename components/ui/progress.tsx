"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"     // Updated

import { cn } from "@/lib/utils"

const progressVariants = cva(                         // Updated
  "h-full w-full flex-1 bg-primary transition-all",
  {
    variants: {
      variant: {
        default: "bg-sky-600",
        success: "bg-emerald-700",
      },
    },
    defaultVariants: {
      variant: "default",
    }
  }
)

// Define new props for progressVariants
export interface ProgressProps                    // Updated
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {}

type CombinedProgressProps = ProgressProps & React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>    // Updated

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  CombinedProgressProps                             // Updated
>(({ className, value,variant, ...props }, ref) => (            // Updated: variant
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(progressVariants({ variant }))}     // Updated
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
