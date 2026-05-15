import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon, Check, Undo2 } from 'lucide-react'
import { useRoutineCompletions } from '../store/useStore'
import Header from '../components/Header'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const DAYS_LOWER = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

function getMostRecentDateForDay(dayIndex: number): string {
  const now = new Date()
  const todayIndex = now.getDay()
  let daysBack = todayIndex - dayIndex
  if (daysBack < 0) daysBack += 7
  const target = new Date(now)
  target.setDate(target.getDate() - daysBack)
  return `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`
}

function getWeekStart(): string {
  // Sunday is the start of the week
  const now = new Date()
  const daysSinceSunday = now.getDay()
  const sunday = new Date(now)
  sunday.setDate(sunday.getDate() - daysSinceSunday)
  return `${sunday.getFullYear()}-${String(sunday.getMonth() + 1).padStart(2, '0')}-${String(sunday.getDate()).padStart(2, '0')}`
}

export default function RoutinePage() {
  const navigate = useNavigate()
  const { completions, markComplete, markIncomplete } = useRoutineCompletions()
  const [routinePopup, setRoutinePopup] = useState<{ period: 'am' | 'pm'; dayIndex: number; action: 'complete' | 'incomplete' } | null>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const didLongPress = useRef(false)

  const now = new Date()
  const todayIndex = now.getDay()
  const weekStart = getWeekStart()

  return (
    <div className="pb-24">
      <Header />
      <div className="px-5">
        <div className="mb-4">
          <h2 className="text-2xl text-gray-900" style={{ fontFamily: "'WS Paradose', serif" }}>Routine</h2>
          <p className="text-sm text-gray-400">Your daily skincare & grooming steps</p>
        </div>
        <div className="space-y-2">
          {DAYS.map((day, i) => {
            const dayLower = DAYS_LOWER[i]
            const isToday = i === todayIndex
            const dateForDay = getMostRecentDateForDay(i)
            // Only show as done if the date is within this week (on or after Sunday)
            const isThisWeek = dateForDay >= weekStart
            const dayCompletion = isThisWeek ? completions.find(c => c.date === dateForDay) : undefined
            const amDone = !!dayCompletion?.am
            const pmDone = !!dayCompletion?.pm

            return (
              <div
                key={day}
                className={`bg-white rounded-2xl p-3 shadow-sm border flex items-center gap-3 transition-all duration-200 active:scale-[0.98] no-select ${
                  isToday ? 'border-sage-400 ring-1 ring-sage-200' : 'border-warm-100'
                }`}
              >
                <div className="w-16 flex-shrink-0 text-center">
                  <p className={`text-sm font-semibold uppercase tracking-wide ${isToday ? 'text-sage-600' : 'text-gray-700'}`}>
                    {day.slice(0, 3)}
                  </p>
                  {isToday && <p className="text-[10px] text-sage-500 font-medium uppercase">Today</p>}
                </div>

                <button
                  onClick={() => {
                    if (didLongPress.current) { didLongPress.current = false; return }
                    navigate(`/routine/active?period=am&day=${dayLower}`)
                  }}
                  onTouchStart={() => {
                    didLongPress.current = false
                    longPressTimer.current = setTimeout(() => {
                      didLongPress.current = true
                      setRoutinePopup({ period: 'am', dayIndex: i, action: amDone ? 'incomplete' : 'complete' })
                      longPressTimer.current = null
                    }, 500)
                  }}
                  onTouchEnd={() => { if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null } }}
                  onTouchMove={() => { if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null } }}
                  className={`flex-1 rounded-xl p-3 text-center transition-all duration-200 active:scale-95 ${
                    amDone ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-100 hover:border-sage-200'
                  } border`}
                >
                  {amDone ? (
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mx-auto">
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <Sun size={16} className="mx-auto text-gray-400" />
                  )}
                  <p className="text-[11px] font-medium text-gray-500 mt-1">AM</p>
                </button>

                <button
                  onClick={() => {
                    if (didLongPress.current) { didLongPress.current = false; return }
                    navigate(`/routine/active?period=pm&day=${dayLower}`)
                  }}
                  onTouchStart={() => {
                    didLongPress.current = false
                    longPressTimer.current = setTimeout(() => {
                      didLongPress.current = true
                      setRoutinePopup({ period: 'pm', dayIndex: i, action: pmDone ? 'incomplete' : 'complete' })
                      longPressTimer.current = null
                    }, 500)
                  }}
                  onTouchEnd={() => { if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null } }}
                  onTouchMove={() => { if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null } }}
                  className={`flex-1 rounded-xl p-3 text-center transition-all duration-200 active:scale-95 ${
                    pmDone ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-100 hover:border-sage-200'
                  } border`}
                >
                  {pmDone ? (
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mx-auto">
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <Moon size={16} className="mx-auto text-gray-400" />
                  )}
                  <p className="text-[11px] font-medium text-gray-500 mt-1">PM</p>
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mark/unmark popup */}
      {routinePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30" onClick={() => setRoutinePopup(null)}>
          <div className="bg-white rounded-2xl p-5 shadow-xl w-full max-w-xs animate-pop-in" onClick={e => e.stopPropagation()}>
            <p className="text-sm font-semibold text-gray-900 text-center">
              {routinePopup.action === 'incomplete'
                ? `Mark ${DAYS[routinePopup.dayIndex]} ${routinePopup.period.toUpperCase()} as not complete?`
                : `Mark ${DAYS[routinePopup.dayIndex]} ${routinePopup.period.toUpperCase()} as complete?`
              }
            </p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setRoutinePopup(null)} className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium">Cancel</button>
              {routinePopup.action === 'incomplete' ? (
                <button
                  onClick={() => { markIncomplete(getMostRecentDateForDay(routinePopup.dayIndex), routinePopup.period); setRoutinePopup(null) }}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-1.5"
                >
                  <Undo2 size={14} /> Undo
                </button>
              ) : (
                <button
                  onClick={() => { markComplete(getMostRecentDateForDay(routinePopup.dayIndex), routinePopup.period); setRoutinePopup(null) }}
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
  )
}
