import { useGameStore } from '../stores/gameStore'
import { ProgressBar } from '../components/ProgressBar'
import { SeverityBadge, PenaltyBadge } from '../components/Badge'
import { RewardToast } from '../components/RewardToast'

export function ScenarioScreen() {
  const currentScenarios = useGameStore(s => s.currentScenarios)
  const currentIndex = useGameStore(s => s.currentIndex)
  const selectedChoiceId = useGameStore(s => s.selectedChoiceId)
  const showResult = useGameStore(s => s.showResult)
  const selectChoice = useGameStore(s => s.selectChoice)
  const confirmAnswer = useGameStore(s => s.confirmAnswer)
  const nextQuestion = useGameStore(s => s.nextQuestion)
  const endSession = useGameStore(s => s.endSession)
  const lastReward = useGameStore(s => s.lastReward)
  const violations = useGameStore(s => s.violations)
  const sessionStreak = useGameStore(s => s.sessionStreak)

  const scenario = currentScenarios[currentIndex]
  if (!scenario) return null

  const isCorrect = selectedChoiceId === scenario.correct_choice_id
  const isLast = currentIndex >= currentScenarios.length - 1

  const linkedViolations = violations.filter(v =>
    scenario.linked_violation_ids.includes(v.id)
  )

  const difficultyStars = '★'.repeat(scenario.difficulty) + '☆'.repeat(4 - scenario.difficulty)

  return (
    <div className="scenario-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <button onClick={endSession} className="text-sm text-gray-400 active:text-gray-600">
            ✕ やめる
          </button>
          <span className="text-xs text-gray-500">
            {currentIndex + 1} / {currentScenarios.length}
          </span>
          <span className="text-xs text-gray-400">{difficultyStars}</span>
        </div>
        <ProgressBar
          value={currentIndex + (showResult ? 1 : 0)}
          max={currentScenarios.length}
          color="blue"
          size="sm"
        />
        {sessionStreak > 1 && (
          <div className="text-xs text-center text-warning-500 font-bold mt-1">
            🔥 {sessionStreak}連続正解!
          </div>
        )}
      </div>

      {/* Question - scrollable middle area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
        <div className="flex items-center gap-2 mb-2">
          <SeverityBadge severity={scenario.risk_level} />
          <span className="text-xs text-gray-500">{scenario.scene_type}</span>
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-3 leading-snug">
          {scenario.title}
        </h2>

        <div className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed">
            {scenario.description}
          </p>
        </div>

        {/* Choices */}
        <div className="space-y-2.5 mb-4">
          {scenario.choices.map(choice => {
            let choiceStyle = 'bg-white border-gray-200 active:border-primary-300'
            let iconArea = <span className="w-6 h-6 rounded-full border-2 border-gray-300 flex-shrink-0" />

            if (selectedChoiceId === choice.id && !showResult) {
              choiceStyle = 'bg-primary-50 border-primary-500'
              iconArea = <span className="w-6 h-6 rounded-full bg-primary-500 flex-shrink-0 flex items-center justify-center text-white text-xs">●</span>
            }

            if (showResult) {
              if (choice.is_correct) {
                choiceStyle = 'bg-success-50 border-success-500'
                iconArea = <span className="w-6 h-6 rounded-full bg-success-500 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">○</span>
              } else if (selectedChoiceId === choice.id && !choice.is_correct) {
                choiceStyle = 'bg-danger-50 border-danger-400'
                iconArea = <span className="w-6 h-6 rounded-full bg-danger-500 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">✕</span>
              } else {
                choiceStyle = 'bg-gray-50 border-gray-200 opacity-50'
              }
            }

            return (
              <button
                key={choice.id}
                onClick={() => !showResult && selectChoice(choice.id)}
                disabled={showResult}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${choiceStyle}`}
              >
                {iconArea}
                <span className="text-sm text-gray-800 leading-snug">{choice.text}</span>
              </button>
            )
          })}
        </div>

        {/* Result feedback */}
        {showResult && (
          <div className={`rounded-2xl p-4 mb-4 ${isCorrect ? 'bg-success-50 border border-success-200' : 'bg-danger-50 border border-danger-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{isCorrect ? '🎉' : '😥'}</span>
              <span className={`font-bold ${isCorrect ? 'text-success-600' : 'text-danger-600'}`}>
                {isCorrect ? '正解!' : '不正解…'}
              </span>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              {scenario.explanation}
            </p>

            {linkedViolations.map(v => (
              <div key={v.id} className="bg-white rounded-xl p-3 mb-2 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-gray-900">{v.title}</span>
                  <PenaltyBadge amount={v.penalty_amount} />
                </div>
                <p className="text-xs text-gray-600 mb-1">{v.why_dangerous}</p>
                <p className="text-xs text-primary-600 font-medium">💡 {v.mnemonic}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Action - always visible, pinned to bottom */}
      <div className="bg-white border-t border-gray-100 p-4 flex-shrink-0 safe-bottom">
        {!showResult ? (
          <button
            onClick={confirmAnswer}
            disabled={!selectedChoiceId}
            className={`w-full py-3.5 rounded-2xl font-bold text-base transition-all ${
              selectedChoiceId
                ? 'bg-primary-600 text-white active:bg-primary-700'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            回答する
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className={`w-full py-3.5 rounded-2xl font-bold text-base transition-all ${
              isLast
                ? 'bg-success-600 text-white active:bg-success-700'
                : 'bg-primary-600 text-white active:bg-primary-700'
            }`}
          >
            {isLast ? '結果を見る' : '次の問題 →'}
          </button>
        )}
      </div>

      {/* Reward Toast */}
      {lastReward && (
        <RewardToast
          xp={lastReward.xp}
          coins={lastReward.coins}
          badges={lastReward.badges}
          rankUp={lastReward.rankUp}
          visible={showResult}
        />
      )}
    </div>
  )
}
