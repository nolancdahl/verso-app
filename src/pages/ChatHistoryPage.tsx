import { useState, useRef } from 'react'
import { MessageCircle, Trash2, ChevronDown, ChevronUp, MessageSquarePlus, Droplets, Scissors, Sun, Moon, Sparkles, Heart, Leaf, ShieldCheck, Pill, type LucideIcon } from 'lucide-react'

function getConvoIcon(title: string): LucideIcon {
  const t = title.toLowerCase()
  if (t.includes('hair') || t.includes('shampoo') || t.includes('scalp') || t.includes('barber')) return Scissors
  if (t.includes('retinol') || t.includes('tret') || t.includes('serum') || t.includes('vitamin')) return Droplets
  if (t.includes('sunscreen') || t.includes('spf') || t.includes('sun')) return Sun
  if (t.includes('night') || t.includes('sleep') || t.includes('pm')) return Moon
  if (t.includes('acne') || t.includes('breakout') || t.includes('pimple')) return ShieldCheck
  if (t.includes('routine') || t.includes('morning') || t.includes('am')) return Sparkles
  if (t.includes('skin') || t.includes('glow') || t.includes('moistur')) return Leaf
  if (t.includes('pots') || t.includes('mcas') || t.includes('health')) return Heart
  if (t.includes('product') || t.includes('recommend') || t.includes('buy')) return Pill
  return MessageCircle
}
import { useChatHistory, useChatMessages } from '../store/useStore'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

export default function ChatHistoryPage() {
  const { conversations, deleteConversation } = useChatHistory()
  const { messages, loadMessages, clearMessages } = useChatMessages()
  const navigate = useNavigate()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const swipeRef = useRef<{ id: string; startX: number } | null>(null)
  const [swipedId, setSwipedId] = useState<string | null>(null)

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  }

  const handleContinue = (convoId: string) => {
    const convo = conversations.find(c => c.id === convoId)
    if (!convo) return
    // Save current chat if it has messages
    // Load this conversation's messages into the active chat
    loadMessages(convo.messages)
    // Remove from history since it's now active
    deleteConversation(convoId)
    // Navigate to home where the chatbot bubble is
    navigate('/')
  }

  return (
    <div className="pb-24">
      <Header />
      <div className="px-5">
        <div className="mb-4">
          <h2 className="text-2xl text-gray-900" style={{ fontFamily: "'WS Paradose', serif" }}>Chat History</h2>
          <p className="text-sm text-gray-400">Past conversations with your health expert</p>
        </div>
        <div className="space-y-2">
          {conversations.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <MessageCircle size={40} className="mx-auto mb-3" />
              <p className="text-sm">No past conversations yet.</p>
              <p className="text-xs mt-1">Start chatting with the health expert using the bubble button.</p>
            </div>
          )}

          {conversations.map(convo => {
            const expanded = expandedId === convo.id
            return (
              <div key={convo.id} className="relative rounded-2xl">
                {/* Swipe delete background */}
                <div className="absolute inset-0 bg-warm-200 flex items-center justify-end px-5 rounded-2xl">
                  <button onClick={() => { deleteConversation(convo.id); setSwipedId(null) }} className="text-red-500">
                    <Trash2 size={18} strokeWidth={1.5} />
                  </button>
                </div>

                <div
                  className="relative bg-white rounded-2xl border border-warm-100 overflow-hidden transition-all duration-300"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 3px 7px rgba(0,0,0,0.04)', transform: swipedId === convo.id ? 'translateX(-60px)' : 'translateX(0)', minHeight: '5.859rem' }}
                  onTouchStart={e => { swipeRef.current = { id: convo.id, startX: e.touches[0].clientX } }}
                  onTouchMove={e => {
                    if (!swipeRef.current || swipeRef.current.id !== convo.id) return
                    const dx = e.touches[0].clientX - swipeRef.current.startX
                    if (dx < -40) setSwipedId(convo.id)
                    else if (dx > 20) setSwipedId(null)
                  }}
                  onTouchEnd={() => { swipeRef.current = null }}
                >
                  <div className="flex items-center gap-3" style={{ paddingLeft: '0.4rem', paddingRight: '0.75rem', height: '5.859rem' }}>
                    {(() => {
                      const Icon = getConvoIcon(convo.title)
                      return (
                        <div className="w-[5.15rem] h-[5.15rem] bg-warm-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Icon size={20} className="text-sage-300" />
                        </div>
                      )
                    })()}
                    <button onClick={() => setExpandedId(expanded ? null : convo.id)} className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-medium text-gray-900 truncate" style={{ fontFamily: "'WS Paradose', serif" }}>{convo.title}</p>
                      <p className="text-xs text-gray-400">{formatDate(convo.startedAt)} — {convo.messages.length} messages</p>
                    </button>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => setExpandedId(expanded ? null : convo.id)} className="p-1 text-gray-400">
                        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="border-t border-gray-50">
                      <div className="p-4 space-y-2.5 max-h-80 overflow-y-auto">
                        {convo.messages.map(msg => (
                          <div
                            key={msg.id}
                            className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                              msg.role === 'user'
                                ? 'ml-auto bg-warm-200 text-warm-900 rounded-br-md'
                                : 'mr-auto bg-gray-100 text-gray-800 rounded-bl-md'
                            }`}
                          >
                            {msg.content}
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-4 flex items-center justify-center">
                        <button
                          onClick={() => handleContinue(convo.id)}
                          className="flex items-center gap-2 px-6 py-3 bg-sage-600 text-white rounded-xl text-sm font-medium hover:bg-sage-700 transition-colors"
                        >
                          <MessageSquarePlus size={16} />
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
