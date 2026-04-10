import { useEffect } from 'react'
import { useGameStore } from './stores/gameStore'
import { getViolations, getScenarios } from './data'
import { BottomNav } from './components/BottomNav'
import { OnboardingScreen } from './screens/OnboardingScreen'
import { HomeScreen } from './screens/HomeScreen'
import { DailyScreen } from './screens/DailyScreen'
import { ScenarioScreen } from './screens/ScenarioScreen'
import { ResultScreen } from './screens/ResultScreen'
import { EncyclopediaScreen } from './screens/EncyclopediaScreen'
import { EncyclopediaDetailScreen } from './screens/EncyclopediaDetailScreen'
import { WeaknessScreen } from './screens/WeaknessScreen'
import { ProgressScreen } from './screens/ProgressScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { DataInfoScreen } from './screens/DataInfoScreen'
import { LegalScreen } from './screens/LegalScreen'

function AppContent() {
  const screen = useGameStore(s => s.screen)

  switch (screen) {
    case 'onboarding': return <OnboardingScreen />
    case 'home': return <HomeScreen />
    case 'daily': return <DailyScreen />
    case 'scenario': return <ScenarioScreen />
    case 'result': return <ResultScreen />
    case 'encyclopedia': return <EncyclopediaScreen />
    case 'encyclopedia_detail': return <EncyclopediaDetailScreen />
    case 'weakness': return <WeaknessScreen />
    case 'progress': return <ProgressScreen />
    case 'settings': return <SettingsScreen />
    case 'data_info': return <DataInfoScreen />
    case 'legal': return <LegalScreen />
    default: return <HomeScreen />
  }
}

export default function App() {
  const setData = useGameStore(s => s.setData)
  const dataLoaded = useGameStore(s => s.dataLoaded)
  const isOnboarded = useGameStore(s => s.isOnboarded)
  const screen = useGameStore(s => s.screen)

  useEffect(() => {
    async function loadData() {
      const [violations, scenarios] = await Promise.all([
        getViolations(),
        getScenarios(),
      ])
      setData(violations, scenarios)
    }
    loadData()
  }, [setData])

  // Redirect to home if already onboarded but screen is onboarding
  useEffect(() => {
    if (isOnboarded && screen === 'onboarding') {
      useGameStore.setState({ screen: 'home' })
    }
  }, [isOnboarded, screen])

  if (!dataLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-50">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🚲</div>
          <div className="text-sm text-gray-500">読み込み中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-gray-50 relative">
      <AppContent />
      <BottomNav />
    </div>
  )
}
