import type { RankLevel, UserProgress } from '../types'
import { RANK_CONFIG } from '../types'

const XP_CORRECT = 10
const XP_CORRECT_FAST = 15  // bonus for fast answer
const XP_STREAK_BONUS = 5   // per streak question
const XP_DAILY_COMPLETE = 50
const COINS_CORRECT = 2
const COINS_DAILY_COMPLETE = 20
const COINS_STREAK_7 = 50

export interface RewardResult {
  xp_earned: number
  coins_earned: number
  new_badges: string[]
  rank_up: boolean
  new_rank: RankLevel | null
  streak_bonus: boolean
}

export function calculateReward(
  progress: UserProgress,
  isCorrect: boolean,
  responseTimeMs: number,
  streak: number,
  isDailyComplete: boolean
): RewardResult {
  let xp = 0
  let coins = 0
  const newBadges: string[] = []

  if (isCorrect) {
    xp += responseTimeMs < 5000 ? XP_CORRECT_FAST : XP_CORRECT
    coins += COINS_CORRECT
    if (streak > 1) xp += XP_STREAK_BONUS
  }

  if (isDailyComplete) {
    xp += XP_DAILY_COMPLETE
    coins += COINS_DAILY_COMPLETE
  }

  // Check badge conditions
  const totalCorrectAfter = progress.total_correct + (isCorrect ? 1 : 0)
  const totalAnsweredAfter = progress.total_answered + 1

  if (totalCorrectAfter >= 10 && !progress.badges.includes('first_10'))
    newBadges.push('first_10')
  if (totalCorrectAfter >= 50 && !progress.badges.includes('half_century'))
    newBadges.push('half_century')
  if (totalCorrectAfter >= 100 && !progress.badges.includes('century'))
    newBadges.push('century')
  if (streak >= 5 && !progress.badges.includes('streak_5'))
    newBadges.push('streak_5')
  if (streak >= 10 && !progress.badges.includes('streak_10'))
    newBadges.push('streak_10')

  // 7-day streak badge
  if (progress.streak_days >= 7 && !progress.badges.includes('week_streak')) {
    newBadges.push('week_streak')
    coins += COINS_STREAK_7
  }

  // Check rank up
  const newXp = progress.xp + xp
  const currentRankIdx = RANK_CONFIG.findIndex(r => r.level === progress.rank)
  let rankUp = false
  let newRank: RankLevel | null = null

  for (let i = currentRankIdx + 1; i < RANK_CONFIG.length; i++) {
    if (newXp >= RANK_CONFIG[i].required_xp) {
      rankUp = true
      newRank = RANK_CONFIG[i].level
    }
  }

  return {
    xp_earned: xp,
    coins_earned: coins,
    new_badges: newBadges,
    rank_up: rankUp,
    new_rank: newRank,
    streak_bonus: streak > 1 && isCorrect,
  }
}

export function getRankForXp(xp: number): RankLevel {
  let rank: RankLevel = 'beginner_rider'
  for (const config of RANK_CONFIG) {
    if (xp >= config.required_xp) rank = config.level
  }
  return rank
}

export function getRankProgress(xp: number): { current: typeof RANK_CONFIG[0]; next: typeof RANK_CONFIG[0] | null; progress: number } {
  let currentIdx = 0
  for (let i = RANK_CONFIG.length - 1; i >= 0; i--) {
    if (xp >= RANK_CONFIG[i].required_xp) {
      currentIdx = i
      break
    }
  }

  const current = RANK_CONFIG[currentIdx]
  const next = currentIdx < RANK_CONFIG.length - 1 ? RANK_CONFIG[currentIdx + 1] : null

  const progress = next
    ? Math.min(100, Math.round(((xp - current.required_xp) / (next.required_xp - current.required_xp)) * 100))
    : 100

  return { current, next, progress }
}

export const BADGE_DEFINITIONS = [
  { id: 'first_10', name: '学習開始', description: '10問正解', icon: '🌱' },
  { id: 'half_century', name: 'ハーフセンチュリー', description: '50問正解', icon: '⭐' },
  { id: 'century', name: 'センチュリー', description: '100問正解', icon: '💯' },
  { id: 'streak_5', name: '連続正解5', description: '5問連続正解', icon: '🔥' },
  { id: 'streak_10', name: '連続正解10', description: '10問連続正解', icon: '💎' },
  { id: 'week_streak', name: '7日継続', description: '7日間連続プレイ', icon: '🏅' },
  { id: 'all_categories', name: '全カテゴリ制覇', description: '全カテゴリの問題に正解', icon: '🏆' },
  { id: 'night_master', name: '夜間マスター', description: '夜間関連の問題をすべて正解', icon: '🌙' },
  { id: 'intersection_pro', name: '交差点プロ', description: '交差点関連の問題をすべて正解', icon: '🚦' },
  { id: 'speed_demon', name: 'スピード回答', description: '3秒以内に正解', icon: '⚡' },
]
