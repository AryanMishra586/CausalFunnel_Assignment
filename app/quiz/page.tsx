"use client"

import useSWR from "swr"
import { useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuiz } from "@/components/quiz/quiz-provider"
import { decodeHtml, shuffleArray } from "@/lib/quiz-utils"
import type { RawAPIResponse, QuizQuestion } from "@/lib/quiz-types"
import { Timer } from "@/components/quiz/timer"
import { QuestionCard } from "@/components/quiz/question-card"
import { QuestionOverview } from "@/components/quiz/question-overview"
import { cn } from "@/lib/utils"

const fetcher = async (url: string): Promise<RawAPIResponse> => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to fetch questions")
  return res.json()
}

export default function QuizPage() {
  const router = useRouter()
  const {
    hydrated,
    email,
    questions,
    setQuestions,
    answers,
    selectAnswer,
    currentIndex,
    goTo,
    markVisited,
    visited,
    startTime,
    ensureStarted,
    submitQuiz,
    submitted,
    durationSeconds,
  } = useQuiz()

  // Redirect back if no email
  useEffect(() => {
    if (!hydrated) return
    if (!email) router.replace("/")
  }, [hydrated, email, router])

  // Ensure timer started
  useEffect(() => {
    ensureStarted()
  }, [ensureStarted])

  // Fetch only if we don't already have questions
  const shouldFetch = questions.length === 0
  const { data, error, isLoading } = useSWR<RawAPIResponse>(shouldFetch ? "/api/questions?amount=15" : null, fetcher)

  // Normalize questions on initial fetch
  useEffect(() => {
    if (!data || !shouldFetch) return
    const normalized: QuizQuestion[] = data.results.map((q, idx) => {
      const correct = decodeHtml(q.correct_answer)
      const incorrects = q.incorrect_answers.map((a) => decodeHtml(a))
      const options = shuffleArray([correct, ...incorrects])
      return {
        id: idx,
        question: decodeHtml(q.question),
        options,
        correctAnswer: correct,
        type: q.type,
        category: q.category,
        difficulty: q.difficulty,
      }
    })
    setQuestions(normalized)
  }, [data, setQuestions, shouldFetch])

  // Mark visited when index changes
  useEffect(() => {
    if (questions.length > 0) {
      markVisited(currentIndex)
    }
  }, [currentIndex, questions.length, markVisited])

  // Debug logs to verify data flow
  useEffect(() => {
    if (data) console.log("[v0] SWR data received:", Array.isArray(data.results) ? data.results.length : "no results")
    if (error) console.log("[v0] SWR error:", (error as Error)?.message)
  }, [data, error])

  const attempted = useMemo(() => {
    return questions.map((q) => Boolean(answers[q.id]))
  }, [questions, answers])

  function handlePrev() {
    if (currentIndex > 0) goTo(currentIndex - 1)
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) goTo(currentIndex + 1)
  }

  function handleSubmit() {
    submitQuiz()
    router.push("/report")
  }

  if (error) {
    return (
      <main className="min-h-dvh p-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Unable to load quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please refresh to try again.</p>
          </CardContent>
        </Card>
      </main>
    )
  }

  const isReady = questions.length > 0 && Boolean(startTime)
  const q = isReady ? questions[currentIndex] : null
  const handleSelect = useCallback(
    (val: string) => {
      if (!q) return
      selectAnswer(q.id, val)
    },
    [selectAnswer, q],
  )

  const handleVisited = useCallback(() => {
    if (!q) return
    markVisited(q.id)
  }, [markVisited, q])

  return (
    <main className="min-h-dvh p-4 md:p-6">
      <div className="mx-auto max-w-5xl grid gap-4 md:gap-6">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-pretty">Quiz</h1>
            <p className="text-sm text-muted-foreground">Email: {email || "—"}</p>
          </div>
          <div className="w-full md:w-auto">
            {isReady ? (
              <Timer
                startTimeMs={startTime!}
                durationSeconds={durationSeconds}
                onExpire={() => {
                  if (!submitted) {
                    submitQuiz()
                    router.push("/report")
                  }
                }}
              />
            ) : (
              <div className="text-sm text-muted-foreground">Preparing questions…</div>
            )}
          </div>
        </header>

        <div className="grid md:grid-cols-[260px,1fr] gap-4 md:gap-6">
          <aside className="md:sticky md:top-4 h-max">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <QuestionOverview
                  total={questions.length || 15}
                  currentIndex={currentIndex}
                  attempted={attempted}
                  onJump={(idx) => goTo(idx)}
                  answers={answers}
                  visited={visited}
                />
                <div className="grid grid-cols-3 gap-1.5 text-[10px] text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block size-2.5 rounded bg-secondary border border-border" aria-hidden /> Not
                    visited
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block size-2.5 rounded bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700" aria-hidden /> Visited
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block size-2.5 rounded bg-primary" aria-hidden /> Attempted
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          <section className="grid gap-3">
            <Card className={cn("transition-opacity duration-300")}>
              <CardHeader>
                <CardTitle className="text-base">
                  {isLoading && !q ? "Loading question…" : `Question ${currentIndex + 1} of ${questions.length || 15}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {q ? (
                  <QuestionCard
                    question={q}
                    selected={answers[q.id]}
                    onSelect={handleSelect}
                    onVisited={handleVisited}
                  />
                ) : (
                  <p className="text-muted-foreground text-sm">{isLoading ? "Please wait…" : "Initializing…"}</p>
                )}
              </CardContent>
            </Card>

            <div className="flex items-center justify-between gap-3">
              <Button 
                variant="secondary" 
                onClick={handlePrev} 
                disabled={currentIndex === 0}
                className="transition-all hover:scale-105 hover:shadow-md"
              >
                Previous
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={handleNext}
                  disabled={currentIndex >= Math.max(0, questions.length - 1)}
                  className="transition-all hover:scale-105 hover:shadow-md"
                >
                  Next
                </Button>
                <Button onClick={handleSubmit} disabled={!isReady}>
                  Submit
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
