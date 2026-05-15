import type { RoutineCompletion } from '../store/useStore'

interface CalendarDayProps {
  day: number
  isToday: boolean
  completion?: RoutineCompletion
  streakLeft?: boolean
  streakRight?: boolean
}

export default function CalendarDay({ day, isToday, completion, streakLeft, streakRight }: CalendarDayProps) {
  const amDone = completion?.am
  const pmDone = completion?.pm
  const bothDone = amDone && pmDone

  const size = isToday ? 'w-11 h-11' : 'w-9 h-9'
  const streakH = isToday ? 'h-11' : 'h-9'

  return (
    <div className="aspect-square flex items-center justify-center relative">
      {/* Streak connectors — always use standard width (h-9) */}
      {streakLeft && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-9 bg-sage-600" />
      )}
      {streakRight && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-9 bg-sage-600" />
      )}

      <div className={`relative z-10 ${size} flex items-center justify-center rounded-full text-xs ${
        isToday && !amDone && !pmDone ? 'ring-2 ring-warm-300' : ''
      }`}>
        {amDone && !bothDone && (
          <div
            className="absolute inset-0 rounded-full"
            style={{ clipPath: 'inset(0 50% 0 0)', backgroundColor: '#f4a58a' }}
          />
        )}
        {pmDone && !bothDone && (
          <div
            className="absolute inset-0 rounded-full"
            style={{ clipPath: 'inset(0 0 0 50%)', backgroundColor: '#f4a58a' }}
          />
        )}
        {bothDone && (
          <div className="absolute inset-0 rounded-full bg-sage-600" />
        )}

        {/* Outline ring for today when has completion */}
        {isToday && (amDone || pmDone) && (
          <div className="absolute inset-0 rounded-full ring-2 ring-warm-300" />
        )}

        <span className={`relative z-10 font-medium ${
          bothDone ? 'text-white' : amDone || pmDone ? 'text-warm-900' : isToday ? 'text-gray-800' : 'text-gray-600'
        }`}>{day}</span>
      </div>
    </div>
  )
}
