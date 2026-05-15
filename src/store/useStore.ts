import { useState, useEffect, useCallback } from 'react'

// Simple localStorage-backed store

export interface JournalEntry {
  id: string
  date: string
  title: string
  photoUrl?: string
  skinLook: string
  skinFeel: string
  mcasPots: string
  notes: string
  tags: string[]
}

export interface HairEntry {
  id: string
  date: string
  title: string
  photoUrl?: string
  type: 'haircut' | 'progress'
  likes: string
  dislikes: string
  notes: string
  products: string
  tags: string[]
}

export interface RoutineCompletion {
  date: string // YYYY-MM-DD
  am: boolean
  pm: boolean
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface ChatConversation {
  id: string
  title: string
  startedAt: string
  messages: ChatMessage[]
}

export interface UserProfile {
  name: string
  age: string
  skinType: string
  skinGoals: string
  hairType: string
  hairGoals: string
  photoUrl: string
  generalNotes: string
  apiKey: string
  importedContext: string
  dontWork: string
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>(() =>
    loadFromStorage('journal_entries', [])
  )

  useEffect(() => saveToStorage('journal_entries', entries), [entries])

  const addEntry = useCallback((entry: JournalEntry) => {
    setEntries(prev => [entry, ...prev])
  }, [])

  const updateEntry = useCallback((id: string, updates: Partial<JournalEntry>) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
  }, [])

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }, [])

  return { entries, addEntry, updateEntry, deleteEntry }
}

export function useHairEntries() {
  const [entries, setEntries] = useState<HairEntry[]>(() =>
    loadFromStorage('hair_entries', [])
  )

  useEffect(() => saveToStorage('hair_entries', entries), [entries])

  const addEntry = useCallback((entry: HairEntry) => {
    setEntries(prev => [entry, ...prev])
  }, [])

  const updateEntry = useCallback((id: string, updates: Partial<HairEntry>) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
  }, [])

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }, [])

  return { entries, addEntry, updateEntry, deleteEntry }
}

export function useRoutineCompletions() {
  const [completions, setCompletions] = useState<RoutineCompletion[]>(() =>
    loadFromStorage('routine_completions', [])
  )

  useEffect(() => saveToStorage('routine_completions', completions), [completions])

  const markComplete = useCallback((date: string, period: 'am' | 'pm') => {
    setCompletions(prev => {
      const existing = prev.find(c => c.date === date)
      if (existing) {
        return prev.map(c =>
          c.date === date ? { ...c, [period]: true } : c
        )
      }
      return [...prev, { date, am: period === 'am', pm: period === 'pm' }]
    })
  }, [])

  const markIncomplete = useCallback((date: string, period: 'am' | 'pm') => {
    setCompletions(prev => {
      return prev.map(c =>
        c.date === date ? { ...c, [period]: false } : c
      ).filter(c => c.am || c.pm)
    })
  }, [])

  return { completions, markComplete, markIncomplete }
}

export function useChatMessages() {
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    loadFromStorage('chat_messages', [])
  )

  useEffect(() => saveToStorage('chat_messages', messages), [messages])

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages(prev => [...prev, msg])
  }, [])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const loadMessages = useCallback((msgs: ChatMessage[]) => {
    setMessages(msgs)
  }, [])

  return { messages, addMessage, clearMessages, loadMessages }
}

export function useChatHistory() {
  const [conversations, setConversations] = useState<ChatConversation[]>(() =>
    loadFromStorage('chat_history', [])
  )

  useEffect(() => saveToStorage('chat_history', conversations), [conversations])

  const saveConversation = useCallback((messages: ChatMessage[]) => {
    if (messages.length === 0) return
    const firstUserMsg = messages.find(m => m.role === 'user')
    const convo: ChatConversation = {
      id: Date.now().toString(),
      title: firstUserMsg?.content.slice(0, 50) || 'Chat',
      startedAt: messages[0].timestamp,
      messages: [...messages],
    }
    setConversations(prev => [convo, ...prev])
  }, [])

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id))
  }, [])

  return { conversations, saveConversation, deleteConversation }
}

export function useProfile() {
  const [profile, setProfile] = useState<UserProfile>(() =>
    loadFromStorage('user_profile', {
      name: '',
      age: '',
      skinType: '',
      skinGoals: '',
      hairType: '',
      hairGoals: '',
      photoUrl: '',
      generalNotes: '',
      apiKey: '',
      importedContext: '',
      dontWork: '',
    })
  )

  useEffect(() => saveToStorage('user_profile', profile), [profile])

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }))
  }, [])

  return { profile, updateProfile }
}
