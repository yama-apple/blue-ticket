interface SeverityBadgeProps {
  severity: 'low' | 'medium' | 'high' | 'critical'
}

const severityConfig = {
  low: { label: '低', className: 'bg-success-100 text-success-600' },
  medium: { label: '中', className: 'bg-warning-100 text-warning-500' },
  high: { label: '高', className: 'bg-danger-100 text-danger-500' },
  critical: { label: '危険', className: 'bg-danger-500 text-white' },
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const config = severityConfig[severity]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${config.className}`}>
      {config.label}
    </span>
  )
}

interface PenaltyBadgeProps {
  amount: number
}

export function PenaltyBadge({ amount }: PenaltyBadgeProps) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-primary-100 text-primary-700">
      ¥{amount.toLocaleString()}
    </span>
  )
}

interface MasteryBadgeProps {
  level: string
}

const masteryConfig: Record<string, { label: string; className: string }> = {
  unlearned: { label: '未学習', className: 'bg-gray-100 text-gray-500' },
  learning: { label: '学習中', className: 'bg-primary-100 text-primary-600' },
  needs_review: { label: '要復習', className: 'bg-warning-100 text-warning-500' },
  learned: { label: '定着', className: 'bg-success-100 text-success-600' },
  mastered: { label: '実戦的', className: 'bg-accent-50 text-accent-600' },
}

export function MasteryBadge({ level }: MasteryBadgeProps) {
  const config = masteryConfig[level] || masteryConfig.unlearned
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${config.className}`}>
      {config.label}
    </span>
  )
}
