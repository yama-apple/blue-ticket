// ===== Data Models =====

export interface Violation {
  id: string
  category: ViolationCategory
  title: string
  short_description: string
  legal_basis_optional: string
  penalty_amount: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  is_priority_for_learning: boolean
  tags: string[]
  related_scenarios: string[]
  explanation: string
  why_dangerous: string
  common_misunderstanding: string
  mnemonic: string
  updated_at: string
}

export type ViolationCategory =
  | 'system_basics'
  | 'traffic_position'
  | 'intersection'
  | 'signal'
  | 'stop_sign'
  | 'sidewalk'
  | 'road_shoulder'
  | 'right_side'
  | 'night_riding'
  | 'smartphone'
  | 'safe_driving'
  | 'railroad'
  | 'signal_turn'
  | 'parking'
  | 'maintenance'
  | 'loading'
  | 'other_danger'
  | 'penalty_understanding'
  | 'exceptions'

export const CATEGORY_LABELS: Record<ViolationCategory, string> = {
  system_basics: '制度の基本',
  traffic_position: '通行位置',
  intersection: '交差点',
  signal: '信号',
  stop_sign: '一時停止',
  sidewalk: '歩道通行',
  road_shoulder: '路側帯',
  right_side: '右側通行',
  night_riding: '夜間走行',
  smartphone: 'スマホ使用',
  safe_driving: '安全運転義務',
  railroad: '踏切',
  signal_turn: '合図',
  parking: '駐停車',
  maintenance: '整備不良',
  loading: '積載',
  other_danger: 'その他の危険行為',
  penalty_understanding: '反則金の理解',
  exceptions: '例外・誤解しやすい論点',
}

export interface ScenarioChoice {
  id: string
  text: string
  is_correct: boolean
}

export interface Scenario {
  id: string
  title: string
  scene_type: 'road' | 'intersection' | 'sidewalk' | 'night' | 'railroad' | 'school_zone' | 'residential' | 'commercial'
  description: string
  choices: ScenarioChoice[]
  correct_choice_id: string
  explanation: string
  linked_violation_ids: string[]
  difficulty: 1 | 2 | 3 | 4
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  updated_at: string
  category?: ViolationCategory
  question_type?: QuestionType
}

export type QuestionType = 'four_choice' | 'true_false' | 'penalty_match' | 'classify'

export interface RulesOverview {
  system_name: string
  effective_date: string
  summary: string
  target_age: string
  target_age_detail: string
  basic_policy: string
  how_it_works: string[]
  key_points: string[]
  source: string
  updated_at: string
}

export interface GlossaryItem {
  id: string
  term: string
  reading: string
  definition: string
  related_terms: string[]
  category: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  related_violation_ids: string[]
}

export interface VersionInfo {
  data_version: string
  last_updated: string
  change_log: { date: string; description: string }[]
  source: string
  disclaimer: string
}

// ===== Game State Models =====

export interface MasteryRecord {
  violation_id: string
  level: MasteryLevel
  correct_count: number
  wrong_count: number
  streak: number
  last_answered_at: string | null
  next_review_at: string | null
  avg_response_time_ms: number
}

export type MasteryLevel = 'unlearned' | 'learning' | 'needs_review' | 'learned' | 'mastered'

export const MASTERY_LABELS: Record<MasteryLevel, string> = {
  unlearned: '未学習',
  learning: '学習中',
  needs_review: '要復習',
  learned: '定着',
  mastered: '実戦的に理解',
}

export interface UserProgress {
  xp: number
  coins: number
  rank: RankLevel
  badges: string[]
  streak_days: number
  last_play_date: string | null
  total_correct: number
  total_answered: number
  daily_challenge_completed_dates: string[]
  discovered_violation_ids: string[]
  mastery: Record<string, MasteryRecord>
  wrong_answers: WrongAnswer[]
}

export interface WrongAnswer {
  scenario_id: string
  violation_ids: string[]
  answered_at: string
  chosen_choice_id: string
  times_wrong: number
}

export type RankLevel =
  | 'beginner_rider'
  | 'rule_graduate'
  | 'intersection_master'
  | 'night_safety_chief'
  | 'blue_ticket_expert'
  | 'bicycle_safety_instructor'

export const RANK_CONFIG: {
  level: RankLevel
  label: string
  emoji: string
  required_xp: number
  unlocks: string
}[] = [
  { level: 'beginner_rider', label: '見習いライダー', emoji: '🚲', required_xp: 0, unlocks: '基本コンテンツ' },
  { level: 'rule_graduate', label: 'ルール初心者卒業', emoji: '📗', required_xp: 200, unlocks: '中級シナリオ' },
  { level: 'intersection_master', label: '交差点マスター', emoji: '🚦', required_xp: 500, unlocks: '上級シナリオ' },
  { level: 'night_safety_chief', label: '夜間安全番長', emoji: '🌙', required_xp: 1000, unlocks: '実戦シナリオ' },
  { level: 'blue_ticket_expert', label: '青切符回避名人', emoji: '🛡️', required_xp: 2000, unlocks: '全カテゴリ開放' },
  { level: 'bicycle_safety_instructor', label: '自転車安全教官', emoji: '🏆', required_xp: 5000, unlocks: '教官モード' },
]

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  condition: string
}

export interface DailyChallenge {
  date: string
  scenarios: Scenario[]
  completed: boolean
  score: number
}

// ===== UI State =====

export type Screen =
  | 'onboarding'
  | 'home'
  | 'daily'
  | 'scenario'
  | 'result'
  | 'encyclopedia'
  | 'encyclopedia_detail'
  | 'weakness'
  | 'progress'
  | 'settings'
  | 'data_info'
  | 'legal'

export type TabId = 'home' | 'daily' | 'encyclopedia' | 'progress' | 'settings'
