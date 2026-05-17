import { useInbox } from '../hooks/useInbox'
import { AddressBar } from '../components/inbox/AddressBar'
import { CountdownTimer } from '../components/inbox/CountdownTimer'
import { EmailList } from '../components/inbox/EmailList'
import { EmptyState } from '../components/inbox/EmptyState'
import { Spinner } from '../components/ui/Spinner'

export function InboxPage() {
  const {
    inbox,
    emails,
    isLoading,
    error,
    isExpired,
    socketStatus,
    generate,
  } = useInbox()

  if (isLoading && !inbox) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-gray-500 text-sm">
            Generating your inbox...
          </p>
        </div>
      </div>
    )
  }

  if (error && !inbox) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-red-400">{error}</p>
          <button
            onClick={generate}
            className="text-sm text-violet-400 hover:text-violet-300 underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (isExpired) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-4xl">⏰</div>
          <p className="text-gray-300 font-medium">
            Your inbox has expired
          </p>
          <p className="text-gray-500 text-sm">
            All emails have been deleted
          </p>
          <button
            onClick={generate}
            className="mt-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Generate new inbox
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-white">
            TempMail
          </h1>
          <p className="text-gray-500 text-sm">
            Disposable email. No signup required.
          </p>
        </div>

        {inbox && (
          <>
            <AddressBar
              address={inbox.address}
              socketStatus={socketStatus}
              onGenerate={generate}
              isLoading={isLoading}
            />

            <div className="flex items-center justify-between px-1">
              <CountdownTimer
                expiresAt={inbox.expiresAt}
                onExpired={() => {}}
              />
              <span className="text-sm text-gray-500">
                {emails.length}{' '}
                {emails.length === 1 ? 'email' : 'emails'}
              </span>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
              {emails.length === 0 ? (
                <EmptyState />
              ) : (
                <EmailList emails={emails} />
              )}
            </div>
          </>
        )}

      </div>
    </div>
  )
}