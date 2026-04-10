import type { TabId } from '../types'
import { useGameStore } from '../stores/gameStore'

const tabs: { id: TabId; label: string; icon: string; screen: 'home' | 'daily' | 'encyclopedia' | 'progress' | 'settings' }[] = [
  { id: 'home', label: 'ホーム', icon: '🏠', screen: 'home' },
  { id: 'daily', label: 'デイリー', icon: '📅', screen: 'daily' },
  { id: 'encyclopedia', label: '図鑑', icon: '📖', screen: 'encyclopedia' },
  { id: 'progress', label: '進捗', icon: '📊', screen: 'progress' },
  { id: 'settings', label: '設定', icon: '⚙️', screen: 'settings' },
]

export function BottomNav() {
  const screen = useGameStore(s => s.screen)
  const setScreen = useGameStore(s => s.setScreen)

  // Hide nav during game play
  if (['scenario', 'onboarding'].includes(screen)) return null

  const activeTab = tabs.find(t => t.screen === screen)?.id || 'home'

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
      style={{ paddingBottom: 'var(--safe-area-bottom)' }}>
      <div className="max-w-lg mx-auto flex justify-around items-center h-14">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setScreen(tab.screen)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === tab.id
                ? 'text-primary-600'
                : 'text-gray-400 active:text-gray-600'
            }`}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            <span className="text-[10px] mt-0.5 font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}
