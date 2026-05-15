import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon, Check, ChevronLeft, ChevronRight, Undo2 } from 'lucide-react'
import { useRoutineCompletions, useProfile } from '../store/useStore'
import { weeklyRoutines } from '../data/routines'
import Header from '../components/Header'
import CalendarDay from '../components/CalendarDay'

const QUOTES = [
  { text: "Your skin is the fingerprint of what is going on inside your body.", source: "Dr. Georgiana Donadio" },
  { text: "Beautiful skin requires commitment, not a miracle.", source: "Erno Laszlo" },
  { text: "Invest in your skin. It's going to represent you for a very long time.", source: "Linden Tyler" },
  { text: "The best foundation you can wear is healthy, glowing skin.", source: "Unknown" },
  { text: "Skincare is healthcare.", source: "Unknown" },
  { text: "Taking care of yourself is productive.", source: "Unknown" },
  { text: "Consistency beats intensity. Small daily steps lead to big results.", source: "Unknown" },
  { text: "Korean skincare philosophy: treat your skin gently and it will glow.", source: "K-Beauty" },
  { text: "Sunscreen is the closest thing we have to a fountain of youth.", source: "Dermatologists everywhere" },
  { text: "Healthy skin is a reflection of overall wellness.", source: "Dr. Howard Murad" },
  { text: "The scalp is skin too — treat it with the same care as your face.", source: "Trichology" },
  { text: "Niacinamide, retinol, SPF — the holy trinity of modern skincare.", source: "Science" },
]

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getDailyQuote() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86400000)
  return QUOTES[dayOfYear % QUOTES.length]
}


export default function HomePage() {
  const navigate = useNavigate()
  const { completions, markComplete, markIncomplete } = useRoutineCompletions()
  const { profile } = useProfile()
  const [routinePopup, setRoutinePopup] = useState<{ period: 'am' | 'pm'; action: 'complete' | 'incomplete' } | null>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const didLongPress = useRef(false)
  const now = new Date()
  const daysArr = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const daysDisplay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayName = daysArr[now.getDay()]
  const dayDisplay = daysDisplay[now.getDay()]
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const todayCompletion = completions.find(c => c.date === today)
  const routine = weeklyRoutines[dayName]

  const quote = getDailyQuote()


  const [calMonth, setCalMonth] = useState(now.getMonth())
  const [calYear, setCalYear] = useState(now.getFullYear())
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay()

  const calDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const completion = completions.find(c => c.date === dateStr)
    return { day, dateStr, completion }
  })

  return (
    <div className="pb-24">
      <Header />
      <div className="px-5">
        {/* Greeting */}
        <div className="text-center mt-2 mb-5">
          <p className="text-3xl text-warm-600"><span style={{ fontFamily: "'WS Paradose', serif" }}>{greeting}</span><span>,</span></p>
          <p className="text-2xl text-sage-600" style={{ fontFamily: "'WS Paradose', serif" }}>{profile.name || 'Nolan'}</p>
        </div>

        {/* Today tile */}
        <div className="bg-white rounded-2xl p-4 shadow-md border-2 border-sage-400">
          <div className="text-center mb-3">
            <h2 className="text-gray-900 font-semibold text-sm uppercase tracking-wide" style={{ fontFamily: "'WS Paradose', serif" }}>Today</h2>
            <p className="text-gray-500 text-sm">{dayDisplay} — {timeStr}</p>
          </div>

          <div className="flex gap-3">
            {(['am', 'pm'] as const).map(p => {
              const done = p === 'am' ? todayCompletion?.am : todayCompletion?.pm
              const Icon = p === 'am' ? Sun : Moon
              return (
                <button
                  key={p}
                  onClick={() => {
                    if (didLongPress.current) { didLongPress.current = false; return }
                    navigate(`/routine/active?period=${p}&day=${dayName}&from=home`)
                  }}
                  onTouchStart={() => {
                    didLongPress.current = false
                    longPressTimer.current = setTimeout(() => {
                      didLongPress.current = true
                      setRoutinePopup({ period: p, action: done ? 'incomplete' : 'complete' })
                      longPressTimer.current = null
                    }, 500)
                  }}
                  onTouchEnd={() => { if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null } }}
                  onTouchMove={() => { if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null } }}
                  className={`flex-1 rounded-xl p-4 text-center border shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.95] active:shadow-sm no-select ${
                    done ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200 hover:border-sage-200'
                  }`}
                >
                  {done ? (
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-1 animate-check-pop">
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <Icon size={20} className="mx-auto mb-1 text-gray-400" />
                  )}
                  <p className="text-xs font-medium text-gray-600">{dayDisplay}</p>
                  <p className="text-xs font-medium text-gray-600">{p.toUpperCase()}</p>
                </button>
              )
            })}
          </div>

          {/* Mark/unmark popup */}
          {routinePopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30" onClick={() => setRoutinePopup(null)}>
              <div className="bg-white rounded-2xl p-5 shadow-xl w-full max-w-xs animate-pop-in" onClick={e => e.stopPropagation()}>
                <p className="text-sm font-semibold text-gray-900 text-center">
                  {routinePopup.action === 'incomplete'
                    ? `Mark ${routinePopup.period.toUpperCase()} as not complete?`
                    : `Mark ${routinePopup.period.toUpperCase()} as complete?`
                  }
                </p>
                <div className="flex gap-3 mt-4">
                  <button onClick={() => setRoutinePopup(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium">Cancel</button>
                  {routinePopup.action === 'incomplete' ? (
                    <button
                      onClick={() => { markIncomplete(today, routinePopup.period); setRoutinePopup(null) }}
                      className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1.5"
                    >
                      <Undo2 size={14} /> Undo
                    </button>
                  ) : (
                    <button
                      onClick={() => { markComplete(today, routinePopup.period); setRoutinePopup(null) }}
                      className="flex-1 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1.5"
                    >
                      <Check size={14} /> Done
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Monthly Calendar / Streak */}
        {(() => {
          // Calculate current streak (consecutive days with both AM+PM ending at today)
          let currentStreak = 0
          const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          for (let i = 0; i < 365; i++) {
            const d = new Date(todayDate)
            d.setDate(d.getDate() - i)
            const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
            const c = completions.find(x => x.date === ds)
            if (c?.am && c?.pm) currentStreak++
            else break
          }

          // Build set of dates with both done for streak connectors
          const bothDoneSet = new Set<string>()
          calDays.forEach(({ dateStr, completion: c }) => {
            if (c?.am && c?.pm) bothDoneSet.add(dateStr)
          })

          const makeDateStr = (d: number) =>
            `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

          return (
            <div className="mt-4 bg-white rounded-2xl p-5 shadow-sm border border-warm-100">
              {/* Streak badge */}
              {currentStreak > 1 && (
                <div className="flex justify-center mb-3">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white rounded-full shadow-sm">
                    <svg width="20" height="24" viewBox="0 0 20 24" fill="none" className="flex-shrink-0">
                      {/* 20 classic flame silhouettes cycling */}
                      {/* 1: simple teardrop */}
                      <path className="fl-1" d="M10 0C10 0 3 10 3 15C3 19 6 22 10 22C14 22 17 19 17 15C17 10 10 0 10 0Z" fill="#e06c4a"/>
                      {/* 2: slight left lean */}
                      <path className="fl-2" d="M10 0C10 0 2 9 3 14C3.5 17 5 20 9 22C13 22 17 19 17 15C17 10 10 0 10 0Z" fill="#e06c4a"/>
                      {/* 3: forked tip */}
                      <path className="fl-3" d="M10 22C6 22 3 19 3 15C3 10 8 4 9 1C9.5 3 8 7 9 9C10 7 10 3 10.5 0C11 3 11 7 12 9C13 7 12 4 12 1C13 4 17 10 17 15C17 19 14 22 10 22Z" fill="#e06c4a"/>
                      {/* 4: wide base, narrow tip */}
                      <path className="fl-4" d="M10 0C10 0 2 11 2 16C2 19.5 5.5 22 10 22C14.5 22 18 19.5 18 16C18 11 10 0 10 0Z" fill="#e06c4a"/>
                      {/* 5: left curl tip */}
                      <path className="fl-5" d="M10 22C6 22 3 19 3 15C3 11 7 5 9 2C8 5 7.5 8 9 10C10 8 10.5 4 10 1C10.5 0 11 4 11.5 7C12 5 14 2 14 2C16 6 17 11 17 15C17 19 14 22 10 22Z" fill="#e06c4a"/>
                      {/* 6: tall narrow */}
                      <path className="fl-6" d="M10 0C10 0 5 10 5 15C5 19 7 22 10 22C13 22 15 19 15 15C15 10 10 0 10 0Z" fill="#e06c4a"/>
                      {/* 7: double fork */}
                      <path className="fl-7" d="M10 22C6 22 3 19 3 15C3 10 7 5 8 2L7 0C8 2 8.5 5 9.5 7C10 5 10 2 10.5 0C11 2 11 5 11.5 7C12.5 5 13 2 13 0L14 2C15 5 17 10 17 15C17 19 14 22 10 22Z" fill="#e06c4a"/>
                      {/* 8: right lean */}
                      <path className="fl-8" d="M10 0C10 0 3 10 3 15C3 19 6 22 10 22C14 22 17 18 17 14C17 9 10 0 10 0Z" fill="#e06c4a"/>
                      {/* 9: wispy left */}
                      <path className="fl-9" d="M10 22C6 22 3 19 3 15C3 11 6 6 8 3C7 1 6 0 6 0C7 1 9 3 10 6C10 4 10 1 10 0C10.5 2 11 5 12 8C13 5 17 10 17 15C17 19 14 22 10 22Z" fill="#e06c4a"/>
                      {/* 10: squat wide */}
                      <path className="fl-10" d="M10 0C10 0 1 12 1 16C1 20 5 22 10 22C15 22 19 20 19 16C19 12 10 0 10 0Z" fill="#e06c4a"/>
                      {/* 11: triple fork */}
                      <path className="fl-11" d="M10 22C6 22 3 19 3 15C3 10 6 6 7.5 3L6.5 0C7.5 2 8 5 9 7C9.5 5 9 2 10 0C11 2 10.5 5 11 7C12 5 12.5 2 13.5 0L12.5 3C14 6 17 10 17 15C17 19 14 22 10 22Z" fill="#e06c4a"/>
                      {/* 12: right curl */}
                      <path className="fl-12" d="M10 22C6 22 3 19 3 15C3 10 6 5 10 1C10 4 9 7 10 9C11 7 12 4 13 2C14 4 17 10 17 15C17 19 14 22 10 22Z" fill="#e06c4a"/>
                      {/* 13: tall forked */}
                      <path className="fl-13" d="M10 22C6 22 4 19 4 15C4 11 7 6 9 2C8.5 0 8 0 8 0C9 2 9.5 5 10 7C10.5 4 11 1 12 0C12 0 11.5 3 12 5C13 3 14 1 14 1C15 4 16 10 16 15C16 19 14 22 10 22Z" fill="#e06c4a"/>
                      {/* 14: gentle curve */}
                      <path className="fl-14" d="M10 0C10 0 4 8 3.5 13C3 17 5.5 22 10 22C14.5 22 17 17 16.5 13C16 8 10 0 10 0Z" fill="#e06c4a"/>
                      {/* 15: asymmetric left */}
                      <path className="fl-15" d="M10 22C6 22 3 19 3 15C3 10 5 6 7 3C6 1 5 0 5 0C6.5 1.5 8 4 9 7C9.5 4 10 2 10 0C10.5 2 11 5 12 8C13 6 17 10 17 15C17 19 14 22 10 22Z" fill="#e06c4a"/>
                      {/* 16: narrow tall */}
                      <path className="fl-16" d="M10 0C10 0 5.5 9 5.5 14C5.5 18.5 7.5 22 10 22C12.5 22 14.5 18.5 14.5 14C14.5 9 10 0 10 0Z" fill="#e06c4a"/>
                      {/* 17: wide fork */}
                      <path className="fl-17" d="M10 22C5.5 22 3 19 3 15C3 10 6 5 8 2L6 0C7 2 8 5 9 8C9.5 5 10 2 10 0C10 2 10.5 5 11 8C12 5 13 2 14 0L12 2C14 5 17 10 17 15C17 19 14.5 22 10 22Z" fill="#e06c4a"/>
                      {/* 18: slight right lean */}
                      <path className="fl-18" d="M10 0C10 0 3 9 3 14C3 18 6 22 11 22C15 22 17 19 17 15C17 10 10 0 10 0Z" fill="#e06c4a"/>
                      {/* 19: curly top */}
                      <path className="fl-19" d="M10 22C6 22 3 19 3 15C3 11 6 7 8 4C7.5 2 7 0.5 7 0.5C8 2 9 4 9.5 6C10 4 10 1 10.5 0C11 1 11 4 11.5 6C12 4 13 2 14 1C13.5 3 13 5 13 7C15 10 17 12 17 15C17 19 14 22 10 22Z" fill="#e06c4a"/>
                      {/* 20: bold simple */}
                      <path className="fl-20" d="M10 0C10 0 2 10 2 15.5C2 19.5 5.5 22 10 22C14.5 22 18 19.5 18 15.5C18 10 10 0 10 0Z" fill="#e06c4a"/>
                    </svg>
                    <span className="text-xs font-semibold text-warm-600">
                      {currentStreak} day streak
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <button onClick={() => {
                  if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1) }
                  else setCalMonth(calMonth - 1)
                }} className="p-1 text-gray-400 hover:text-gray-600">
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-sm font-semibold text-gray-700">{MONTHS[calMonth]} {calYear}</h2>
                <button onClick={() => {
                  if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1) }
                  else setCalMonth(calMonth + 1)
                }} className="p-1 text-gray-400 hover:text-gray-600">
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="text-center text-xs text-gray-400 font-medium py-1">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-0">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {calDays.map(({ day, dateStr, completion }) => {
                  const isBothDone = completion?.am && completion?.pm
                  const prevDone = day > 1 && bothDoneSet.has(makeDateStr(day - 1))
                  const nextDone = day < daysInMonth && bothDoneSet.has(makeDateStr(day + 1))
                  return (
                    <CalendarDay
                      key={day}
                      day={day}
                      isToday={dateStr === today}
                      completion={completion}
                      streakLeft={isBothDone && prevDone}
                      streakRight={isBothDone && nextDone}
                    />
                  )
                })}
              </div>
            </div>
          )
        })()}

        {/* Inspirational quote */}
        <div
          className="mt-4 bg-warm-50 rounded-2xl p-6"
          style={{
            boxShadow: '0 1px 2px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.04)',
          }}
        >
          <p
            className="text-base leading-relaxed font-medium italic text-warm-500"
          >
            "{quote.text}"
          </p>
          <p
            className="mt-3 text-sm font-semibold tracking-wide text-sage-600"
          >
            — {quote.source}
          </p>
        </div>

      </div>
    </div>
  )
}
