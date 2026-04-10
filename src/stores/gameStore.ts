import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserProgress, Screen, Scenario, Violation, RankLevel, WrongAnswer, MasteryRecord } from '../types'
import { createInitialMastery, updateMastery, calculateReward, getRankForXp } from '../engine'

interface GameState {
  // Navigation
  screen: Screen
  previousScreen: Screen | null
  setScreen: (screen: Screen) => void
  goBack: () => void

  // App state
  isOnboarded: boolean
  setOnboarded: () => void
  appName: 'buster' | 'quest' | 'survival'
  setAppName: (name: 'buster' | 'quest' | 'survival') => void

  // Data
  violations: Violation[]
  scenarios: Scenario[]
  setData: (violations: Violation[], scenarios: Scenario[]) => void
  dataLoaded: boolean

  // Current game session
  currentScenarios: Scenario[]
  currentIndex: number
  sessionCorrect: number
  sessionStreak: number
  sessionStartTime: number | null
  questionStartTime: number | null
  lastReward: { xp: number; coins: number; badges: string[]; rankUp: boolean } | null
  selectedChoiceId: string | null
  showResult: boolean

  // Actions
  startSession: (scenarios: Scenario[]) => void
  selectChoice: (choiceId: string) => void
  confirmAnswer: () => void
  nextQuestion: () => void
  endSession: () => void

  // User progress (persisted)
  progress: UserProgress

  // Encyclopedia
  selectedViolationId: string | null
  setSelectedViolation: (id: string | null) => void

  // Weakness mode
  getWeakScenarios: () => Scenario[]
}

const initialProgress: UserProgress = {
  xp: 0,
  coins: 0,
  rank: 'beginner_rider',
  badges: [],
  streak_days: 0,
  last_play_date: null,
  total_correct: 0,
  total_answered: 0,
  daily_challenge_completed_dates: [],
  discovered_violation_ids: [],
  mastery: {},
  wrong_answers: [],
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Navigation
      screen: 'onboarding',
      previousScreen: null,
      setScreen: (screen) => set(state => ({
        screen,
        previousScreen: state.screen,
        showResult: false,
        selectedChoiceId: null,
      })),
      goBack: () => {
        const prev = get().previousScreen
        if (prev) set({ screen: prev, previousScreen: null })
      },

      // App state
      isOnboarded: false,
      setOnboarded: () => set({ isOnboarded: true, screen: 'home' }),
      appName: 'buster',
      setAppName: (name) => set({ appName: name }),

      // Data
      violations: [],
      scenarios: [],
      dataLoaded: false,
      setData: (violations, scenarios) => set({ violations, scenarios, dataLoaded: true }),

      // Session
      currentScenarios: [],
      currentIndex: 0,
      sessionCorrect: 0,
      sessionStreak: 0,
      sessionStartTime: null,
      questionStartTime: null,
      lastReward: null,
      selectedChoiceId: null,
      showResult: false,

      startSession: (scenarios) => set({
        currentScenarios: scenarios,
        currentIndex: 0,
        sessionCorrect: 0,
        sessionStreak: 0,
        sessionStartTime: Date.now(),
        questionStartTime: Date.now(),
        lastReward: null,
        selectedChoiceId: null,
        showResult: false,
        screen: 'scenario',
      }),

      selectChoice: (choiceId) => set({ selectedChoiceId: choiceId }),

      confirmAnswer: () => {
        const state = get()
        const scenario = state.currentScenarios[state.currentIndex]
        if (!scenario || !state.selectedChoiceId) return

        const isCorrect = state.selectedChoiceId === scenario.correct_choice_id
        const responseTime = state.questionStartTime ? Date.now() - state.questionStartTime : 10000
        const newStreak = isCorrect ? state.sessionStreak + 1 : 0
        const isLastQuestion = state.currentIndex >= state.currentScenarios.length - 1
        const isDailyComplete = isLastQuestion && state.screen === 'daily'

        // Update mastery for linked violations
        const newMastery = { ...state.progress.mastery }
        for (const vid of scenario.linked_violation_ids) {
          const record = newMastery[vid] || createInitialMastery(vid)
          newMastery[vid] = updateMastery(record, isCorrect, responseTime)
        }

        // Calculate reward
        const reward = calculateReward(state.progress, isCorrect, responseTime, newStreak, isDailyComplete)

        // Update discovered violations
        const discovered = new Set(state.progress.discovered_violation_ids)
        scenario.linked_violation_ids.forEach(id => discovered.add(id))

        // Track wrong answers
        const wrongAnswers = [...state.progress.wrong_answers]
        if (!isCorrect) {
          const existing = wrongAnswers.find(w => w.scenario_id === scenario.id)
          if (existing) {
            existing.times_wrong++
            existing.answered_at = new Date().toISOString()
            existing.chosen_choice_id = state.selectedChoiceId
          } else {
            wrongAnswers.push({
              scenario_id: scenario.id,
              violation_ids: scenario.linked_violation_ids,
              answered_at: new Date().toISOString(),
              chosen_choice_id: state.selectedChoiceId,
              times_wrong: 1,
            })
          }
        }

        // Update daily streak
        const today = new Date().toISOString().split('T')[0]
        let streakDays = state.progress.streak_days
        const lastDate = state.progress.last_play_date
        if (lastDate !== today) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
          streakDays = lastDate === yesterday ? streakDays + 1 : 1
        }

        const newXp = state.progress.xp + reward.xp_earned
        const newRank = getRankForXp(newXp)

        const dailyDates = [...state.progress.daily_challenge_completed_dates]
        if (isDailyComplete && !dailyDates.includes(today)) {
          dailyDates.push(today)
        }

        set({
          showResult: true,
          sessionCorrect: state.sessionCorrect + (isCorrect ? 1 : 0),
          sessionStreak: newStreak,
          lastReward: {
            xp: reward.xp_earned,
            coins: reward.coins_earned,
            badges: reward.new_badges,
            rankUp: reward.rank_up,
          },
          progress: {
            ...state.progress,
            xp: newXp,
            coins: state.progress.coins + reward.coins_earned,
            rank: newRank,
            badges: [...new Set([...state.progress.badges, ...reward.new_badges])],
            streak_days: streakDays,
            last_play_date: today,
            total_correct: state.progress.total_correct + (isCorrect ? 1 : 0),
            total_answered: state.progress.total_answered + 1,
            daily_challenge_completed_dates: dailyDates,
            discovered_violation_ids: [...discovered],
            mastery: newMastery,
            wrong_answers: wrongAnswers,
          },
        })
      },

      nextQuestion: () => {
        const state = get()
        const nextIdx = state.currentIndex + 1
        if (nextIdx >= state.currentScenarios.length) {
          set({ screen: 'result', showResult: false, selectedChoiceId: null })
        } else {
          set({
            currentIndex: nextIdx,
            questionStartTime: Date.now(),
            showResult: false,
            selectedChoiceId: null,
            lastReward: null,
          })
        }
      },

      endSession: () => set({
        screen: 'home',
        currentScenarios: [],
        currentIndex: 0,
        sessionCorrect: 0,
        sessionStreak: 0,
        lastReward: null,
        showResult: false,
        selectedChoiceId: null,
      }),

      // Progress
      progress: initialProgress,

      // Encyclopedia
      selectedViolationId: null,
      setSelectedViolation: (id) => set({
        selectedViolationId: id,
        screen: id ? 'encyclopedia_detail' : 'encyclopedia',
      }),

      // Weakness
      getWeakScenarios: () => {
        const state = get()
        const wrongIds = state.progress.wrong_answers.map(w => w.scenario_id)
        return state.scenarios.filter(s => wrongIds.includes(s.id))
      },
    }),
    {
      name: 'blue-ticket-game',
      partialize: (state) => ({
        isOnboarded: state.isOnboarded,
        appName: state.appName,
        progress: state.progress,
      }),
    }
  )
)
