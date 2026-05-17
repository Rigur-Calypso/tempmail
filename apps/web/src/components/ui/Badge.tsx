import { clsx } from 'clsx'

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'neutral'
  children: React.ReactNode
}

export function Badge({ variant = 'neutral', children }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-emerald-900/40 text-emerald-400': variant === 'success',
          'bg-amber-900/40 text-amber-400': variant === 'warning',
          'bg-red-900/40 text-red-400': variant === 'error',
          'bg-gray-800 text-gray-400': variant === 'neutral',
        }
      )}
    >
      {children}
    </span>
  )
}