import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  expiresAt: string
  onExpired?: () => void
}

export function CountdownTimer({
  expiresAt,
  onExpired,
}: CountdownTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(0)

  useEffect(() => {
    function calculate() {
      const diff = Math.max(
        0,
        Math.floor(
          (new Date(expiresAt).getTime() - Date.now()) / 1000
        )
      )
      setSecondsLeft(diff)
      if (diff === 0) onExpired?.()
    }

    calculate()
    const interval = setInterval(calculate, 1000)
    return () => clearInterval(interval)
  }, [expiresAt, onExpired])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const isUrgent = secondsLeft < 120

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-500">Expires in</span>
      <span
        className={`font-mono font-medium tabular-nums ${
          isUrgent ? 'text-red-400' : 'text-gray-300'
        }`}
      >
        {String(minutes).padStart(2, '0')}:
        {String(seconds).padStart(2, '0')}
      </span>
    </div>
  )
}