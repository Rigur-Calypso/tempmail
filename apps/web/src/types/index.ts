export interface Inbox {
    id: string
    address: string
    expiresAt: string
    createdAt: string
    emailCount: number
    emails: EmailSummary[]
  }
  
  export interface EmailSummary {
    id: string
    fromAddress: string
    fromName: string | null
    subject: string
    isRead: boolean
    receivedAt: string
  }
  
  export interface ApiResponse<T> {
    success: boolean
    data: T
  }
  
  export type SocketStatus =
    | 'connecting'
    | 'connected'
    | 'disconnected'
    | 'error'