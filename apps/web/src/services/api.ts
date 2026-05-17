import axios from 'axios'
import type { ApiResponse, Inbox } from '../types'

const client = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ??
      error.message ??
      'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export async function createInbox(options?: {
  customAlias?: string
  expiryMinutes?: number
}): Promise<Inbox> {
  const { data } = await client.post<ApiResponse<Inbox>>(
    '/inboxes',
    options ?? {}
  )
  return data.data
}

export async function getInbox(address: string): Promise<Inbox> {
  const { data } = await client.get<ApiResponse<Inbox>>(
    `/inboxes/${encodeURIComponent(address)}`
  )
  return data.data
}

export async function deleteInbox(address: string): Promise<void> {
  await client.delete(`/inboxes/${encodeURIComponent(address)}`)
}