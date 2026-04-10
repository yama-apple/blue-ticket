import { useGameStore } from '../stores/gameStore'
import { Header } from '../components/Header'
import { Card } from '../components/Card'
import { SeverityBadge, PenaltyBadge, MasteryBadge } from '../components/Badge'
import { CATEGORY_LABELS } from '../types'

export function EncyclopediaDetailScreen() {
  const violations = useGameStore(s => s.violations)
  const selectedId = useGameStore(s => s.selectedViolationId)
  const discovered = useGameStore(s => s.progress.discovered_violation_ids)
  const mastery = useGameStore(s => s.progress.mastery)
  const setSelectedViolation = useGameStore(s => s.setSelectedViolation)

  const violation = violations.find(v => v.id === selectedId)
  if (!violation) return null

  const isDiscovered = discovered.includes(violation.id)
  const masteryRecord = mastery[violation.id]

  const relatedViolations = violations.filter(v =>
    v.category === violation.category && v.id !== violation.id
  )

  return (
    <div className="pb-20">
      <Header title="違反詳細" showBack />

      <div className="px-4 pt-4">
        {/* Title Card */}
        <div className={`rounded-2xl p-5 mb-4 ${
          violation.severity === 'critical' ? 'bg-danger-50 border border-danger-200' :
          violation.severity === 'high' ? 'bg-warning-50 border border-warning-100' :
          'bg-white border border-gray-100'
        }`}>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <SeverityBadge severity={violation.severity} />
            <PenaltyBadge amount={violation.penalty_amount} />
            {masteryRecord && <MasteryBadge level={masteryRecord.level} />}
            <span className="text-xs text-gray-400">
              {CATEGORY_LABELS[violation.category]}
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{violation.title}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{violation.short_description}</p>
          {violation.legal_basis_optional && (
            <p className="text-xs text-gray-400 mt-2">根拠: {violation.legal_basis_optional}</p>
          )}
        </div>

        {isDiscovered ? (
          <>
            {/* Why dangerous */}
            <Card className="mb-3" variant="danger">
              <div className="flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <div>
                  <div className="text-sm font-bold text-danger-600 mb-1">なぜ危険?</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{violation.why_dangerous}</p>
                </div>
              </div>
            </Card>

            {/* Common misunderstanding */}
            <Card className="mb-3" variant="warning">
              <div className="flex items-start gap-2">
                <span className="text-lg">🤔</span>
                <div>
                  <div className="text-sm font-bold text-warning-500 mb-1">よくある誤解</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{violation.common_misunderstanding}</p>
                </div>
              </div>
            </Card>

            {/* Detailed explanation */}
            <Card className="mb-3">
              <div className="flex items-start gap-2">
                <span className="text-lg">📝</span>
                <div>
                  <div className="text-sm font-bold text-gray-900 mb-1">詳しい解説</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{violation.explanation}</p>
                </div>
              </div>
            </Card>

            {/* Memory tip */}
            <Card className="mb-3" variant="accent">
              <div className="flex items-start gap-2">
                <span className="text-lg">💡</span>
                <div>
                  <div className="text-sm font-bold text-accent-600 mb-1">覚え方のコツ</div>
                  <p className="text-sm text-gray-700 leading-relaxed">{violation.mnemonic}</p>
                </div>
              </div>
            </Card>

            {/* Mastery stats */}
            {masteryRecord && (
              <Card className="mb-3">
                <div className="text-sm font-bold text-gray-900 mb-2">学習データ</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <span className="text-gray-500">正解数</span>
                    <span className="float-right font-bold text-success-600">{masteryRecord.correct_count}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <span className="text-gray-500">不正解数</span>
                    <span className="float-right font-bold text-danger-500">{masteryRecord.wrong_count}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <span className="text-gray-500">連続正解</span>
                    <span className="float-right font-bold">{masteryRecord.streak}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <span className="text-gray-500">平均回答時間</span>
                    <span className="float-right font-bold">{(masteryRecord.avg_response_time_ms / 1000).toFixed(1)}秒</span>
                  </div>
                </div>
              </Card>
            )}

            {/* Tags */}
            {violation.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {violation.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Related violations */}
            {relatedViolations.length > 0 && (
              <div className="mb-3">
                <h3 className="text-sm font-bold text-gray-700 mb-2">関連する違反</h3>
                <div className="space-y-2">
                  {relatedViolations.slice(0, 3).map(rv => (
                    <Card key={rv.id} onClick={() => setSelectedViolation(rv.id)}>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-bold text-gray-900">{rv.title}</span>
                          <div className="mt-1">
                            <PenaltyBadge amount={rv.penalty_amount} />
                          </div>
                        </div>
                        <span className="text-gray-300">→</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <span className="text-5xl">🔒</span>
            <p className="text-sm text-gray-500 mt-3">
              この違反はまだ発見されていません。
              <br />学習を進めて図鑑を解放しましょう!
            </p>
          </div>
        )}

        <p className="text-xs text-gray-400 text-center mt-4">
          最終更新: {violation.updated_at}
        </p>
      </div>
    </div>
  )
}
