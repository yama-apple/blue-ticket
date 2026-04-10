import { useState } from 'react'
import { useGameStore } from '../stores/gameStore'
import { Header } from '../components/Header'
import { Card } from '../components/Card'
import { SeverityBadge, PenaltyBadge, MasteryBadge } from '../components/Badge'
import type { ViolationCategory } from '../types'
import { CATEGORY_LABELS } from '../types'

export function EncyclopediaScreen() {
  const violations = useGameStore(s => s.violations)
  const discovered = useGameStore(s => s.progress.discovered_violation_ids)
  const mastery = useGameStore(s => s.progress.mastery)
  const setSelectedViolation = useGameStore(s => s.setSelectedViolation)
  const [filterCategory, setFilterCategory] = useState<ViolationCategory | 'all'>('all')
  const [showOnlyDiscovered, setShowOnlyDiscovered] = useState(false)

  const categories = [...new Set(violations.map(v => v.category))]

  const filtered = violations.filter(v => {
    if (filterCategory !== 'all' && v.category !== filterCategory) return false
    if (showOnlyDiscovered && !discovered.includes(v.id)) return false
    return true
  })

  const discoveredCount = violations.filter(v => discovered.includes(v.id)).length

  return (
    <div className="pb-20">
      <Header title="違反図鑑" />

      <div className="px-4 pt-3">
        {/* Collection progress */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-4 text-white mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs opacity-80">コレクション</div>
              <div className="text-2xl font-bold">{discoveredCount} / {violations.length}</div>
            </div>
            <span className="text-4xl">📖</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${(discoveredCount / Math.max(violations.length, 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-2 -mx-4 px-4">
          <button
            onClick={() => setShowOnlyDiscovered(!showOnlyDiscovered)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              showOnlyDiscovered ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            発見済みのみ
          </button>
          <button
            onClick={() => setFilterCategory('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
              filterCategory === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            すべて
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                filterCategory === cat ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {CATEGORY_LABELS[cat] || cat}
            </button>
          ))}
        </div>

        {/* Violation List */}
        <div className="space-y-2">
          {filtered.map(v => {
            const isDiscovered = discovered.includes(v.id)
            const masteryRecord = mastery[v.id]

            return (
              <Card
                key={v.id}
                onClick={() => setSelectedViolation(v.id)}
                className={!isDiscovered ? 'opacity-60' : ''}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-bold text-gray-900 truncate">
                        {isDiscovered ? v.title : '???'}
                      </span>
                      {isDiscovered && <SeverityBadge severity={v.severity} />}
                      {masteryRecord && <MasteryBadge level={masteryRecord.level} />}
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {isDiscovered ? v.short_description : 'まだ発見されていません。学習を進めて図鑑を埋めよう!'}
                    </p>
                    {isDiscovered && (
                      <div className="mt-1.5">
                        <PenaltyBadge amount={v.penalty_amount} />
                      </div>
                    )}
                  </div>
                  <span className="text-gray-300 text-sm">→</span>
                </div>
              </Card>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl">🔍</span>
            <p className="text-sm text-gray-500 mt-2">該当する違反がありません</p>
          </div>
        )}
      </div>
    </div>
  )
}
