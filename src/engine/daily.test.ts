import { describe, it, expect } from 'vitest'
import { isDailyChallengeAvailable, calculateStreak } from './daily'

describe('isDailyChallengeAvailable', () => {
  it('returns true when no dates completed', () => {
    expect(isDailyChallengeAvailable([])).toBe(true)
  })

  it('returns false when today is completed', () => {
    const today = new Date().toISOString().split('T')[0]
    expect(isDailyChallengeAvailable([today])).toBe(false)
  })

  it('returns true when only other days completed', () => {
    expect(isDailyChallengeAvailable(['2025-01-01'])).toBe(true)
  })
})

describe('calculateStreak', () => {
  it('returns 0 for empty dates', () => {
    expect(calculateStreak([])).toBe(0)
  })

  it('returns 1 for today only', () => {
    const today = new Date().toISOString().split('T')[0]
    expect(calculateStreak([today])).toBe(1)
  })

  it('returns 0 for old dates only', () => {
    expect(calculateStreak(['2024-01-01'])).toBe(0)
  })

  it('counts consecutive days', () => {
    const today = new Date()
    const dates = []
    for (let i = 0; i < 5; i++) {
      const d = new Date(today.getTime() - i * 86400000)
      dates.push(d.toISOString().split('T')[0])
    }
    expect(calculateStreak(dates)).toBe(5)
  })
})
