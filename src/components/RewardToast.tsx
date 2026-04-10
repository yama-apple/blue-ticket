import { useEffect, useState } from 'react'

interface RewardToastProps {
  xp: number
  coins: number
  badges: string[]
  rankUp: boolean
  visible: boolean
}

export function RewardToast({ xp, coins, badges, rankUp, visible }: RewardToastProps) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (visible) {
      setShow(true)
      const timer = setTimeout(() => setShow(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [visible])

  if (!show || (xp === 0 && coins === 0 && badges.length === 0)) return null

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-white rounded-2xl shadow-lg border border-primary-200 px-4 py-2 flex items-center gap-3">
        {xp > 0 && (
          <span className="text-sm font-bold text-primary-600">+{xp} XP</span>
        )}
        {coins > 0 && (
          <span className="text-sm font-bold text-warning-500">+{coins} 🪙</span>
        )}
        {badges.map(b => (
          <span key={b} className="text-sm font-bold text-accent-600">🏅 新バッジ!</span>
        ))}
        {rankUp && (
          <span className="text-sm font-bold text-success-600">🎉 ランクアップ!</span>
        )}
      </div>
    </div>
  )
}
