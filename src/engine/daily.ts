import type { Scenario, MasteryRecord } from '../types'
import { getDueForReview, getWeakViolations } from './mastery'

const DAILY_QUESTION_COUNT = 5

function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
}

function seededRandom(seed: string): () => number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash |= 0
  }
  return () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff
    return hash / 0x7fffffff
  }
}

export function generateDailyChallenge(
  allScenarios: Scenario[],
  mastery: Record<string, MasteryRecord>,
  completedDates: string[]
): Scenario[] {
  const today = getTodayString()
  if (completedDates.includes(today)) return []

  const random = seededRandom(today)

  // Strategy: mix new, review, and weak items
  const dueIds = getDueForReview(mastery)
  const weakIds = getWeakViolations(mastery)

  const reviewScenarios = allScenarios.filter(s =>
    s.linked_violation_ids.some(id => dueIds.includes(id))
  )
  const weakScenarios = allScenarios.filter(s =>
    s.linked_violation_ids.some(id => weakIds.includes(id))
  )
  const unlearnedScenarios = allScenarios.filter(s =>
    s.linked_violation_ids.some(id => !mastery[id] || mastery[id].level === 'unlearned')
  )

  const selected: Scenario[] = []
  const usedIds = new Set<string>()

  // 1 review, 1 weak, 3 new/mixed
  const pickFrom = (pool: Scenario[], count: number) => {
    const shuffled = [...pool].sort(() => random() - 0.5)
    for (const s of shuffled) {
      if (selected.length >= DAILY_QUESTION_COUNT) break
      if (usedIds.has(s.id)) continue
      if (count <= 0) break
      selected.push(s)
      usedIds.add(s.id)
      count--
    }
  }

  pickFrom(reviewScenarios, 1)
  pickFrom(weakScenarios, 1)
  pickFrom(unlearnedScenarios, 2)

  // Fill remaining from all scenarios
  const remaining = allScenarios
    .filter(s => !usedIds.has(s.id))
    .sort(() => random() - 0.5)
  for (const s of remaining) {
    if (selected.length >= DAILY_QUESTION_COUNT) break
    selected.push(s)
  }

  return selected.sort(() => random() - 0.5)
}

export function isDailyChallengeAvailable(completedDates: string[]): boolean {
  return !completedDates.includes(getTodayString())
}

export function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0

  const sorted = [...completedDates].sort().reverse()
  const today = getTodayString()
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0

  let streak = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1])
    const curr = new Date(sorted[i])
    const diff = prev.getTime() - curr.getTime()
    if (diff <= 86400000 * 1.5 && diff > 0) {
      streak++
    } else {
      break
    }
  }
  return streak
}
