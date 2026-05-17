import { useState } from 'react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import type { SocketStatus } from '../../types'

interface AddressBarProps {
  address: string
  socketStatus: SocketStatus
  onGenerate: () => void
  isLoading: boolean
}

export function AddressBar({
  address,
  socketStatus,
  onGenerate,
  isLoading,
}: AddressBarProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const statusVariant = {
    connected: 'success',
    connecting: 'warning',
    disconnected: 'neutral',
    error: 'error',
  } as const

  const statusLabel = {
    connected: 'Live',
    connecting: 'Connecting...',
    disconnected: 'Offline',
    error: 'Error',
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          Your temporary address
        </span>
        <Badge variant={statusVariant[socketStatus]}>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              socketStatus === 'connected'
                ? 'bg-emerald-400'
                : 'bg-current'
            }`}
          />
          {statusLabel[socketStatus]}
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <code className="flex-1 bg-gray-950 text-violet-300 px-3 py-2 rounded-lg text-sm font-mono truncate border border-gray-800">
          {address}
        </code>
        <Button
          size="sm"
          variant={copied ? 'ghost' : 'primary'}
          onClick={handleCopy}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </Button>
      </div>

      <div className="flex justify-end">
        <Button
          size="sm"
          variant="ghost"
          onClick={onGenerate}
          isLoading={isLoading}
        >
          Generate new
        </Button>
      </div>
    </div>
  )
}