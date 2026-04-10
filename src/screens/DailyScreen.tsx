import { useGameStore } from '../stores/gameStore'
import { Header } from '../components/Header'
import { Card } from '../components/Card'
import { generateDailyChallenge, isDailyChallengeAvailable } from '../engine/daily'

export function DailyScreen() {
  const scenarios = useGameStore(s => s.scenarios)
  const progress = useGameStore(s => s.progress)
  const startSession = useGameStore(s => s.startSession)
  const setScreen = useGameStore(s => s.setScreen)

  const available = isDailyChallengeAvailable(progress.daily_challenge_completed_dates)

  const handleStart = () => {
    const daily = generateDailyChallenge(scenarios, progress.mastery, progress.daily_challenge_completed_dates)
    if (daily.length > 0) startSession(daily)
  }

  return (
    <div className="pb-20">
      <Header title="デイリーチャレンジ" />

      <div className="px-4 pt-4">
        {available ? (
          <>
            <div className="text-center mb-6">
              <span className="text-6xl">📅</span>
              <h2 className="text-xl font-bold text-gray-900 mt-3">今日のチャレンジ</h2>
              <p className="text-sm text-gray-500 mt-1">
                5問のシナリオに挑戦して知識を深めよう
              </p>
            </div>

            <Card className="mb-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🎯</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">新規・復習・苦手のミックス</div>
                    <div className="text-xs text-gray-500">バランス良く出題されます</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">⏱️</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">所要時間 約2〜3分</div>
                    <div className="text-xs text-gray-500">すきま時間にぴったり</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">🏆</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">クリア報酬</div>
                    <div className="text-xs text-gray-500">+50 XP, +20 コイン</div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex gap-2 mb-4">
              <div className="flex-1 bg-primary-50 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-primary-600">{progress.streak_days}</div>
                <div className="text-xs text-gray-500">連続日数</div>
              </div>
              <div className="flex-1 bg-success-50 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-success-600">
                  {progress.daily_challenge_completed_dates.length}
                </div>
                <div className="text-xs text-gray-500">クリア回数</div>
              </div>
              <div className="flex-1 bg-warning-50 rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-warning-500">
                  {Math.round((progress.total_correct / Math.max(progress.total_answered, 1)) * 100)}%
                </div>
                <div className="text-xs text-gray-500">正答率</div>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold text-lg active:bg-primary-700 transition-colors"
            >
              チャレンジ開始!
            </button>
          </>
        ) : (
          <div className="text-center py-12">
            <span className="text-6xl">✅</span>
            <h2 className="text-xl font-bold text-gray-900 mt-4">本日クリア済み!</h2>
            <p className="text-sm text-gray-500 mt-2 mb-8">
              明日またチャレンジしましょう。
              <br />今は他のモードで学習を続けられます。
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  const shuffled = [...scenarios].sort(() => Math.random() - 0.5).slice(0, 5)
                  if (shuffled.length > 0) startSession(shuffled)
                }}
                className="w-full py-3 bg-primary-100 text-primary-700 rounded-2xl font-bold active:bg-primary-200 transition-colors"
              >
                フリープレイ (5問)
              </button>
              <button
                onClick={() => setScreen('weakness')}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold active:bg-gray-200 transition-colors"
              >
                苦手克服モード
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
