"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function QuestionOverview({
  total,
  currentIndex,
  attempted,
  onJump,
  answers,
  visited,
}: {
  total: number
  currentIndex: number
  attempted: boolean[]
  onJump: (idx: number) => void
  answers: Record<number, string>
  visited: Record<number, boolean>
}) {
  return (
    <div className="grid grid-cols-5 gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const isCurrent = i === currentIndex
        const isAttempted = attempted[i]
        // visited status from the provider
        const isVisited = visited[i] === true
        return (
          <Button
            key={i}
            size="sm"
            variant={isAttempted ? "default" : "secondary"}
            className={cn(
              "h-8 text-xs",
              isAttempted 
                ? "bg-primary text-primary-foreground" 
                : isVisited 
                ? "bg-blue-100 dark:bg-blue-900/30 text-foreground border-blue-300 dark:border-blue-700" 
                : "bg-secondary text-secondary-foreground",
              isCurrent && "ring-2 ring-ring",
            )}
            onClick={() => onJump(i)}
            aria-label={`Go to question ${i + 1}`}
          >
            {i + 1}
          </Button>
        )
      })}
    </div>
  )
}
