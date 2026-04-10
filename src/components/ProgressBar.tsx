interface ProgressBarProps {
  value: number
  max?: number
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  label?: string
}

const colorMap = {
  blue: 'bg-primary-500',
  green: 'bg-success-500',
  yellow: 'bg-warning-500',
  red: 'bg-danger-500',
  purple: 'bg-accent-500',
}

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

export function ProgressBar({ value, max = 100, color = 'blue', size = 'md', showLabel, label }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>{label || ''}</span>
          <span>{Math.round(pct)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${sizeMap[size]}`}>
        <div
          className={`${colorMap[color]} ${sizeMap[size]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
