import { useGameStore } from '../stores/gameStore'
import { Card } from '../components/Card'
import { ProgressBar } from '../components/ProgressBar'
import { getRankProgress, BADGE_DEFINITIONS } from '../engine/rewards'
import { isDailyChallengeAvailable } from '../engine/daily'
import { getMasteryStats } from '../engine/mastery'

const APP_TITLES: Record<string, string> = {
  buster: '青切符バスター',
  quest: 'じてんしゃルールクエスト',
  survival: '青切符サバイバル',
}

export function HomeScreen() {
  const progress = useGameStore(s => s.progress)
  const appName = useGameStore(s => s.appName)
  const setScreen = useGameStore(s => s.setScreen)
  const scenarios = useGameStore(s => s.scenarios)
  const startSession = useGameStore(s => s.startSession)

  const rankInfo = getRankProgress(progress.xp)
  const dailyAvailable = isDailyChallengeAvailable(progress.daily_challenge_completed_dates)
  const masteryStats = getMasteryStats(progress.mastery)

  const handleQuickPlay = () => {
    const available = scenarios.filter(s => s.difficulty <= 2)
    const shuffled = [...available].sort(() => Math.random() - 0.5).slice(0, 5)
    if (shuffled.length > 0) startSession(shuffled)
  }

  return (
    <div className="pb-20 pt-2">
      {/* Hero Section */}
      <div className="px-4 mb-4">
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-5 text-white">
          <div className="text-xs opacity-80 mb-1">ようこそ</div>
          <h1 className="text-xl font-bold mb-3">{APP_TITLES[appName]}</h1>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{rankInfo.current.emoji}</span>
            <div className="flex-1">
              <div className="text-sm font-medium">{rankInfo.current.label}</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${rankInfo.progress}%` }}
                  />
                </div>
                <span className="text-xs opacity-80">{progress.xp} XP</span>
              </div>
              {rankInfo.next && (
                <div className="text-xs opacity-60 mt-0.5">
                  次: {rankInfo.next.label} ({rankInfo.next.required_xp} XP)
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 text-xs">
            <span>🔥 {progress.streak_days}日連続</span>
            <span>🪙 {progress.coins}</span>
            <span>🏅 {progress.badges.length}/{BADGE_DEFINITIONS.length}</span>
          </div>
        </div>
      </div>

      {/* Daily Challenge */}
      <div className="px-4 mb-4">
        <Card
          onClick={dailyAvailable ? () => setScreen('daily') : undefined}
          variant={dailyAvailable ? 'default' : 'success'}
          className={dailyAvailable ? 'border-primary-200 border-2' : ''}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{dailyAvailable ? '📅' : '✅'}</span>
            <div className="flex-1">
              <div className="font-bold text-gray-900">
                {dailyAvailable ? 'デイリーチャレンジ' : '本日クリア済み!'}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                {dailyAvailable ? '毎日5問で知識を積み上げよう' : 'また明日チャレンジしよう'}
              </div>
            </div>
            {dailyAvailable && (
              <span className="text-primary-600 text-sm font-bold">挑戦 →</span>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mb-4">
        <h2 className="text-sm font-bold text-gray-700 mb-2">学習メニュー</h2>
        <div className="grid grid-cols-2 gap-3">
          <Card onClick={handleQuickPlay}>
            <div className="text-center">
              <span className="text-2xl">🎯</span>
              <div className="text-sm font-bold text-gray-900 mt-1">クイックプレイ</div>
              <div className="text-xs text-gray-500">5問ランダム</div>
            </div>
          </Card>
          <Card onClick={() => setScreen('weakness')}>
            <div className="text-center">
              <span className="text-2xl">💪</span>
              <div className="text-sm font-bold text-gray-900 mt-1">苦手克服</div>
              <div className="text-xs text-gray-500">
                {progress.wrong_answers.length > 0
                  ? `${progress.wrong_answers.length}問`
                  : '間違いなし!'}
              </div>
            </div>
          </Card>
          <Card onClick={() => setScreen('encyclopedia')}>
            <div className="text-center">
              <span className="text-2xl">📖</span>
              <div className="text-sm font-bold text-gray-900 mt-1">違反図鑑</div>
              <div className="text-xs text-gray-500">コレクション</div>
            </div>
          </Card>
          <Card onClick={() => setScreen('progress')}>
            <div className="text-center">
              <span className="text-2xl">📊</span>
              <div className="text-sm font-bold text-gray-900 mt-1">学習進捗</div>
              <div className="text-xs text-gray-500">ダッシュボード</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Mastery Overview */}
      <div className="px-4 mb-4">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-700">全体の理解度</span>
            <span className="text-xs text-gray-500">
              {masteryStats.learned + masteryStats.mastered}/{masteryStats.total} 定着
            </span>
          </div>
          <ProgressBar
            value={masteryStats.progress}
            color="green"
            size="md"
          />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>正答率: {Math.round(masteryStats.overall_accuracy * 100)}%</span>
            <span>回答数: {progress.total_answered}</span>
          </div>
        </Card>
      </div>

      {/* Legal Notice */}
      <div className="px-4">
        <button
          onClick={() => setScreen('legal')}
          className="text-xs text-gray-400 underline"
        >
          法的注意事項・免責事項
        </button>
      </div>
    </div>
  )
}
