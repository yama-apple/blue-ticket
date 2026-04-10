import { describe, it, expect } from 'vitest'
import { calculateReward, getRankForXp, getRankProgress } from './rewards'
import type { UserProgress } from '../types'

const baseProgress: UserProgress = {
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

describe('calculateReward', () => {
  it('gives XP and coins for correct answer', () => {
    const result = calculateReward(baseProgress, true, 6000, 1, false)
    expect(result.xp_earned).toBe(10)
    expect(result.coins_earned).toBe(2)
  })

  it('gives bonus XP for fast answer', () => {
    const result = calculateReward(baseProgress, true, 3000, 1, false)
    expect(result.xp_earned).toBe(15)
  })

  it('gives no XP for wrong answer', () => {
    const result = calculateReward(baseProgress, false, 5000, 0, false)
    expect(result.xp_earned).toBe(0)
    expect(result.coins_earned).toBe(0)
  })

  it('gives streak bonus for consecutive correct', () => {
    const result = calculateReward(baseProgress, true, 6000, 3, false)
    expect(result.xp_earned).toBeGreaterThan(10) // base + streak bonus
    expect(result.streak_bonus).toBe(true)
  })

  it('gives daily completion bonus', () => {
    const result = calculateReward(baseProgress, true, 6000, 1, true)
    expect(result.xp_earned).toBe(60) // 10 + 50
    expect(result.coins_earned).toBe(22) // 2 + 20
  })

  it('awards first_10 badge when reaching 10 correct', () => {
    const progress = { ...baseProgress, total_correct: 9 }
    const result = calculateReward(progress, true, 6000, 1, false)
    expect(result.new_badges).toContain('first_10')
  })
})

describe('getRankForXp', () => {
  it('returns beginner for 0 XP', () => {
    expect(getRankForXp(0)).toBe('beginner_rider')
  })

  it('returns rule_graduate for 200+ XP', () => {
    expect(getRankForXp(200)).toBe('rule_graduate')
  })

  it('returns highest unlocked rank', () => {
    expect(getRankForXp(5000)).toBe('bicycle_safety_instructor')
  })
})

describe('getRankProgress', () => {
  it('shows 0 progress at start', () => {
    const info = getRankProgress(0)
    expect(info.current.level).toBe('beginner_rider')
    expect(info.next?.level).toBe('rule_graduate')
    expect(info.progress).toBe(0)
  })

  it('shows 100 at max rank', () => {
    const info = getRankProgress(5000)
    expect(info.current.level).toBe('bicycle_safety_instructor')
    expect(info.next).toBeNull()
    expect(info.progress).toBe(100)
  })

  it('shows partial progress', () => {
    const info = getRankProgress(100)
    expect(info.current.level).toBe('beginner_rider')
    expect(info.progress).toBe(50) // 100/200 = 50%
  })
})
