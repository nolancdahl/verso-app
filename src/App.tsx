import { Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import ScrollToTop from './components/ScrollToTop'
import ChatBot from './components/ChatBot'
import HomePage from './pages/HomePage'
import RoutinePage from './pages/RoutinePage'
import ActiveRoutinePage from './pages/ActiveRoutinePage'
import JournalPage from './pages/JournalPage'
import HairPage from './pages/HairPage'
import ChatHistoryPage from './pages/ChatHistoryPage'
import ProfilePage from './pages/ProfilePage'
import { useWakeLock } from './hooks/useWakeLock'
import { useInitProfile } from './hooks/useInitProfile'

export default function App() {
  useWakeLock()
  useInitProfile()

  return (
    <div className="min-h-screen max-w-lg mx-auto relative">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/routine" element={<RoutinePage />} />
        <Route path="/routine/active" element={<ActiveRoutinePage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/hair" element={<HairPage />} />
        <Route path="/chats" element={<ChatHistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <BottomNav />
      <ChatBot />
    </div>
  )
}
