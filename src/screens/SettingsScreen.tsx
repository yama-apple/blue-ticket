import { useGameStore } from '../stores/gameStore'
import { Header } from '../components/Header'
import { Card } from '../components/Card'
import { getVersion } from '../data'

const APP_NAMES = {
  buster: '青切符バスター',
  quest: 'じてんしゃルールクエスト',
  survival: '青切符サバイバル',
} as const

export function SettingsScreen() {
  const appName = useGameStore(s => s.appName)
  const setAppName = useGameStore(s => s.setAppName)
  const setScreen = useGameStore(s => s.setScreen)
  const progress = useGameStore(s => s.progress)

  const version = getVersion()

  const handleReset = () => {
    if (confirm('学習データをすべてリセットしますか？この操作は元に戻せません。')) {
      localStorage.removeItem('blue-ticket-game')
      window.location.reload()
    }
  }

  return (
    <div className="pb-20">
      <Header title="設定" />

      <div className="px-4 pt-4 space-y-4">
        {/* App Name */}
        <Card>
          <h3 className="text-sm font-bold text-gray-900 mb-3">アプリ名</h3>
          <div className="space-y-2">
            {(Object.entries(APP_NAMES) as [keyof typeof APP_NAMES, string][]).map(([id, name]) => (
              <button
                key={id}
                onClick={() => setAppName(id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                  appName === id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <span className="text-sm font-medium text-gray-900">{name}</span>
                {appName === id && <span className="text-primary-500 text-sm">✓</span>}
              </button>
            ))}
          </div>
        </Card>

        {/* Data Version */}
        <Card>
          <h3 className="text-sm font-bold text-gray-900 mb-2">学習データ情報</h3>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">データバージョン</span>
              <span className="font-medium">{version.data_version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">最終更新</span>
              <span className="font-medium">{version.last_updated}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">出典</span>
              <span className="font-medium text-xs text-right max-w-[200px]">{version.source}</span>
            </div>
          </div>
          <button
            onClick={() => setScreen('data_info')}
            className="mt-3 w-full py-2 bg-gray-100 rounded-xl text-xs font-medium text-gray-600 active:bg-gray-200"
          >
            更新履歴を見る
          </button>
        </Card>

        {/* Learning Stats */}
        <Card>
          <h3 className="text-sm font-bold text-gray-900 mb-2">学習統計</h3>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">総回答数</span>
              <span className="font-medium">{progress.total_answered}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">総正解数</span>
              <span className="font-medium">{progress.total_correct}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">累計XP</span>
              <span className="font-medium">{progress.xp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">累計コイン</span>
              <span className="font-medium">{progress.coins}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">デイリー完了回数</span>
              <span className="font-medium">{progress.daily_challenge_completed_dates.length}</span>
            </div>
          </div>
        </Card>

        {/* Links */}
        <Card>
          <button
            onClick={() => setScreen('legal')}
            className="w-full flex items-center justify-between py-2"
          >
            <span className="text-sm text-gray-700">法的注意事項</span>
            <span className="text-gray-400">→</span>
          </button>
          <div className="border-t border-gray-100 my-1" />
          <button
            onClick={() => setScreen('data_info')}
            className="w-full flex items-center justify-between py-2"
          >
            <span className="text-sm text-gray-700">データ更新情報</span>
            <span className="text-gray-400">→</span>
          </button>
        </Card>

        {/* Reset */}
        <Card variant="danger">
          <button
            onClick={handleReset}
            className="w-full text-center text-sm font-bold text-danger-600"
          >
            学習データをリセット
          </button>
          <p className="text-xs text-gray-500 text-center mt-1">
            すべての進捗・バッジ・コインが削除されます
          </p>
        </Card>
      </div>
    </div>
  )
}
