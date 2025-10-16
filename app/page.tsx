"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useQuiz } from "@/components/quiz/quiz-provider"

export default function StartPage() {
  const router = useRouter()
  const { email, setEmail, resetForNewRun } = useQuiz()

  useEffect(() => {
    // Reset transient state when landing on the start page
    resetForNewRun()
  }, [resetForNewRun])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    router.push("/quiz")
  }

  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-card">
        <CardHeader>
          <CardTitle className="text-pretty">Timed Quiz</CardTitle>
          <CardDescription>Enter your email to start a 30-minute, 15-question quiz.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-required="true"
              />
            </div>
            <Button type="submit" className="justify-center">
              Start Quiz
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
