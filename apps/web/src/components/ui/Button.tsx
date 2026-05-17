import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  isLoading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled ?? isLoading}
      className={twMerge(
        clsx(
          'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed',
          {
            'bg-violet-600 hover:bg-violet-500 text-white':
              variant === 'primary',
            'bg-transparent hover:bg-gray-800 text-gray-400 hover:text-gray-100':
              variant === 'ghost',
            'bg-red-900/30 hover:bg-red-900/50 text-red-400':
              variant === 'danger',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-sm': size === 'md',
          }
        ),
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  )
}