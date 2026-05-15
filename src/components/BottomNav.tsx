import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Droplets, BookOpen, Scissors, MessageSquare, User } from 'lucide-react'

const tabs = [
  { path: '/', icon: Home },
  { path: '/routine', icon: Droplets },
  { path: '/journal', icon: BookOpen },
  { path: '/hair', icon: Scissors },
  { path: '/chats', icon: MessageSquare },
  { path: '/profile', icon: User },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  if (location.pathname.startsWith('/routine/active')) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-warm-50/90 backdrop-blur-xl border-t border-warm-200/50 z-40">
      <div className="max-w-lg mx-auto flex justify-around items-center h-14">
        {tabs.map(({ path, icon: Icon }) => {
          const active = location.pathname === path ||
            (path !== '/' && location.pathname.startsWith(path))
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`p-3 rounded-xl transition-all duration-200 active:scale-75 ${
                active
                  ? 'text-sage-700 scale-110'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.2 : 1.5} />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
