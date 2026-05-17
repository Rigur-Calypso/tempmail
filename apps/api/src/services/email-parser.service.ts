import { sanitizeHtml } from '../utils/sanitize'
import { logger } from '../utils/logger'

export interface ParsedEmail {
  fromAddress: string
  fromName: string | null
  subject: string
  bodyHtml: string | null
  bodyText: string | null
  recipient: string
}

export function parseMailgunPayload(
  body: Record<string, string>
): ParsedEmail {
  const from = body['from'] ?? body['From'] ?? ''
  const { address: fromAddress, name: fromName } = parseFromHeader(from)

  const subject =
    body['subject'] ??
    body['Subject'] ??
    '(no subject)'

  const rawHtml =
    body['body-html'] ??
    body['stripped-html'] ??
    null

  const rawText =
    body['body-plain'] ??
    body['stripped-text'] ??
    body['body-text'] ??
    null

  const recipient =
    body['recipient'] ??
    body['To'] ??
    body['to'] ??
    ''

  const bodyHtml = rawHtml ? sanitizeHtml(rawHtml) : null
  const bodyText = rawText ? rawText.trim() : null

  logger.debug(
    { fromAddress, subject, recipient },
    'Parsed Mailgun payload'
  )

  return {
    fromAddress,
    fromName,
    subject: subject.slice(0, 255),
    bodyHtml,
    bodyText,
    recipient: recipient.toLowerCase().trim(),
  }
}

function parseFromHeader(from: string): {
  address: string
  name: string | null
} {
  if (!from) {
    return { address: 'unknown@unknown.com', name: null }
  }

  const angleMatch = from.match(/^(.+?)\s*<([^>]+)>$/)
  if (angleMatch) {
    const name = angleMatch[1].trim().replace(/^["']|["']$/g, '')
    const address = angleMatch[2].trim().toLowerCase()
    return { address, name: name || null }
  }

  return {
    address: from.trim().toLowerCase(),
    name: null,
  }
}