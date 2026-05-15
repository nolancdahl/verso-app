import { useState, useRef, useEffect } from 'react'
import { MessageCircle, Send, RefreshCw, Plus, Trash2 } from 'lucide-react'
import { useChatMessages, useChatHistory, useJournalEntries, useHairEntries, useProfile, type ChatMessage } from '../store/useStore'

const ALL_PROMPTS = [
  "How's my skin doing?", "Retinol vs retinal?", "Best SPF for daily use?", "Hair growth tips",
  "Help with acne", "Review my routine", "Moisturizer for dry skin", "Vitamin C serum guide",
  "Benefits of niacinamide", "Scalp care routine", "Anti-aging for 20s/30s", "Fix dry flaky skin",
  "POTS & skin health", "Minimize pores", "Best eye cream?", "When to reapply SPF?",
  "Oily T-zone fix", "Reduce dark circles", "Beard skin care", "Sleep & skin connection",
  "Does diet cause acne?", "Best hydration tips", "How often to exfoliate?", "Sensitive skin routine",
  "Tretinoin beginner tips", "LED mask benefits?", "Lip care for dry lips",
]

function getRotatingPrompts(): string[] {
  const now = new Date()
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000)
  const start = (dayOfYear * 9) % ALL_PROMPTS.length
  const result: string[] = []
  for (let i = 0; i < 9; i++) {
    result.push(ALL_PROMPTS[(start + i) % ALL_PROMPTS.length])
  }
  return result
}

function buildSystemPrompt(
  journalEntries: { title: string; skinLook: string; skinFeel: string; mcasPots: string; notes: string; date: string; tags: string[] }[],
  hairEntries: { title: string; likes: string; dislikes: string; notes: string; products: string; date: string; tags: string[] }[],
  profile: { name: string; age: string; skinType: string; skinGoals: string; hairType: string; hairGoals: string; generalNotes: string; importedContext: string; dontWork: string }
): string {
  const parts: string[] = [
    `You are a knowledgeable health, skincare, and haircare expert. You stay up to date with the latest research from Korean beauty, Western dermatology, and holistic health. You give personalized, practical advice.`,
    `The user's name is ${profile.name || 'the user'}.`,
  ]

  if (profile.age) parts.push(`Age: ${profile.age}.`)
  if (profile.skinType) parts.push(`Skin type: ${profile.skinType}.`)
  if (profile.skinGoals) parts.push(`Skin goals: ${profile.skinGoals}.`)
  if (profile.hairType) parts.push(`Hair type: ${profile.hairType}.`)
  if (profile.hairGoals) parts.push(`Hair goals: ${profile.hairGoals}.`)
  if (profile.generalNotes) parts.push(`General health notes: ${profile.generalNotes}.`)
  if (profile.dontWork) parts.push(`IMPORTANT - Things that DON'T work for this user (avoid recommending these):\n${profile.dontWork}`)
  if (profile.importedContext) parts.push(`Additional context from imported conversations:\n${profile.importedContext}`)

  const recentJournal = journalEntries.slice(0, 5)
  if (recentJournal.length > 0) {
    parts.push('\nRecent skin journal entries:')
    recentJournal.forEach(e => {
      const bits = [e.title && `Title: ${e.title}`, e.skinLook && `Looks: ${e.skinLook}`, e.skinFeel && `Feels: ${e.skinFeel}`, e.mcasPots && `MCAS/POTS: ${e.mcasPots}`, e.notes && `Notes: ${e.notes}`, e.tags?.length && `Tags: ${e.tags.join(', ')}`].filter(Boolean).join('; ')
      if (bits) parts.push(`- [${new Date(e.date).toLocaleDateString()}] ${bits}`)
    })
  }

  const recentHair = hairEntries.slice(0, 5)
  if (recentHair.length > 0) {
    parts.push('\nRecent hair journal entries:')
    recentHair.forEach(e => {
      const bits = [e.title && `Title: ${e.title}`, e.likes && `Likes: ${e.likes}`, e.dislikes && `Dislikes: ${e.dislikes}`, e.products && `Products: ${e.products}`, e.notes && `Notes: ${e.notes}`, e.tags?.length && `Tags: ${e.tags.join(', ')}`].filter(Boolean).join('; ')
      if (bits) parts.push(`- [${new Date(e.date).toLocaleDateString()}] ${bits}`)
    })
  }

  parts.push(`\nIMPORTANT FORMATTING RULES:
- Do NOT use markdown formatting (no #, **, *, or other markdown syntax)
- Use ALL CAPS for section headers or titles
- Use dashes (---) to separate sections
- Use bullet points with "- " for lists
- Use line breaks for spacing
- Keep responses concise and practical
- Reference the user's journal data when relevant
- Be warm and encouraging`)

  return parts.join('\n')
}

async function callClaudeAPI(apiKey: string, systemPrompt: string, messages: ChatMessage[]): Promise<string> {
  const apiMessages = messages.map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }))

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: apiMessages,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`API error: ${res.status} ${err}`)
  }

  const data = await res.json()
  return data.content[0]?.text || 'Sorry, I could not generate a response.'
}

// Fallback for when no API key is set
function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, '')           // remove # headers
    .replace(/\*\*(.+?)\*\*/g, '$1')       // remove **bold**
    .replace(/\*(.+?)\*/g, '$1')           // remove *italic*
    .replace(/__(.+?)__/g, '$1')           // remove __bold__
    .replace(/_(.+?)_/g, '$1')             // remove _italic_
    .replace(/`(.+?)`/g, '$1')             // remove `code`
    .replace(/```[\s\S]*?```/g, '')        // remove code blocks
}

function getLocalResponse(message: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('retinol') || lower.includes('retinal') || lower.includes('vitamin a')) return "Retinol (Vitamin A) is the gold standard for anti-aging. Start with 0.025-0.05% and work up. Apply at night, always use SPF during the day."
  if (lower.includes('sunscreen') || lower.includes('spf')) return "SPF is the #1 anti-aging product. Look for SPF 50+ PA++++. Korean/Japanese sunscreens have the best textures."
  if (lower.includes('acne') || lower.includes('breakout')) return "For acne: BHA (salicylic acid 2%) for pore-clearing, benzoyl peroxide 2.5%, and niacinamide for oil control. Don't over-cleanse."
  if (lower.includes('hair') || lower.includes('shampoo')) return "For healthy hair: minimize heat, sulfate-free shampoo, regular conditioning, weekly hair mask. Scalp health is key."
  return "To get personalized AI-powered answers, add your Claude API key in the Profile page. For now, I can help with basics — ask about retinol, SPF, acne, or hair care!"
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const { messages, addMessage, clearMessages } = useChatMessages()
  const { saveConversation } = useChatHistory()
  const { entries: journalEntries } = useJournalEntries()
  const { entries: hairEntries } = useHairEntries()
  const { profile } = useProfile()
  const scrollRef = useRef<HTMLDivElement>(null)


  const systemPrompt = buildSystemPrompt(journalEntries, hairEntries, profile)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  const sendPrompt = (text: string) => {
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    }
    addMessage(userMsg)
    if (profile.apiKey) {
      setLoading(true)
      callClaudeAPI(profile.apiKey, systemPrompt, [...messages, userMsg]).then(response => {
        addMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: response, timestamp: new Date().toISOString() })
      }).catch(err => {
        addMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: `Error: ${err instanceof Error ? err.message : 'API error'}`, timestamp: new Date().toISOString() })
      }).finally(() => setLoading(false))
    } else {
      setTimeout(() => {
        addMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: getLocalResponse(text), timestamp: new Date().toISOString() })
      }, 300)
    }
  }

  const handleNewChat = () => {
    if (messages.length > 0) {
      saveConversation(messages)
      clearMessages()
    }
  }

  const handleDeleteChat = () => {
    clearMessages()
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }
    addMessage(userMsg)
    setInput('')

    if (profile.apiKey) {
      setLoading(true)
      try {
        const allMessages = [...messages, userMsg]
        const response = await callClaudeAPI(profile.apiKey, systemPrompt, allMessages)
        addMessage({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response,
          timestamp: new Date().toISOString(),
        })
      } catch (err) {
        addMessage({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Error: ${err instanceof Error ? err.message : 'Failed to connect to Claude API. Check your API key in Profile.'}`,
          timestamp: new Date().toISOString(),
        })
      }
      setLoading(false)
    } else {
      setTimeout(() => {
        addMessage({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: getLocalResponse(userMsg.content),
          timestamp: new Date().toISOString(),
        })
      }, 300)
    }
  }

  return (
    <>
      {/* Background overlay */}
      <div className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${
        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`} onClick={() => setOpen(false)} />

      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          open ? 'bg-gray-400 -rotate-90 scale-95 text-white' : 'bg-warm-50 text-sage-600 hover:bg-warm-100 hover:scale-105 active:scale-95'
        }`}
      >
        <MessageCircle size={24} />
      </button>

      <div className={`fixed bottom-36 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm transition-all duration-300 origin-bottom-right ${
        open ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-4 pointer-events-none'
      }`}>
        <div className="absolute -bottom-2 right-5 w-4 h-4 bg-white rotate-45 border-r border-b border-warm-200" />

        <div className="bg-white rounded-2xl overflow-hidden flex flex-col" style={{ maxHeight: '60vh', boxShadow: '0 4px 8px rgba(0,0,0,0.06), 0 8px 20px rgba(0,0,0,0.1), 0 16px 40px rgba(0,0,0,0.08)' }}>
          {/* Header */}
          <div className="relative z-10 flex items-center justify-between px-4 py-3 bg-sage-600 text-white" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}>
            <h2 className="text-lg font-semibold tracking-wide" style={{ fontFamily: "'WS Paradose', serif" }}>Health Expert</h2>
            <div className="flex items-center gap-1">
              <button
                onClick={handleNewChat}
                className="relative w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-xl transition-colors"
                title="New chat"
              >
                <RefreshCw size={20} />
                <Plus size={10} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" strokeWidth={3} />
              </button>
              <button
                onClick={handleDeleteChat}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/20 rounded-xl transition-colors"
                title="Delete chat"
              >
                <Trash2 size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="relative flex-1 overflow-y-auto p-3 space-y-2.5" style={{ minHeight: '200px', maxHeight: 'calc(60vh - 120px)' }}>
            {messages.length === 0 && (
              <div className="text-center text-gray-400 py-2">
                <MessageCircle size={32} className="mx-auto mb-3 text-sage-300" />
                {!profile.apiKey && (
                  <p className="text-[10px] text-gray-400 mb-2">Add your Claude API key in Profile for AI-powered answers</p>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5 justify-center">
                  {getRotatingPrompts().map(q => (
                    <button
                      key={q}
                      onClick={() => sendPrompt(q)}
                      className="text-xs px-3 py-1.5 bg-white text-warm-600 rounded-full border border-warm-200 hover:bg-warm-50 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  msg.role === 'user'
                    ? 'ml-auto bg-warm-200 text-warm-900 rounded-br-md'
                    : 'mr-auto bg-gray-100 text-gray-800 rounded-bl-md'
                }`}
              >
                {msg.role === 'assistant' ? stripMarkdown(msg.content) : msg.content}
              </div>
            ))}
            {loading && (
              <div className="mr-auto bg-gray-100 text-gray-400 rounded-2xl rounded-bl-md p-3 text-sm max-w-[85%]">
                <span className="typing-dots">Thinking</span>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-100">
            <form onSubmit={(e) => { e.preventDefault(); handleSend() }} className="flex gap-2">
              <textarea
                value={input}
                onChange={e => { setInput(e.target.value.replace(/\n/g, '')); }}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } }}
                placeholder="Ask about skincare, hair, health..."
                className="flex-1 px-4 py-2.5 bg-gray-50 rounded-full text-sm outline-none focus:ring-2 focus:ring-sage-300 transition-all resize-none overflow-hidden"
                disabled={loading}
                rows={1}
                autoComplete="off"
                data-form-type="other"
                data-lpignore="true"
                data-1p-ignore="true"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-11 h-11 bg-sage-600 text-white rounded-full flex items-center justify-center disabled:opacity-40 hover:bg-sage-700 transition-colors flex-shrink-0"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
