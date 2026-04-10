import { describe, it, expect } from 'vitest'
import { createInitialMastery, updateMastery, getDueForReview, getWeakViolations, getMasteryStats } from './mastery'

describe('createInitialMastery', () => {
  it('creates a mastery record with unlearned level', () => {
    const record = createInitialMastery('v001')
    expect(record.violation_id).toBe('v001')
    expect(record.level).toBe('unlearned')
    expect(record.correct_count).toBe(0)
    expect(record.wrong_count).toBe(0)
    expect(record.streak).toBe(0)
  })
})

describe('updateMastery', () => {
  it('upgrades from unlearned to learning on correct answer', () => {
    const record = createInitialMastery('v001')
    const updated = updateMastery(record, true, 5000)
    expect(updated.level).toBe('learning')
    expect(updated.correct_count).toBe(1)
    expect(updated.streak).toBe(1)
  })

  it('stays at unlearned level on wrong answer', () => {
    const record = createInitialMastery('v001')
    const updated = updateMastery(record, false, 5000)
    expect(updated.level).toBe('unlearned')
    expect(updated.wrong_count).toBe(1)
    expect(updated.streak).toBe(0)
  })

  it('upgrades to needs_review after consecutive correct answers', () => {
    let record = createInitialMastery('v001')
    record = updateMastery(record, true, 5000) // -> learning
    record = updateMastery(record, true, 5000) // streak=2 -> needs_review
    expect(record.level).toBe('needs_review')
  })

  it('downgrades on wrong answer from learned', () => {
    const record = {
      ...createInitialMastery('v001'),
      level: 'learned' as const,
      correct_count: 5,
      streak: 3,
    }
    const updated = updateMastery(record, false, 5000)
    expect(updated.level).toBe('needs_review')
    expect(updated.streak).toBe(0)
  })

  it('tracks average response time', () => {
    let record = createInitialMastery('v001')
    record = updateMastery(record, true, 4000)
    expect(record.avg_response_time_ms).toBe(4000)
    record = updateMastery(record, true, 6000)
    expect(record.avg_response_time_ms).toBe(5000)
  })

  it('sets next_review_at for non-unlearned levels', () => {
    let record = createInitialMastery('v001')
    record = updateMastery(record, true, 5000)
    expect(record.next_review_at).not.toBeNull()
  })
})

describe('getDueForReview', () => {
  it('returns empty for all unlearned items', () => {
    const mastery = {
      v001: createInitialMastery('v001'),
    }
    expect(getDueForReview(mastery)).toEqual([])
  })

  it('returns items with past review dates', () => {
    const pastDate = new Date(Date.now() - 86400000).toISOString()
    const mastery = {
      v001: {
        ...createInitialMastery('v001'),
        level: 'learning' as const,
        next_review_at: pastDate,
      },
    }
    expect(getDueForReview(mastery)).toEqual(['v001'])
  })
})

describe('getWeakViolations', () => {
  it('returns violations with low accuracy', () => {
    const mastery = {
      v001: {
        ...createInitialMastery('v001'),
        level: 'learning' as const,
        correct_count: 1,
        wrong_count: 4,
      },
    }
    expect(getWeakViolations(mastery)).toEqual(['v001'])
  })

  it('ignores violations with too few answers', () => {
    const mastery = {
      v001: {
        ...createInitialMastery('v001'),
        level: 'learning' as const,
        correct_count: 0,
        wrong_count: 1,
      },
    }
    expect(getWeakViolations(mastery)).toEqual([])
  })
})

describe('getMasteryStats', () => {
  it('calculates stats correctly', () => {
    const mastery = {
      v001: { ...createInitialMastery('v001'), level: 'learned' as const, correct_count: 5, wrong_count: 1 },
      v002: { ...createInitialMastery('v002'), level: 'mastered' as const, correct_count: 10, wrong_count: 0 },
      v003: createInitialMastery('v003'),
    }
    const stats = getMasteryStats(mastery)
    expect(stats.total).toBe(3)
    expect(stats.learned).toBe(1)
    expect(stats.mastered).toBe(1)
    expect(stats.unlearned).toBe(1)
    expect(stats.progress).toBe(67)
  })
})
