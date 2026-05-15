import { useState, useRef, useCallback } from 'react'
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react'
import { useProfile } from '../store/useStore'
import { User, Camera, Check, X, ZoomIn, ZoomOut, Key, Upload, Download } from 'lucide-react'
import { useJournalEntries, useHairEntries, useRoutineCompletions } from '../store/useStore'
import { useCamera } from '../hooks/useCamera'
import Header from '../components/Header'

function CropModal({ imageSrc, onSave, onCancel }: { imageSrc: string; onSave: (cropped: string) => void; onCancel: () => void }) {
  const [scale, setScale] = useState(1)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const dragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const imgRef = useRef<HTMLImageElement | null>(null)

  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    setOffsetX(prev => prev + dx)
    setOffsetY(prev => prev + dy)
    lastPos.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerUp = () => { dragging.current = false }

  const handleSave = () => {
    const canvas = document.createElement('canvas')
    const size = 400
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')!
    const img = imgRef.current
    if (!img) return

    const containerSize = 280
    const scaleRatio = size / containerSize
    ctx.drawImage(
      img,
      (offsetX + (containerSize - img.naturalWidth * scale) / 2) * scaleRatio,
      (offsetY + (containerSize - img.naturalHeight * scale) / 2) * scaleRatio,
      img.naturalWidth * scale * scaleRatio,
      img.naturalHeight * scale * scaleRatio,
    )
    onSave(canvas.toDataURL('image/jpeg', 0.85))
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex flex-col items-center justify-center p-6">
      <p className="text-white text-sm mb-3 font-medium">Drag to position, pinch to zoom</p>

      {/* Crop area */}
      <div
        className="w-[280px] h-[280px] rounded-full overflow-hidden border-4 border-white relative touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <img
          ref={imgRef}
          src={imageSrc}
          alt="Crop"
          className="absolute select-none pointer-events-none"
          draggable={false}
          style={{
            transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
            transformOrigin: 'center center',
            left: '50%',
            top: '50%',
            marginLeft: '-50%',
            marginTop: '-50%',
            maxWidth: 'none',
            width: '280px',
          }}
        />
      </div>

      {/* Zoom controls */}
      <div className="flex items-center gap-4 mt-4">
        <button onClick={() => setScale(s => Math.max(0.5, s - 0.15))} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
          <ZoomOut size={20} />
        </button>
        <span className="text-white text-xs">{Math.round(scale * 100)}%</span>
        <button onClick={() => setScale(s => Math.min(3, s + 0.15))} className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white">
          <ZoomIn size={20} />
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-5">
        <button onClick={onCancel} className="px-6 py-2.5 bg-white/20 text-white rounded-full text-sm font-medium flex items-center gap-1.5">
          <X size={16} /> Cancel
        </button>
        <button onClick={handleSave} className="px-6 py-2.5 bg-sage-600 text-white rounded-full text-sm font-medium flex items-center gap-1.5">
          <Check size={16} /> Save
        </button>
      </div>
    </div>
  )
}

function CollapsibleSection({ icon, label, subtitle, children }: { icon: React.ReactNode; label: string; subtitle: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-warm-100 overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full p-4 flex items-center gap-2 text-left">
        {icon}
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
          <p className="text-[10px] text-gray-400">{subtitle}</p>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4">
          {children}
        </div>
      </div>
    </div>
  )
}

function autoBullet(value: string): string {
  // Convert "- " at start of lines to "• "
  return value.replace(/^- /gm, '• ').replace(/\n- /g, '\n• ')
}

export default function ProfilePage() {
  const { profile, updateProfile } = useProfile()
  const { pickPhoto } = useCamera()
  const [cropImage, setCropImage] = useState<string | null>(null)
  const { entries: journalEntries } = useJournalEntries()
  const { entries: hairEntries } = useHairEntries()
  const { completions } = useRoutineCompletions()
  const [exportState, setExportState] = useState<'idle' | 'loading' | 'done'>('idle')
  const [exportProgress, setExportProgress] = useState(0)
  const exportCancelled = useRef(false)

  const cancelExport = () => {
    exportCancelled.current = true
    setExportState('idle')
    setExportProgress(0)
  }

  const handleExport = async () => {
    if (exportState === 'loading') { cancelExport(); return }
    exportCancelled.current = false
    setExportState('loading')
    setExportProgress(0)

    // Build all the text first
    const lines: string[] = []
    lines.push('=== NOUR-ISH EXPORT ===')
    lines.push(`Date: ${new Date().toLocaleDateString()}`)
    lines.push('')
    lines.push('--- PROFILE ---')
    if (profile.name) lines.push(`Name: ${profile.name}`)
    if (profile.age) lines.push(`Age: ${profile.age}`)
    if (profile.skinType) lines.push(`Skin Type: ${profile.skinType}`)
    if (profile.skinGoals) lines.push(`Skin Goals: ${profile.skinGoals}`)
    if (profile.hairType) lines.push(`Hair Type: ${profile.hairType}`)
    if (profile.hairGoals) lines.push(`Hair Goals: ${profile.hairGoals}`)
    if (profile.generalNotes) lines.push(`General Notes:\n${profile.generalNotes}`)
    if (profile.dontWork) lines.push(`Things That Don't Work:\n${profile.dontWork}`)
    lines.push('')
    if (journalEntries.length > 0) {
      lines.push('--- SKIN JOURNAL ---')
      journalEntries.slice(0, 20).forEach(e => {
        lines.push(`[${new Date(e.date).toLocaleDateString()}] ${e.title || 'Entry'}`)
        if (e.skinLook) lines.push(`  Looks: ${e.skinLook}`)
        if (e.skinFeel) lines.push(`  Feels: ${e.skinFeel}`)
        if (e.mcasPots) lines.push(`  MCAS/POTS: ${e.mcasPots}`)
        if (e.notes) lines.push(`  Notes: ${e.notes}`)
        if (e.tags?.length) lines.push(`  Tags: ${e.tags.join(', ')}`)
        lines.push('')
      })
    }
    if (hairEntries.length > 0) {
      lines.push('--- HAIR JOURNAL ---')
      hairEntries.slice(0, 20).forEach(e => {
        lines.push(`[${new Date(e.date).toLocaleDateString()}] ${e.title || 'Entry'}`)
        if (e.likes) lines.push(`  Likes: ${e.likes}`)
        if (e.dislikes) lines.push(`  Dislikes: ${e.dislikes}`)
        if (e.products) lines.push(`  Products: ${e.products}`)
        if (e.notes) lines.push(`  Notes: ${e.notes}`)
        if (e.tags?.length) lines.push(`  Tags: ${e.tags.join(', ')}`)
        lines.push('')
      })
    }
    if (completions.length > 0) {
      lines.push('--- ROUTINE COMPLETIONS ---')
      completions.slice(-30).forEach(c => {
        const parts = []
        if (c.am) parts.push('AM')
        if (c.pm) parts.push('PM')
        lines.push(`${c.date}: ${parts.join(' + ')}`)
      })
    }

    // Animate progress smoothly from 0 to 90 over ~1.5 seconds
    for (let i = 1; i <= 90; i++) {
      if (exportCancelled.current) return
      setExportProgress(i)
      await new Promise(r => setTimeout(r, 16))
    }

    // Copy to clipboard
    const text = lines.join('\n')
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Fallback for clipboard API failure
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }

    // Animate 90 to 100
    for (let i = 91; i <= 100; i++) {
      if (exportCancelled.current) return
      setExportProgress(i)
      await new Promise(r => setTimeout(r, 20))
    }

    // Hold at 100 briefly then show checkmark
    await new Promise(r => setTimeout(r, 400))
    if (exportCancelled.current) return

    setExportState('done')
    setTimeout(() => { setExportState('idle'); setExportProgress(0) }, 2500)
  }

  const handlePhotoUpload = useCallback(async () => {
    const result = await pickPhoto(false)
    if (result) setCropImage(result)
  }, [pickPhoto])

  const handleCropSave = (cropped: string) => {
    updateProfile({ photoUrl: cropped })
    setCropImage(null)
  }

  const fields: { key: keyof typeof profile; label: string; placeholder: string }[] = [
    { key: 'age', label: 'Age', placeholder: '25' },
    { key: 'skinType', label: 'Skin Type', placeholder: 'Oily, dry, combination, sensitive...' },
    { key: 'skinGoals', label: 'Skin Goals', placeholder: 'Clear skin, anti-aging, hydration...' },
    { key: 'hairType', label: 'Hair Type', placeholder: 'Straight, wavy, curly, thick, thin...' },
    { key: 'hairGoals', label: 'Hair Goals', placeholder: 'Volume, thickness, less frizz...' },
  ]

  return (
    <div className="pb-24">
      <Header />
      <div className="px-5">
        <div className="mb-4">
          <h2 className="text-2xl text-gray-900" style={{ fontFamily: "'WS Paradose', serif" }}>Profile</h2>
          <p className="text-sm text-gray-400">Your preferences & health info</p>
        </div>

        {/* Crop modal */}
        {cropImage && (
          <CropModal imageSrc={cropImage} onSave={handleCropSave} onCancel={() => setCropImage(null)} />
        )}

        {/* Avatar + Name */}
        <div className="mt-6 flex flex-col items-center">
          <button
            onClick={handlePhotoUpload}
            className="relative w-32 h-32 rounded-full overflow-hidden bg-sage-100 flex items-center justify-center group"
          >
            {profile.photoUrl ? (
              <img src={profile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={56} className="text-sage-600" />
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={24} className="text-white" />
            </div>
          </button>

          <input
            type="text"
            value={profile.name}
            onChange={e => updateProfile({ name: e.target.value })}
            placeholder="Your name"
            className="mt-4 text-2xl font-semibold text-gray-900 text-center bg-transparent outline-none border-b-2 border-transparent focus:border-sage-400 transition-colors w-56"
            style={{ fontFamily: "'WS Paradose', serif" }}
          />
        </div>

        {/* Form fields */}
        <div className="mt-8 space-y-4">
          {fields.map(({ key, label, placeholder }) => (
            <div key={key} className="bg-white rounded-2xl p-4 shadow-sm border border-warm-100">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">{label}</label>
              <textarea
                value={profile[key]}
                onChange={e => {
                  updateProfile({ [key]: autoBullet(e.target.value) })
                  e.target.style.height = 'auto'
                  e.target.style.height = e.target.scrollHeight + 'px'
                }}
                ref={el => { if (el && profile[key]) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px' } }}
                placeholder={placeholder}
                className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sage-300 resize-none transition-all overflow-hidden border border-gray-200"
                rows={1}
              />
            </div>
          ))}

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-warm-100">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">General Notes</label>
            <textarea
              value={profile.generalNotes}
              onChange={e => {
                updateProfile({ generalNotes: autoBullet(e.target.value) })
                e.target.style.height = 'auto'
                e.target.style.height = e.target.scrollHeight + 'px'
              }}
              ref={el => { if (el && profile.generalNotes) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px' } }}
              placeholder="Allergies, medications, diet, lifestyle factors, anything else relevant..."
              className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sage-300 resize-none transition-all overflow-hidden border border-gray-200"
              rows={2}
            />
          </div>

          {/* Things That Don't Work */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-warm-100">
            <div className="flex items-center gap-2 mb-1.5">
              <AlertTriangle size={14} className="text-red-400" />
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Things That Don't Work For Me</label>
            </div>
            <textarea
              value={profile.dontWork}
              onChange={e => {
                updateProfile({ dontWork: autoBullet(e.target.value) })
                e.target.style.height = 'auto'
                e.target.style.height = e.target.scrollHeight + 'px'
              }}
              ref={el => { if (el && profile.dontWork) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px' } }}
              placeholder="Products, ingredients, or habits that cause reactions, breakouts, or don't agree with you..."
              className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sage-300 resize-none transition-all overflow-hidden border border-gray-200"
              rows={2}
            />
          </div>

          {/* Import Context — collapsible */}
          <CollapsibleSection icon={<Upload size={14} className="text-sage-600" />} label="Imported Context" subtitle={profile.importedContext ? `${profile.importedContext.split('\n').length} lines loaded` : 'No context imported'}>
            <p className="text-[10px] text-gray-400 mb-2">Background from other conversations or documents for the Health Expert.</p>
            <textarea
              value={profile.importedContext}
              onChange={e => {
                updateProfile({ importedContext: e.target.value })
                e.target.style.height = 'auto'
                e.target.style.height = e.target.scrollHeight + 'px'
              }}
              ref={el => { if (el && profile.importedContext) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px' } }}
              placeholder="Paste conversation history, health notes..."
              className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sage-300 resize-none transition-all overflow-hidden border border-gray-200"
              rows={4}
            />
          </CollapsibleSection>

          {/* Export Context */}
          <div className="bg-white rounded-2xl shadow-sm border border-warm-100 overflow-hidden">
            <button onClick={handleExport} disabled={exportState === 'loading'} className="w-full p-4 flex items-center gap-2 text-left active:scale-[0.98] transition-all">
              <Download size={14} className="text-sage-600" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Export Context</p>
                <p className="text-[10px] text-gray-400">Copy all app data for Claude Chat</p>
              </div>
              {exportState === 'loading' && (
                <div className="relative w-8 h-8 flex-shrink-0 -my-2">
                  <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#dddbd0" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15" fill="none" stroke="#e06c4a" strokeWidth="3" strokeLinecap="round"
                      strokeDasharray={`${exportProgress * 0.94247} 94.247`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-extrabold text-warm-600 leading-none" style={{ marginTop: '1px' }}>{exportProgress}</span>
                  </div>
                </div>
              )}
              {exportState === 'done' && (
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center animate-check-pop flex-shrink-0 -my-2">
                  <Check size={16} className="text-white" strokeWidth={3} />
                </div>
              )}
            </button>
          </div>

          {/* API Key — collapsible */}
          <CollapsibleSection icon={<Key size={14} className="text-sage-600" />} label="Claude API Key" subtitle={profile.apiKey ? 'Connected' : 'Not set'}>
            <p className="text-[10px] text-gray-400 mb-2">Enables AI-powered answers. Get a key from console.anthropic.com</p>
            <input
              type="password"
              value={profile.apiKey}
              onChange={e => updateProfile({ apiKey: e.target.value })}
              placeholder="sk-ant-..."
              className="w-full px-3 py-2 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sage-300 border border-gray-200"
            />
            {profile.apiKey && (
              <p className="text-[10px] text-emerald-500 mt-1 font-medium">API key saved. Health Expert is AI-powered.</p>
            )}
          </CollapsibleSection>

        </div>
      </div>
    </div>
  )
}
