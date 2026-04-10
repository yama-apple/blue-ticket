import { useGameStore } from '../stores/gameStore'
import { Header } from '../components/Header'
import { Card } from '../components/Card'
import { ProgressBar } from '../components/ProgressBar'
import { getMasteryStats } from '../engine/mastery'
import { getRankProgress, BADGE_DEFINITIONS } from '../engine/rewards'
import { CATEGORY_LABELS } from '../types'
import type { ViolationCategory } from '../types'
import { RANK_CONFIG } from '../types'

export function ProgressScreen() {
  const progress = useGameStore(s => s.progress)
  const violations = useGameStore(s => s.violations)

  const masteryStats = getMasteryStats(progress.mastery)
  const rankInfo = getRankProgress(progress.xp)

  // Category breakdown
  const categories = [...new Set(violations.map(v => v.category))]
  const categoryStats = categories.map(cat => {
    const catViolations = violations.filter(v => v.category === cat)
    const catMastered = catViolations.filter(v => {
      const m = progress.mastery[v.id]
      return m && (m.level === 'learned' || m.level === 'mastered')
    }).length
    return {
      category: cat,
      label: CATEGORY_LABELS[cat as ViolationCategory] || cat,
      total: catViolations.length,
      mastered: catMastered,
      progress: catViolations.length > 0 ? Math.round((catMastered / catViolations.length) * 100) : 0,
    }
  }).sort((a, b) => a.progress - b.progress)

  return (
    <div className="pb-20">
      <Header title="学習進捗" />

      <div className="px-4 pt-4">
        {/* Overall Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{progress.total_answered}</div>
              <div className="text-xs text-gray-500">回答数</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-success-600">
                {Math.round((progress.total_correct / Math.max(progress.total_answered, 1)) * 100)}%
              </div>
              <div className="text-xs text-gray-500">正答率</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning-500">{progress.streak_days}</div>
              <div className="text-xs text-gray-500">連続日数</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600">
                {progress.discovered_violation_ids.length}/{violations.length}
              </div>
              <div className="text-xs text-gray-500">図鑑</div>
            </div>
          </Card>
        </div>

        {/* Mastery Breakdown */}
        <Card className="mb-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">習熟度の分布</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-16 text-xs text-gray-500">未学習</span>
              <div className="flex-1">
                <ProgressBar value={masteryStats.unlearned} max={masteryStats.total} color="red" size="sm" />
              </div>
              <span className="w-8 text-xs text-right text-gray-500">{masteryStats.unlearned}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-16 text-xs text-gray-500">学習中</span>
              <div className="flex-1">
                <ProgressBar value={masteryStats.learning} max={masteryStats.total} color="blue" size="sm" />
              </div>
              <span className="w-8 text-xs text-right text-gray-500">{masteryStats.learning}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-16 text-xs text-gray-500">要復習</span>
              <div className="flex-1">
                <ProgressBar value={masteryStats.needs_review} max={masteryStats.total} color="yellow" size="sm" />
              </div>
              <span className="w-8 text-xs text-right text-gray-500">{masteryStats.needs_review}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-16 text-xs text-gray-500">定着</span>
              <div className="flex-1">
                <ProgressBar value={masteryStats.learned} max={masteryStats.total} color="green" size="sm" />
              </div>
              <span className="w-8 text-xs text-right text-gray-500">{masteryStats.learned}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-16 text-xs text-gray-500">実戦的</span>
              <div className="flex-1">
                <ProgressBar value={masteryStats.mastered} max={masteryStats.total} color="purple" size="sm" />
              </div>
              <span className="w-8 text-xs text-right text-gray-500">{masteryStats.mastered}</span>
            </div>
          </div>
        </Card>

        {/* Rank Progression */}
        <Card className="mb-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">ランク</h3>
          <div className="space-y-2">
            {RANK_CONFIG.map((rank, i) => {
              const isCurrentOrPast = progress.xp >= rank.required_xp
              const isCurrent = rank.level === rankInfo.current.level
              return (
                <div
                  key={rank.level}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    isCurrent ? 'bg-primary-50 border border-primary-200' :
                    isCurrentOrPast ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <span className="text-xl">{rank.emoji}</span>
                  <div className="flex-1">
                    <div className={`text-sm font-bold ${isCurrent ? 'text-primary-700' : 'text-gray-700'}`}>
                      {rank.label}
                    </div>
                    <div className="text-xs text-gray-500">{rank.required_xp} XP</div>
                  </div>
                  {isCurrent && <span className="text-xs font-bold text-primary-600">現在</span>}
                  {isCurrentOrPast && !isCurrent && <span className="text-xs text-success-600">達成</span>}
                </div>
              )
            })}
          </div>
        </Card>

        {/* Badges */}
        <Card className="mb-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">バッジ</h3>
          <div className="grid grid-cols-4 gap-3">
            {BADGE_DEFINITIONS.map(badge => {
              const earned = progress.badges.includes(badge.id)
              return (
                <div
                  key={badge.id}
                  className={`text-center p-2 rounded-xl ${earned ? 'bg-warning-50' : 'bg-gray-50 opacity-40'}`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <div className="text-[10px] font-bold text-gray-700 mt-1 truncate">{badge.name}</div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <h3 className="text-sm font-bold text-gray-900 mb-3">カテゴリ別進捗</h3>
          <div className="space-y-3">
            {categoryStats.map(cat => (
              <div key={cat.category}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-700 font-medium">{cat.label}</span>
                  <span className="text-xs text-gray-500">{cat.mastered}/{cat.total}</span>
                </div>
                <ProgressBar
                  value={cat.progress}
                  color={cat.progress >= 80 ? 'green' : cat.progress >= 40 ? 'blue' : 'red'}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
