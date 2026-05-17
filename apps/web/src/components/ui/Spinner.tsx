export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClass = {
      sm: 'w-4 h-4 border',
      md: 'w-8 h-8 border-2',
      lg: 'w-12 h-12 border-2',
    }[size]
  
    return (
      <div
        className={`${sizeClass} border-violet-500 border-t-transparent rounded-full animate-spin`}
      />
    )
  }