import { useState } from 'react'
import { useGameStore } from '../stores/gameStore'
import { Header } from '../components/Header'
import { Card } from '../components/Card'
import { SeverityBadge, PenaltyBadge } from '../components/Badge'

type FilterMode = 'all' | 'category' | 'severity' | 'penalty'

export function WeaknessScreen() {
  const progress = useGameStore(s => s.progress)
  const scenarios = useGameStore(s => s.scenarios)
  const violations = useGameStore(s => s.violations)
  const startSession = useGameStore(s => s.startSession)
  const [filter, setFilter] = useState<FilterMode>('all')

  const wrongScenarioIds = progress.wrong_answers.map(w => w.scenario_id)
  const wrongScenarios = scenarios.filter(s => wrongScenarioIds.includes(s.id))

  const getLinkedViolations = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId)
    if (!scenario) return []
    return violations.filter(v => scenario.linked_violation_ids.includes(v.id))
  }

  let displayScenarios = [...wrongScenarios]
  if (filter === 'severity') {
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    displayScenarios.sort((a, b) => severityOrder[a.risk_level] - severityOrder[b.risk_level])
  } else if (filter === 'penalty') {
    displayScenarios.sort((a, b) => {
      const aViol = getLinkedViolations(a.id)
      const bViol = getLinkedViolations(b.id)
      const aMax = Math.max(0, ...aViol.map(v => v.penalty_amount))
      const bMax = Math.max(0, ...bViol.map(v => v.penalty_amount))
      return bMax - aMax
    })
  }

  const handleStartWeakness = () => {
    const shuffled = [...wrongScenarios].sort(() => Math.random() - 0.5).slice(0, 5)
    if (shuffled.length > 0) startSession(shuffled)
  }

  return (
    <div className="pb-20">
      <Header title="苦手克服" showBack />

      <div className="px-4 pt-4">
        {wrongScenarios.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-6xl">🎉</span>
            <h2 className="text-xl font-bold text-gray-900 mt-4">苦手問題なし!</h2>
            <p className="text-sm text-gray-500 mt-2">
              まだ間違えた問題がありません。
              <br />学習を続けましょう!
            </p>
          </div>
        ) : (
          <>
            {/* Summary */}
            <Card className="mb-4" variant="warning">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-gray-900">{wrongScenarios.length}問</div>
                  <div className="text-xs text-gray-500">間違えた問題</div>
                </div>
                <button
                  onClick={handleStartWeakness}
                  className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold text-sm active:bg-primary-700"
                >
                  克服チャレンジ
                </button>
              </div>
            </Card>

            {/* Filter */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {(['all', 'severity', 'penalty'] as FilterMode[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                    filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {f === 'all' ? 'すべて' : f === 'severity' ? '危険度順' : '反則金順'}
                </button>
              ))}
            </div>

            {/* Wrong answers list */}
            <div className="space-y-2">
              {displayScenarios.map(scenario => {
                const wrongEntry = progress.wrong_answers.find(w => w.scenario_id === scenario.id)
                const linkedViols = getLinkedViolations(scenario.id)

                return (
                  <Card key={scenario.id}>
                    <div className="flex items-start gap-2 mb-2">
                      <SeverityBadge severity={scenario.risk_level} />
                      <span className="text-xs text-danger-500 font-bold">
                        {wrongEntry?.times_wrong || 1}回間違い
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1">{scenario.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-2">{scenario.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {linkedViols.map(v => (
                        <PenaltyBadge key={v.id} amount={v.penalty_amount} />
                      ))}
                    </div>
                  </Card>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
