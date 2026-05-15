import { useState, useCallback } from 'react'
import { Camera, Plus, ChevronDown, ChevronUp, Pencil, Check, Image, X, Leaf, Trash2 } from 'lucide-react'
import { useRef } from 'react'
import { useJournalEntries, type JournalEntry } from '../store/useStore'
import { useCamera } from '../hooks/useCamera'
import Header from '../components/Header'
import TagPicker, { TagDisplay } from '../components/TagPicker'

export default function JournalPage() {
  const { entries, addEntry, updateEntry, deleteEntry } = useJournalEntries()
  const swipeRef = useRef<{ id: string; startX: number } | null>(null)
  const [swipedId, setSwipedId] = useState<string | null>(null)
  const { pickPhoto } = useCamera()
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<JournalEntry>>({})
  const [showTagPicker, setShowTagPicker] = useState(false)
  const [showEditTagPicker, setShowEditTagPicker] = useState(false)

  const [photo, setPhoto] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [skinLook, setSkinLook] = useState('')
  const [skinFeel, setSkinFeel] = useState('')
  const [mcasPots, setMcasPots] = useState('')
  const [notes, setNotes] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const handlePickPhoto = useCallback(async (useCamera: boolean) => {
    const result = await pickPhoto(useCamera)
    if (result) setPhoto(result)
  }, [pickPhoto])

  const handleEditPhoto = useCallback(async (useCamera: boolean) => {
    const result = await pickPhoto(useCamera)
    if (result) setEditData(d => ({ ...d, photoUrl: result }))
  }, [pickPhoto])

  const handleSubmit = () => {
    if (!title && !skinLook && !skinFeel && !notes && !photo) return
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      title,
      photoUrl: photo || undefined,
      skinLook, skinFeel, mcasPots, notes, tags,
    }
    addEntry(entry)
    setPhoto(null); setTitle(''); setSkinLook(''); setSkinFeel(''); setMcasPots(''); setNotes(''); setTags([])
    setShowForm(false)
  }

  const startEdit = (entry: JournalEntry) => {
    setEditingId(entry.id)
    setEditData({ title: entry.title, photoUrl: entry.photoUrl, skinLook: entry.skinLook, skinFeel: entry.skinFeel, mcasPots: entry.mcasPots, notes: entry.notes, tags: entry.tags || [] })
  }

  const saveEdit = () => {
    if (editingId) { updateEntry(editingId, editData); setEditingId(null); setEditData({}) }
  }

  const formatDateShort = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  const formatDateFull = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  }

  return (
    <div className="pb-24">
      <Header />
      {showTagPicker && <TagPicker type="skin" selectedTags={tags} onConfirm={(t) => { setTags(t); setShowTagPicker(false) }} onClose={() => setShowTagPicker(false)} />}
      {showEditTagPicker && <TagPicker type="skin" selectedTags={editData.tags || []} onConfirm={(t) => { setEditData(d => ({ ...d, tags: t })); setShowEditTagPicker(false) }} onClose={() => setShowEditTagPicker(false)} />}

      <div className="px-5 flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl text-gray-900" style={{ fontFamily: "'WS Paradose', serif" }}>Skin Log</h2>
          <p className="text-sm text-gray-400">Track your skin health with photos & notes</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            showForm ? 'bg-gray-400 text-white rotate-45' : 'bg-sage-600 text-white hover:bg-sage-700'
          }`}
        >
          <Plus size={16} />
        </button>
      </div>

      <div className={`mx-5 overflow-hidden transition-all duration-500 ease-in-out ${
        showForm ? 'mt-5 max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-warm-100 space-y-4">
          <div>
            {photo ? (
              <div className="relative">
                <img src={photo} alt="Skin photo" className="w-full rounded-xl" />
                <button onClick={(e) => { e.preventDefault(); setPhoto(null) }} className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">✕</button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button type="button" onClick={() => handlePickPhoto(true)} className="flex-1 h-28 border-2 border-dashed border-sage-300 rounded-xl flex flex-col items-center justify-center text-sage-600 hover:bg-sage-50 transition-colors">
                  <Camera size={24} /><span className="text-xs mt-1.5 font-medium">Take Photo</span>
                </button>
                <button type="button" onClick={() => handlePickPhoto(false)} className="flex-1 h-28 border-2 border-dashed border-sage-300 rounded-xl flex flex-col items-center justify-center text-sage-600 hover:bg-sage-50 transition-colors">
                  <Image size={24} /><span className="text-xs mt-1.5 font-medium">Choose Photo</span>
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Give this entry a name..." className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-sage-300" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">How does your skin look today?</label>
            <textarea value={skinLook} onChange={e => setSkinLook(e.target.value)} placeholder="Clear, some redness..." className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-sage-300 resize-none" rows={2} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">How does your skin feel?</label>
            <textarea value={skinFeel} onChange={e => setSkinFeel(e.target.value)} placeholder="Hydrated, tight..." className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-sage-300 resize-none" rows={2} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">How are you feeling MCAS / POTS wise?</label>
            <textarea value={mcasPots} onChange={e => setMcasPots(e.target.value)} placeholder="Any flares, symptoms..." className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-sage-300 resize-none" rows={2} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Any other notes?</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Diet, sleep, water..." className="w-full px-3 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-sage-300 resize-none" rows={2} />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Tags</label>
            <TagDisplay tags={tags} onAddClick={() => setShowTagPicker(true)} />
          </div>
          <button onClick={handleSubmit} className="w-full py-3 bg-sage-600 text-white rounded-xl font-medium hover:bg-sage-700 transition-colors">Save Entry</button>
        </div>
      </div>

      <div className="px-5 space-y-2">
        {entries.length === 0 && !showForm && (
          <div className="text-center py-12 text-gray-400">
            <Camera size={40} className="mx-auto mb-3" />
            <p className="text-sm">No journal entries yet.</p>
            <p className="text-xs mt-1">Tap + to log your first skin check-in.</p>
          </div>
        )}
        {entries.map(entry => {
          const expanded = expandedId === entry.id
          const isEditing = editingId === entry.id
          return (
            <div key={entry.id} className="relative rounded-2xl">
              {/* Delete background */}
              <div className="absolute inset-0 bg-warm-200 flex items-center justify-end px-5 rounded-2xl">
                <button onClick={() => { deleteEntry(entry.id); setSwipedId(null) }} className="text-red-500">
                  <Trash2 size={18} strokeWidth={1.5} />
                </button>
              </div>
              <div
                className="relative bg-white rounded-2xl border border-warm-100 transition-transform duration-200 overflow-hidden"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 3px 6px rgba(0,0,0,0.04)', transform: swipedId === entry.id ? 'translateX(-60px)' : 'translateX(0)', height: '5.964rem', padding: '0.36rem 0.75rem 0.36rem 0.36rem' }}
                onClick={() => { if (swipedId === entry.id) { setSwipedId(null) } }}
                onTouchStart={e => { swipeRef.current = { id: entry.id, startX: e.touches[0].clientX } }}
                onTouchMove={e => {
                  if (!swipeRef.current || swipeRef.current.id !== entry.id) return
                  const dx = e.touches[0].clientX - swipeRef.current.startX
                  if (dx < -40) setSwipedId(entry.id)
                  else if (dx > 20) setSwipedId(null)
                }}
                onTouchEnd={() => { swipeRef.current = null }}
              >
              <div className="flex items-center gap-3 h-full">
                <div className="w-[5.15rem] h-[5.15rem] flex-shrink-0">
                  {entry.photoUrl ? (
                    <img src={entry.photoUrl} alt="" className="w-[5.15rem] h-[5.15rem] rounded-xl object-cover" />
                  ) : (
                    <div className="w-[5.15rem] h-[5.15rem] rounded-xl bg-warm-100 flex items-center justify-center">
                      <Leaf size={20} className="text-warm-400" />
                    </div>
                  )}
                </div>
                <button onClick={() => setExpandedId(expanded ? null : entry.id)} className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-gray-900 truncate" style={entry.title ? { fontFamily: "'WS Paradose', serif" } : undefined}>
                    {entry.title || entry.skinLook || entry.skinFeel || 'Journal entry'}
                  </p>
                  <p className="text-xs text-gray-400">{expanded ? formatDateFull(entry.date) : formatDateShort(entry.date)}</p>
                </button>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {expanded && (
                    <button
                      onClick={() => isEditing ? saveEdit() : startEdit(entry)}
                      className={`p-2 rounded-full transition-all ${
                        isEditing
                          ? 'bg-sage-100 text-sage-600 shadow-sm ring-1 ring-sage-200'
                          : 'text-gray-300 hover:text-sage-600'
                      }`}
                    >
                      <Pencil size={16} />
                    </button>
                  )}
                  <button onClick={() => setExpandedId(expanded ? null : entry.id)} className="p-1 text-gray-400">
                    {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-4 pb-4 space-y-3 border-t border-gray-50 pt-3">
                  {isEditing ? (
                    <>
                      {/* Photo edit */}
                      {editData.photoUrl ? (
                        <div className="relative">
                          <img src={editData.photoUrl} alt="Skin" className="w-full rounded-xl" />
                          <button onClick={() => setEditData(d => ({ ...d, photoUrl: undefined }))} className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm">✕</button>
                        </div>
                      ) : (
                        <div className="flex gap-3">
                          <button type="button" onClick={() => handleEditPhoto(true)} className="flex-1 h-20 border-2 border-dashed border-sage-300 rounded-xl flex flex-col items-center justify-center text-sage-600 hover:bg-sage-50 transition-colors">
                            <Camera size={20} /><span className="text-[10px] mt-1 font-medium">Take</span>
                          </button>
                          <button type="button" onClick={() => handleEditPhoto(false)} className="flex-1 h-20 border-2 border-dashed border-sage-300 rounded-xl flex flex-col items-center justify-center text-sage-600 hover:bg-sage-50 transition-colors">
                            <Image size={20} /><span className="text-[10px] mt-1 font-medium">Choose</span>
                          </button>
                        </div>
                      )}
                      <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Title</label><input value={editData.title || ''} onChange={e => setEditData(d => ({ ...d, title: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-sage-300 mt-1" /></div>
                      <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider">How it looks</label><textarea value={editData.skinLook || ''} onChange={e => setEditData(d => ({ ...d, skinLook: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-sage-300 resize-none mt-1" rows={2} /></div>
                      <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider">How it feels</label><textarea value={editData.skinFeel || ''} onChange={e => setEditData(d => ({ ...d, skinFeel: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-sage-300 resize-none mt-1" rows={2} /></div>
                      <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider">MCAS / POTS</label><textarea value={editData.mcasPots || ''} onChange={e => setEditData(d => ({ ...d, mcasPots: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-sage-300 resize-none mt-1" rows={2} /></div>
                      <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Notes</label><textarea value={editData.notes || ''} onChange={e => setEditData(d => ({ ...d, notes: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-sage-300 resize-none mt-1" rows={2} /></div>
                      <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Tags</label><TagDisplay tags={editData.tags || []} onAddClick={() => setShowEditTagPicker(true)} /></div>
                      <div className="flex gap-2">
                        <button onClick={saveEdit} className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-sage-600 text-white rounded-xl text-sm font-medium hover:bg-sage-700 transition-colors"><Check size={14} /> Save</button>
                        <button onClick={() => { setEditingId(null); setEditData({}) }} className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium"><X size={14} /> Discard</button>
                      </div>
                    </>
                  ) : (
                    <>
                      {entry.photoUrl && <img src={entry.photoUrl} alt="Skin" className="w-full rounded-xl" />}
                      {entry.skinLook && <div><p className="text-[10px] font-bold text-sage-500 uppercase tracking-widest mb-1">How It Looks</p><p className="text-sm text-gray-700">{entry.skinLook}</p></div>}
                      {entry.skinFeel && <div><p className="text-[10px] font-bold text-sage-500 uppercase tracking-widest mb-1">How It Feels</p><p className="text-sm text-gray-700">{entry.skinFeel}</p></div>}
                      {entry.mcasPots && <div><p className="text-[10px] font-bold text-sage-500 uppercase tracking-widest mb-1">MCAS / POTS</p><p className="text-sm text-gray-700">{entry.mcasPots}</p></div>}
                      {entry.notes && <div><p className="text-[10px] font-bold text-sage-500 uppercase tracking-widest mb-1">Notes</p><p className="text-sm text-gray-700">{entry.notes}</p></div>}
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {entry.tags.map(tag => <span key={tag} className="text-[10px] px-2 py-0.5 bg-sage-100 text-sage-700 rounded-full">{tag}</span>)}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
