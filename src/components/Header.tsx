import { useGameStore } from '../stores/gameStore'

interface HeaderProps {
  title: string
  showBack?: boolean
  rightAction?: React.ReactNode
}

export function Header({ title, showBack, rightAction }: HeaderProps) {
  const goBack = useGameStore(s => s.goBack)
  const setScreen = useGameStore(s => s.setScreen)

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-lg mx-auto flex items-center justify-between h-12 px-4">
        <div className="w-16 flex justify-start">
          {showBack && (
            <button
              onClick={() => { goBack(); setScreen('home') }}
              className="text-primary-600 text-sm font-medium active:opacity-60"
            >
              ← 戻る
            </button>
          )}
        </div>
        <h1 className="text-base font-bold text-gray-900 truncate">{title}</h1>
        <div className="w-16 flex justify-end">
          {rightAction}
        </div>
      </div>
    </header>
  )
}
