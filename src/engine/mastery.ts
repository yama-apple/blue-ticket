import type { MasteryRecord, MasteryLevel } from '../types'

const SRS_INTERVALS: Record<MasteryLevel, number> = {
  unlearned: 0,
  learning: 1 * 24 * 60 * 60 * 1000,      // 1 day
  needs_review: 2 * 24 * 60 * 60 * 1000,   // 2 days
  learned: 7 * 24 * 60 * 60 * 1000,        // 7 days
  mastered: 30 * 24 * 60 * 60 * 1000,      // 30 days
}

export function createInitialMastery(violationId: string): MasteryRecord {
  return {
    violation_id: violationId,
    level: 'unlearned',
    correct_count: 0,
    wrong_count: 0,
    streak: 0,
    last_answered_at: null,
    next_review_at: null,
    avg_response_time_ms: 0,
  }
}

export function updateMastery(
  record: MasteryRecord,
  isCorrect: boolean,
  responseTimeMs: number
): MasteryRecord {
  const now = new Date().toISOString()
  const newCorrect = record.correct_count + (isCorrect ? 1 : 0)
  const newWrong = record.wrong_count + (isCorrect ? 0 : 1)
  const newStreak = isCorrect ? record.streak + 1 : 0
  const totalAnswers = newCorrect + newWrong
  const newAvgTime = record.avg_response_time_ms === 0
    ? responseTimeMs
    : Math.round((record.avg_response_time_ms * (totalAnswers - 1) + responseTimeMs) / totalAnswers)

  const newLevel = calculateLevel(newCorrect, newWrong, newStreak, newAvgTime, record.level, isCorrect)
  const nextReview = calculateNextReview(newLevel, now)

  return {
    ...record,
    level: newLevel,
    correct_count: newCorrect,
    wrong_count: newWrong,
    streak: newStreak,
    last_answered_at: now,
    next_review_at: nextReview,
    avg_response_time_ms: newAvgTime,
  }
}

function calculateLevel(
  correct: number,
  wrong: number,
  streak: number,
  avgTime: number,
  currentLevel: MasteryLevel,
  lastCorrect: boolean
): MasteryLevel {
  const accuracy = correct / Math.max(correct + wrong, 1)
  const isFast = avgTime < 8000 // under 8 seconds is "fast"

  if (!lastCorrect) {
    // Wrong answer: potentially downgrade
    if (currentLevel === 'mastered') return 'needs_review'
    if (currentLevel === 'learned') return 'needs_review'
    if (currentLevel === 'needs_review') return 'learning'
    return currentLevel
  }

  // Correct answer: potentially upgrade
  switch (currentLevel) {
    case 'unlearned':
      return 'learning'
    case 'learning':
      if (streak >= 2) return 'needs_review'
      return 'learning'
    case 'needs_review':
      if (streak >= 2 && accuracy >= 0.7) return 'learned'
      return 'needs_review'
    case 'learned':
      if (streak >= 3 && accuracy >= 0.85 && isFast) return 'mastered'
      return 'learned'
    case 'mastered':
      return 'mastered'
  }
}

function calculateNextReview(level: MasteryLevel, now: string): string | null {
  const interval = SRS_INTERVALS[level]
  if (interval === 0) return null
  return new Date(new Date(now).getTime() + interval).toISOString()
}

export function getDueForReview(mastery: Record<string, MasteryRecord>): string[] {
  const now = Date.now()
  return Object.values(mastery)
    .filter(m => {
      if (m.level === 'unlearned') return false
      if (!m.next_review_at) return false
      return new Date(m.next_review_at).getTime() <= now
    })
    .sort((a, b) => {
      const aTime = a.next_review_at ? new Date(a.next_review_at).getTime() : Infinity
      const bTime = b.next_review_at ? new Date(b.next_review_at).getTime() : Infinity
      return aTime - bTime
    })
    .map(m => m.violation_id)
}

export function getWeakViolations(mastery: Record<string, MasteryRecord>): string[] {
  return Object.values(mastery)
    .filter(m => {
      const total = m.correct_count + m.wrong_count
      if (total < 2) return false
      const accuracy = m.correct_count / total
      return accuracy < 0.6 || m.level === 'needs_review' || m.level === 'learning'
    })
    .sort((a, b) => {
      const aAcc = a.correct_count / Math.max(a.correct_count + a.wrong_count, 1)
      const bAcc = b.correct_count / Math.max(b.correct_count + b.wrong_count, 1)
      return aAcc - bAcc
    })
    .map(m => m.violation_id)
}

export function getMasteryStats(mastery: Record<string, MasteryRecord>) {
  const records = Object.values(mastery)
  const total = records.length
  const counts: Record<MasteryLevel, number> = {
    unlearned: 0,
    learning: 0,
    needs_review: 0,
    learned: 0,
    mastered: 0,
  }
  records.forEach(m => { counts[m.level]++ })

  return {
    total,
    ...counts,
    progress: total > 0 ? Math.round(((counts.learned + counts.mastered) / total) * 100) : 0,
    overall_accuracy: records.reduce((sum, m) => sum + m.correct_count, 0) /
      Math.max(records.reduce((sum, m) => sum + m.correct_count + m.wrong_count, 0), 1),
  }
}
