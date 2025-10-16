"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useQuiz } from "@/components/quiz/quiz-provider"
import { cn } from "@/lib/utils"

export default function ReportPage() {
  const router = useRouter()
  const { email, questions, answers, submitted, computeScore, resetForNewRun } = useQuiz()

  useEffect(() => {
    // If no questions, return to start
    if (questions.length === 0) router.replace("/")
  }, [questions.length, router])

  const { correctCount, wrongCount, total } = useMemo(() => computeScore(), [computeScore])
  const scorePct = total > 0 ? Math.round((correctCount / total) * 100) : 0

  return (
    <main className="min-h-dvh p-4 md:p-6">
      <div className="mx-auto max-w-5xl grid gap-6">
        <header className="flex items-start md:items-center justify-between gap-3 flex-col md:flex-row">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-pretty">Report</h1>
            <p className="text-sm text-muted-foreground">Email: {email || "—"}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" aria-label={`Score ${scorePct} percent`}>
              Score: {scorePct}%
            </Badge>
            <Badge className="bg-primary text-primary-foreground">Correct: {correctCount}</Badge>
            <Badge variant="destructive">Wrong: {wrongCount}</Badge>
          </div>
        </header>

        <section className="grid gap-4">
          {questions.map((q, idx) => {
            const userAns = answers[q.id]
            const isCorrect = userAns === q.correctAnswer
            return (
              <Card key={q.id} className="bg-card">
                <CardHeader>
                  <CardTitle className="text-base">
                    Q{idx + 1}. {q.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div
                      className={cn(
                        "p-3 rounded-md border",
                        isCorrect 
                          ? "bg-green-500/90 text-white border-green-600" 
                          : "bg-red-500/90 text-white border-red-600",
                      )}
                    >
                      <div className="text-xs text-white/80 mb-1">Your answer</div>
                      <div>{userAns ?? "—"}</div>
                    </div>
                    <div className="p-3 rounded-md border bg-green-500/90 text-white border-green-600">
                      <div className="text-xs text-white/80 mb-1">Correct answer</div>
                      <div>{q.correctAnswer}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>

        <div className="flex items-center justify-end">
          <Button
            onClick={() => {
              resetForNewRun()
              router.push("/")
            }}
          >
            Take Again
          </Button>
        </div>
      </div>
    </main>
  )
}
