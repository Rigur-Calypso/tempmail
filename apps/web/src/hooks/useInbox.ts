import { useEffect, useState, useCallback } from 'react'
import { useSocket } from './useSocket'
import { createInbox, getInbox } from '../services/api'
import type { Inbox, EmailSummary } from '../types'

export function useInbox() {
  const { socket, status: socketStatus } = useSocket()
  const [inbox, setInbox] = useState<Inbox | null>(null)
  const [emails, setEmails] = useState<EmailSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExpired, setIsExpired] = useState(false)

  const generate = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    setIsExpired(false)
    setEmails([])
    setInbox(null)

    try {
      const newInbox = await createInbox()
      setInbox(newInbox)
      setEmails(newInbox.emails ?? [])
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to create inbox'
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    generate()
  }, [generate])

  useEffect(() => {
    if (!socket || !inbox || socketStatus !== 'connected') return

    socket.emit('inbox:subscribe', inbox.address)

    function onNewEmail(email: EmailSummary) {
      setEmails((prev) => [email, ...prev])
      setInbox((prev) =>
        prev ? { ...prev, emailCount: prev.emailCount + 1 } : prev
      )
    }

    function onExpired() {
      setIsExpired(true)
    }

    function onInboxError(err: { message: string }) {
      setError(err.message)
    }

    socket.on('email:new', onNewEmail)
    socket.on('inbox:expired', onExpired)
    socket.on('inbox:error', onInboxError)

    return () => {
      socket.emit('inbox:unsubscribe', inbox.address)
      socket.off('email:new', onNewEmail)
      socket.off('inbox:expired', onExpired)
      socket.off('inbox:error', onInboxError)
    }
  }, [socket, inbox?.address, socketStatus])

  const refresh = useCallback(async () => {
    if (!inbox) return
    try {
      const updated = await getInbox(inbox.address)
      setEmails(updated.emails)
    } catch {
      // inbox may have expired
    }
  }, [inbox])

  return {
    inbox,
    emails,
    isLoading,
    error,
    isExpired,
    socketStatus,
    generate,
    refresh,
  }
}