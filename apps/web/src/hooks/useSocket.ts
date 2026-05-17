import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import type { SocketStatus } from '../types'

let globalSocket: Socket | null = null

export function useSocket() {
  const [status, setStatus] = useState<SocketStatus>('connecting')
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (!globalSocket) {
      globalSocket = io('/', {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })
    }

    socketRef.current = globalSocket
    const socket = globalSocket

    function onConnect() {
      setStatus('connected')
    }
    function onDisconnect() {
      setStatus('disconnected')
    }
    function onConnectError() {
      setStatus('error')
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)

    if (socket.connected) {
      setStatus('connected')
    }

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onConnectError)
    }
  }, [])

  return { socket: socketRef.current, status }
}