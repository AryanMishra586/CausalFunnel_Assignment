"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import type { QuizQuestion } from "@/lib/quiz-types"

type QuizState = {
  email: string
  questions: QuizQuestion[]
  answers: Record<number, string>
  visited: Record<number, boolean>
  currentIndex: number
  startTime: number | null
  submitted: boolean
  durationSeconds: number
  hydrated: boolean
}

type QuizContextType = QuizState & {
  setEmail: (email: string) => void
  setQuestions: (qs: QuizQuestion[]) => void
  selectAnswer: (qid: number, value: string) => void
  goTo: (index: number) => void
  markVisited: (index: number) => void
  ensureStarted: () => void
  submitQuiz: () => void
  computeScore: () => { correctCount: number; wrongCount: number; total: number }
  resetForNewRun: () => void
}

const LS_KEY = "quiz-state-v1"
const DEFAULT_DURATION = 30 * 60 // 30 minutes

const QuizContext = createContext<QuizContextType | null>(null)

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<QuizState>(() => ({
    email: "",
    questions: [],
    answers: {},
    visited: {},
    currentIndex: 0,
    startTime: null,
    submitted: false,
    durationSeconds: DEFAULT_DURATION,
    hydrated: false,
  }))

  // Hydrate from localStorage
  const hasHydrated = useRef(false)
  useEffect(() => {
    if (hasHydrated.current) return
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as QuizState
        const idx = Math.min(Math.max(parsed.currentIndex ?? 0, 0), Math.max((parsed.questions?.length ?? 1) - 1, 0))
        setState({
          ...parsed,
          currentIndex: idx,
          durationSeconds: parsed.durationSeconds || DEFAULT_DURATION,
          hydrated: true,
        })
        return
      }
    } catch {
      // ignore
    } finally {
      hasHydrated.current = true
      setState((s) => ({ ...s, hydrated: true }))
    }
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (!hasHydrated.current) return
    localStorage.setItem(LS_KEY, JSON.stringify(state))
  }, [state])

  const setEmail = useCallback((email: string) => setState((s) => ({ ...s, email })), [])
  const setQuestions = useCallback(
    (qs: QuizQuestion[]) =>
      setState((s) => ({
        ...s,
        questions: qs,
        answers: {},
        visited: {},
        currentIndex: 0,
        submitted: false,
      })),
    [],
  )
  const selectAnswer = useCallback((qid: number, value: string) => {
    setState((s) => ({
      ...s,
      answers: { ...s.answers, [qid]: value },
    }))
  }, [])
  const goTo = useCallback((index: number) => {
    setState((s) => ({
      ...s,
      currentIndex: Math.min(Math.max(index, 0), Math.max(s.questions.length - 1, 0)),
    }))
  }, [])
  const markVisited = useCallback((index: number) => {
    setState((s) => ({
      ...s,
      visited: { ...s.visited, [index]: true },
    }))
  }, [])
  const ensureStarted = useCallback(() => {
    setState((s) => (s.startTime ? s : { ...s, startTime: Date.now() }))
  }, [])
  const submitQuiz = useCallback(() => {
    setState((s) => ({ ...s, submitted: true }))
  }, [])
  const computeScore = useCallback(() => {
    const total = state.questions.length
    let correctCount = 0
    state.questions.forEach((q) => {
      const user = state.answers[q.id]
      if (user && user === q.correctAnswer) correctCount++
    })
    return { correctCount, wrongCount: Math.max(total - correctCount, 0), total }
  }, [state.questions, state.answers])

  const resetForNewRun = useCallback(() => {
    setState({
      email: "",
      questions: [],
      answers: {},
      visited: {},
      currentIndex: 0,
      startTime: null,
      submitted: false,
      durationSeconds: DEFAULT_DURATION,
      hydrated: false,
    })
  }, [])

  const value = useMemo<QuizContextType>(
    () => ({
      ...state,
      setEmail,
      setQuestions,
      selectAnswer,
      goTo,
      markVisited,
      ensureStarted,
      submitQuiz,
      computeScore,
      resetForNewRun,
    }),
    [
      state,
      setEmail,
      setQuestions,
      selectAnswer,
      goTo,
      markVisited,
      ensureStarted,
      submitQuiz,
      computeScore,
      resetForNewRun,
    ],
  )

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

export function useQuiz() {
  const ctx = useContext(QuizContext)
  if (!ctx) {
    throw new Error("useQuiz must be used within <QuizProvider>. Add it in the relevant page.")
  }
  return ctx
}
