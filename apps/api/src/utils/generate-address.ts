const ADJECTIVES = [
    'swift', 'quiet', 'bright', 'calm', 'bold',
    'cool', 'dark', 'fair', 'keen', 'mild',
  ]
  
  const NOUNS = [
    'fox', 'owl', 'elk', 'hawk', 'bear',
    'wolf', 'lynx', 'crow', 'dove', 'fawn',
  ]
  
  function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
  }
  
  function randomSuffix(length = 4): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    return Array.from(
      { length },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('')
  }
  
  export function generateLocalPart(): string {
    const adjective = randomItem(ADJECTIVES)
    const noun = randomItem(NOUNS)
    const suffix = randomSuffix(4)
    return `${adjective}${noun}${suffix}`
  }
  
  export function generateAddress(domain: string): string {
    return `${generateLocalPart()}@${domain}`
  }