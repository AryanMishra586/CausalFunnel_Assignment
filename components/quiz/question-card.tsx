"use client"

import { useEffect } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { QuizQuestion } from "@/lib/quiz-types"

export function QuestionCard({
  question,
  selected,
  onSelect,
  onVisited,
}: {
  question: QuizQuestion
  selected?: string
  onSelect: (value: string) => void
  onVisited?: () => void
}) {
  useEffect(() => {
    onVisited?.()
  }, [onVisited])

  return (
    <div className="grid gap-4">
      <div className="text-pretty">{question.question}</div>
      <RadioGroup
        value={selected ?? ""}
        onValueChange={(v) => onSelect(v)}
        aria-label="Select an answer"
        className="grid gap-2"
      >
        {question.options.map((opt, idx) => {
          const id = `opt-${question.id}-${idx}`
          return (
            <Label
              key={id}
              htmlFor={id}
              className="flex items-center gap-3 rounded-md border p-3 hover:bg-accent transition-colors cursor-pointer"
            >
              <RadioGroupItem id={id} value={opt} />
              <span className="w-full">
                {opt}
              </span>
            </Label>
          )
        })}
      </RadioGroup>
    </div>
  )
}
