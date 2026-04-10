import type { Violation, Scenario, RulesOverview, GlossaryItem, FAQItem, VersionInfo } from '../types'
import rulesData from './rules_overview.json'
import glossaryData from './glossary.json'
import faqData from './faq.json'
import versionData from './version.json'

// Lazy-loaded large datasets
let violationsCache: Violation[] | null = null
let scenariosCache: Scenario[] | null = null

export async function getViolations(): Promise<Violation[]> {
  if (violationsCache) return violationsCache
  const data = await import('./violations.json')
  violationsCache = data.default as Violation[]
  return violationsCache
}

export async function getScenarios(): Promise<Scenario[]> {
  if (scenariosCache) return scenariosCache
  const data = await import('./scenarios.json')
  scenariosCache = data.default as Scenario[]
  return scenariosCache
}

export function getRulesOverview(): RulesOverview {
  return rulesData as RulesOverview
}

export function getGlossary(): GlossaryItem[] {
  return glossaryData as GlossaryItem[]
}

export function getFAQ(): FAQItem[] {
  return faqData as FAQItem[]
}

export function getVersion(): VersionInfo {
  return versionData as VersionInfo
}

export function getViolationById(violations: Violation[], id: string): Violation | undefined {
  return violations.find(v => v.id === id)
}

export function getScenariosByCategory(scenarios: Scenario[], category: string): Scenario[] {
  return scenarios.filter(s =>
    s.linked_violation_ids.some(id => id.startsWith(category)) ||
    (s as Scenario & { category?: string }).category === category
  )
}

export function getScenariosByDifficulty(scenarios: Scenario[], difficulty: number): Scenario[] {
  return scenarios.filter(s => s.difficulty === difficulty)
}
