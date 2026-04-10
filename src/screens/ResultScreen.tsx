import { useGameStore } from '../stores/gameStore'
import { Card } from '../components/Card'
import { getRankProgress } from '../engine/rewards'

export function ResultScreen() {
  const sessionCorrect = useGameStore(s => s.sessionCorrect)
  const currentScenarios = useGameStore(s => s.currentScenarios)
  const progress = useGameStore(s => s.progress)
  const endSession = useGameStore(s => s.endSession)
  const setScreen = useGameStore(s => s.setScreen)

  const total = currentScenarios.length
  const accuracy = total > 0 ? Math.round((sessionCorrect / total) * 100) : 0
  const rankInfo = getRankProgress(progress.xp)

  let resultEmoji = '🎉'
  let resultMessage = '完璧!'
  let resultSub = 'すべて正解です。素晴らしい!'

  if (accuracy < 40) {
    resultEmoji = '📚'
    resultMessage = 'がんばろう!'
    resultSub = '間違えた問題を復習して理解を深めましょう。'
  } else if (accuracy < 60) {
    resultEmoji = '💪'
    resultMessage = 'もう少し!'
    resultSub = '基本は押さえています。苦手克服モードで弱点を補強しましょう。'
  } else if (accuracy < 80) {
    resultEmoji = '👍'
    resultMessage = 'いい調子!'
    resultSub = 'ほとんど正解できています。あと一歩!'
  } else if (accuracy < 100) {
    resultEmoji = '✨'
    resultMessage = '素晴らしい!'
    resultSub = 'かなりの理解度です。'
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-50 to-white px-4 pt-6">

      <div className="flex-1 flex flex-col items-center justify-center">
        <span className="text-7xl mb-4">{resultEmoji}</span>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{resultMessage}</h1>
        <p className="text-sm text-gray-500 text-center mb-6 max-w-xs">{resultSub}</p>

        {/* Score */}
        <div className="flex gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center min-w-[80px]">
            <div className="text-3xl font-bold text-primary-600">{sessionCorrect}</div>
            <div className="text-xs text-gray-500 mt-1">正解</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center min-w-[80px]">
            <div className="text-3xl font-bold text-gray-400">{total - sessionCorrect}</div>
            <div className="text-xs text-gray-500 mt-1">不正解</div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center min-w-[80px]">
            <div className="text-3xl font-bold text-success-600">{accuracy}%</div>
            <div className="text-xs text-gray-500 mt-1">正答率</div>
          </div>
        </div>

        {/* Rank Progress */}
        <Card className="w-full max-w-sm mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{rankInfo.current.emoji}</span>
            <div className="flex-1">
              <div className="text-sm font-bold text-gray-900">{rankInfo.current.label}</div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all"
                  style={{ width: `${rankInfo.progress}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {progress.xp} XP {rankInfo.next ? `(次: ${rankInfo.next.required_xp} XP)` : '(MAX)'}
              </div>
            </div>
          </div>
        </Card>

        {/* Stats */}
        <Card className="w-full max-w-sm">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">累計正解数</span>
            <span className="font-bold text-gray-900">{progress.total_correct}</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">連続日数</span>
            <span className="font-bold text-gray-900">{progress.streak_days}日</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">獲得バッジ</span>
            <span className="font-bold text-gray-900">{progress.badges.length}個</span>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="pb-8 space-y-3 mt-6">
        <button
          onClick={endSession}
          className="w-full py-3.5 bg-primary-600 text-white rounded-2xl font-bold text-base active:bg-primary-700"
        >
          ホームに戻る
        </button>
        {progress.wrong_answers.length > 0 && (
          <button
            onClick={() => { endSession(); setTimeout(() => setScreen('weakness'), 50) }}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold text-sm active:bg-gray-200"
          >
            苦手克服モードへ
          </button>
        )}
      </div>
    </div>
  )
}
