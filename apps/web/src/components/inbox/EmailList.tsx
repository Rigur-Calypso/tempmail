import type { EmailSummary } from '../../types'

interface EmailListProps {
  emails: EmailSummary[]
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  const diffMins = Math.floor(
    (Date.now() - date.getTime()) / 60000
  )
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  return date.toLocaleDateString()
}

export function EmailList({ emails }: EmailListProps) {
  return (
    <div className="divide-y divide-gray-800">
      {emails.map((email) => (
        <div
          key={email.id}
          className="flex items-start gap-3 p-4 hover:bg-gray-900/50 transition-colors cursor-pointer"
        >
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-xs font-medium text-gray-400 uppercase">
              {(email.fromName ?? email.fromAddress)[0]}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-medium text-gray-200 truncate">
                {email.fromName ?? email.fromAddress}
              </span>
              <span className="text-xs text-gray-600 flex-shrink-0">
                {formatTime(email.receivedAt)}
              </span>
            </div>
            <p className="text-sm text-gray-400 truncate mt-0.5">
              {email.subject}
            </p>
            <p className="text-xs text-gray-600 truncate mt-0.5">
              {email.fromAddress}
            </p>
          </div>

          {!email.isRead && (
            <div className="w-1.5 h-1.5 bg-violet-400 rounded-full flex-shrink-0 mt-2" />
          )}
        </div>
      ))}
    </div>
  )
}