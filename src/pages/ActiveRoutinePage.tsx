import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Check, X, Clock, Play, Sun, Moon, SkipForward } from 'lucide-react'
import { weeklyRoutines } from '../data/routines'
import { useRoutineCompletions } from '../store/useStore'

const DAYS_DISPLAY: Record<string, string> = {
  sunday: 'Sunday', monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday',
}

function StepInfoPopup({ content, title, onClose }: { content: string; title: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/30" onClick={onClose}>
      <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl animate-pop-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
      </div>
    </div>
  )
}

function StepTile({ step, status, onTap, onSwipeSkip, onInfoTap }: {
  step: { step: number; title: string; description: string; amount?: string; notes?: string; infoDetail?: string }
  status: 'pending' | 'done' | 'skipped'
  onTap: () => void
  onSwipeSkip: () => void
  onInfoTap: () => void
}) {
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const didLongPress = useRef(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const [offset, setOffset] = useState(0)
  const didSwipe = useRef(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    didSwipe.current = false
    didLongPress.current = false
    if (step.infoDetail) {
      longPressRef.current = setTimeout(() => {
        didLongPress.current = true
        onInfoTap()
      }, 500)
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart.current) return
    const dx = e.touches[0].clientX - touchStart.current.x
    const dy = e.touches[0].clientY - touchStart.current.y
    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      if (longPressRef.current) { clearTimeout(longPressRef.current); longPressRef.current = null }
      setOffset(Math.max(-100, Math.min(100, dx)))
    }
  }

  const handleTouchEnd = () => {
    if (longPressRef.current) { clearTimeout(longPressRef.current); longPressRef.current = null }
    if (Math.abs(offset) > 50) {
      didSwipe.current = true
      onSwipeSkip()
    }
    setOffset(0)
    touchStart.current = null
  }

  const bgClass = status === 'done' ? 'bg-emerald-50 border-emerald-200'
    : status === 'skipped' ? 'bg-amber-50 border-amber-200'
    : 'bg-white border-warm-100'

  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Swipe background */}
      {offset !== 0 && (
        <div className={`absolute inset-0 flex items-center justify-center rounded-xl ${
          Math.abs(offset) > 50 ? 'bg-amber-100' : 'bg-amber-50'
        }`}>
          <SkipForward size={20} className="text-amber-500" />
        </div>
      )}

      <div
        className={`relative w-full p-4 border flex items-start gap-3 text-left rounded-xl ${bgClass}`}
        style={{ transform: `translateX(${offset}px)`, transition: offset === 0 ? 'transform 0.2s ease-out' : 'none' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => {
          if (didLongPress.current) { didLongPress.current = false; return }
          if (didSwipe.current) { didSwipe.current = false; return }
          onTap()
        }}
      >
        {status === 'done' ? (
          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 animate-check-pop">
            <Check size={16} className="text-white" strokeWidth={3} />
          </div>
        ) : status === 'skipped' ? (
          <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 animate-check-pop">
            <SkipForward size={14} className="text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-white">{step.step}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${
            status === 'done' ? 'text-emerald-700' : status === 'skipped' ? 'text-amber-700' : 'text-gray-900'
          }`}>{step.title}</p>
          <span className="inline-block text-xs text-gray-600 bg-warm-200 rounded-full px-2.5 py-0.5 mt-1">{step.amount || '–'}</span>
          <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
        </div>
      </div>
    </div>
  )
}

export default function ActiveRoutinePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { markComplete } = useRoutineCompletions()

  const now = new Date()
  const daysArr = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const paramDay = searchParams.get('day')
  const dayName = paramDay && daysArr.includes(paramDay) ? paramDay : daysArr[now.getDay()]
  const paramPeriod = searchParams.get('period') as 'am' | 'pm' | null
  const autoPeriod = now.getHours() < 15 ? 'am' : 'pm'
  const period = paramPeriod || autoPeriod
  const fromPage = searchParams.get('from') || 'routine'
  const routine = weeklyRoutines[dayName]
  const steps = routine[period]

  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [skippedSteps, setSkippedSteps] = useState<Set<number>>(new Set())
  const [timerRunning, setTimerRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const [infoPopup, setInfoPopup] = useState<{ title: string; content: string } | null>(null)

  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1)
      }, 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [timerRunning])

  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = elapsedSeconds % 60

  const goBack = () => navigate(fromPage === 'home' ? '/' : '/routine')

  const allAccountedFor = completedSteps.size + skippedSteps.size >= steps.length

  const handleFinish = useCallback(() => {
    setFinished(true)
    setTimerRunning(false)
    if (timerRef.current) clearInterval(timerRef.current)
    // Find the most recent occurrence of this day of the week
    const targetDayIndex = daysArr.indexOf(dayName)
    const now2 = new Date()
    const todayIndex = now2.getDay()
    let daysBack = todayIndex - targetDayIndex
    if (daysBack < 0) daysBack += 7
    const targetDate = new Date(now2)
    targetDate.setDate(targetDate.getDate() - daysBack)
    const dateStr = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`
    markComplete(dateStr, period)
  }, [markComplete, period, dayName, daysArr])

  // Auto-finish when all steps are done or skipped
  useEffect(() => {
    if (allAccountedFor && !finished) {
      setTimeout(() => handleFinish(), 400)
    }
  }, [allAccountedFor, finished, handleFinish])

  const toggleStep = useCallback((stepIndex: number) => {
    setCompletedSteps(prev => {
      const next = new Set(prev)
      if (next.has(stepIndex)) {
        next.delete(stepIndex)
      } else {
        // Remove from skipped if it was skipped
        setSkippedSteps(s => { const ns = new Set(s); ns.delete(stepIndex); return ns })
        next.add(stepIndex)
      }
      return next
    })
  }, [])

  const toggleSkip = useCallback((stepIndex: number) => {
    setSkippedSteps(prev => {
      const next = new Set(prev)
      if (next.has(stepIndex)) {
        next.delete(stepIndex)
      } else {
        // Remove from completed if it was completed
        setCompletedSteps(s => { const ns = new Set(s); ns.delete(stepIndex); return ns })
        next.add(stepIndex)
      }
      return next
    })
  }, [])

  const handleTimerPress = () => {
    if (!timerRunning) {
      setTimerRunning(true)
    } else {
      handleFinish()
    }
  }

  const getStepStatus = (i: number): 'done' | 'skipped' | 'pending' => {
    if (completedSteps.has(i)) return 'done'
    if (skippedSteps.has(i)) return 'skipped'
    return 'pending'
  }

  const PeriodIcon = period === 'am' ? Sun : Moon

  if (finished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-check-pop">
          <Check size={48} className="text-emerald-600" strokeWidth={3} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 animate-fade-in">Done!</h1>
        <p className="text-gray-500 mt-2">{period.toUpperCase()} routine complete in {minutes}m {seconds}s</p>
        <button
          onClick={() => navigate('/')}
          className="mt-8 px-8 py-3 bg-sage-600 text-white rounded-full font-medium hover:bg-sage-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    )
  }

  const accountedCount = completedSteps.size + skippedSteps.size

  return (
    <div className="min-h-screen pb-8">
      {infoPopup && (
        <StepInfoPopup title={infoPopup.title} content={infoPopup.content} onClose={() => setInfoPopup(null)} />
      )}

      <div className="sticky top-0 z-40 bg-warm-50/95 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={goBack} className="p-2 text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>

          <div className="text-center">
            <PeriodIcon size={28} className="mx-auto text-sage-600 mb-1" />
            <h1 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'WS Paradose', serif" }}>
              {DAYS_DISPLAY[dayName]} {period.toUpperCase()}
            </h1>
          </div>

          <button
            onClick={handleTimerPress}
            className={`w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-sm transition-all active:scale-95 ${
              timerRunning
                ? 'bg-white text-sage-600 border-2 border-sage-600'
                : 'bg-sage-600 text-white hover:bg-sage-700'
            }`}
          >
            {timerRunning ? (
              <>
                <Clock size={12} className="mb-0.5" />
                <span className="text-xs font-semibold">{minutes}:{String(seconds).padStart(2, '0')}</span>
              </>
            ) : (
              <>
                <Play size={20} fill="white" className="ml-0.5" />
                <span className="text-[10px] font-semibold mt-0.5">Start</span>
              </>
            )}
          </button>
        </div>

        {/* Progress bar — below header */}
        <div className="h-1 bg-warm-50">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${(accountedCount / steps.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="px-5 space-y-2 mt-3">
        {steps.map((step, i) => (
          <StepTile
            key={i}
            step={step}
            status={getStepStatus(i)}
            onTap={() => toggleStep(i)}
            onSwipeSkip={() => toggleSkip(i)}
            onInfoTap={() => step.infoDetail && setInfoPopup({ title: step.title, content: step.infoDetail })}
          />
        ))}
      </div>
    </div>
  )
}
