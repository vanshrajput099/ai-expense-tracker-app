"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  progressValue,
  ...props
}) {

  const getProgressColor = (progressValue) => {
    if (value >= 90) return "bg-red-600";
    else if (value >= 65) return "bg-yellow-500";
    else return "bg-purple-600";
  };

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}>
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={`bg-primary h-full w-full flex-1 transition-all ${getProgressColor()} `}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
    </ProgressPrimitive.Root>
  );
}

export { Progress }
