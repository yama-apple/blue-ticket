import { useState } from 'react'
import { useGameStore } from '../stores/gameStore'

const APP_NAMES = [
  { id: 'buster' as const, name: '青切符バスター', desc: '違反を見つけて撃退するイメージ' },
  { id: 'quest' as const, name: 'じてんしゃルールクエスト', desc: '冒険しながらルールを学ぶ' },
  { id: 'survival' as const, name: '青切符サバイバル', desc: '知識で生き残るサバイバル感' },
]

const STEPS = [
  {
    icon: '🚲',
    title: '自転車の新ルール、\n知っていますか？',
    body: '2025年4月から、自転車にも「青切符」制度がスタート。\n知らないうちに違反しているかもしれません。',
  },
  {
    icon: '🎮',
    title: '毎日の場面判断で\n実践的に身につける',
    body: 'クイズ形式で実際の道路場面を判断。\n丸暗記ではなく「なぜ危険か」を理解できます。',
  },
  {
    icon: '🏆',
    title: 'レベルアップしながら\nすべての違反を網羅',
    body: '違反図鑑を完成させ、安全教官を目指しましょう。\n1回1〜3分、毎日少しずつ学べます。',
  },
]

export function OnboardingScreen() {
  const [step, setStep] = useState(0)
  const setOnboarded = useGameStore(s => s.setOnboarded)
  const setAppName = useGameStore(s => s.setAppName)
  const appName = useGameStore(s => s.appName)

  if (step < STEPS.length) {
    const s = STEPS[step]
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-primary-50 to-white">
        <div className="text-7xl mb-6">{s.icon}</div>
        <h1 className="text-2xl font-bold text-gray-900 text-center whitespace-pre-line leading-tight mb-4">
          {s.title}
        </h1>
        <p className="text-sm text-gray-600 text-center whitespace-pre-line leading-relaxed mb-10 max-w-xs">
          {s.body}
        </p>

        <div className="flex gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-colors ${
              i === step ? 'bg-primary-600' : 'bg-gray-200'
            }`} />
          ))}
        </div>

        <button
          onClick={() => setStep(step + 1)}
          className="w-full max-w-xs py-3.5 bg-primary-600 text-white rounded-2xl font-bold text-base active:bg-primary-700 transition-colors"
        >
          {step < STEPS.length - 1 ? '次へ' : 'アプリ名を選ぶ'}
        </button>

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-3 text-sm text-gray-400"
          >
            戻る
          </button>
        )}
      </div>
    )
  }

  // App name selection step
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-primary-50 to-white">
      <h2 className="text-xl font-bold text-gray-900 mb-2">アプリ名を選んでください</h2>
      <p className="text-xs text-gray-500 mb-6">あとから設定で変更できます</p>

      <div className="w-full max-w-xs space-y-3 mb-8">
        {APP_NAMES.map(a => (
          <button
            key={a.id}
            onClick={() => setAppName(a.id)}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
              appName === a.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 bg-white active:border-primary-300'
            }`}
          >
            <div className="font-bold text-gray-900">{a.name}</div>
            <div className="text-xs text-gray-500 mt-1">{a.desc}</div>
          </button>
        ))}
      </div>

      <button
        onClick={setOnboarded}
        className="w-full max-w-xs py-3.5 bg-primary-600 text-white rounded-2xl font-bold text-base active:bg-primary-700 transition-colors"
      >
        はじめる
      </button>
    </div>
  )
}
