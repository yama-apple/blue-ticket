interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  variant?: 'default' | 'danger' | 'success' | 'warning' | 'accent'
}

const variantStyles = {
  default: 'bg-white border-gray-100',
  danger: 'bg-danger-50 border-danger-100',
  success: 'bg-success-50 border-success-100',
  warning: 'bg-warning-50 border-warning-100',
  accent: 'bg-accent-50 border-accent-400/20',
}

export function Card({ children, className = '', onClick, variant = 'default' }: CardProps) {
  const Component = onClick ? 'button' : 'div'
  return (
    <Component
      onClick={onClick}
      className={`rounded-2xl border p-4 shadow-sm ${variantStyles[variant]} ${
        onClick ? 'active:scale-[0.98] transition-transform w-full text-left' : ''
      } ${className}`}
    >
      {children}
    </Component>
  )
}
