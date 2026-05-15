import { useState } from 'react'
import { X, Plus, Check } from 'lucide-react'

interface TagCategory {
  category: string
  tags: string[]
}

const SKIN_TAGS: TagCategory[] = [
  { category: 'Changes', tags: ['Changed dosage', 'New medication', 'Started new product', 'Stopped a product', 'Stopped medication'] },
  { category: 'Diet', tags: ['Alcohol', 'Clean eating', 'Dairy', 'High sugar', 'High water intake', 'Low water intake', 'New supplement'] },
  { category: 'Lifestyle', tags: ['Exercise day', 'Great sleep', 'High stress', 'Low stress', 'Poor sleep', 'Rest day', 'Traveled'] },
  { category: 'MCAS / POTS', tags: ['Flushing', 'High histamine day', 'Low energy', 'MCAS flare', 'POTS flare', 'Salt loading'] },
  { category: 'Progress', tags: ['Best skin day', 'No change', 'Skin looks better', 'Skin looks worse', 'Worst skin day'] },
  { category: 'Skin Events', tags: ['Breakout', 'Dryness', 'Flare-up', 'Hives', 'Irritation', 'Peeling', 'Rash', 'Redness', 'Sunburn'] },
  { category: 'Weather', tags: ['Cold & dry', 'High UV', 'Hot & humid', 'Indoor all day', 'Windy'] },
]

const HAIR_TAGS: TagCategory[] = [
  { category: 'Changes', tags: ['New conditioner', 'New shampoo', 'New styling product', 'New tool/technique', 'Stopped a product'] },
  { category: 'Event', tags: ['Bleach', 'Color/dye', 'Haircut', 'Self-styled', 'Styled by barber', 'Trim'] },
  { category: 'Growth', tags: ['New growth spots', 'No change', 'Noticeable growth', 'Shedding less', 'Shedding more'] },
  { category: 'Hair State', tags: ['Bad hair day', 'Dandruff', 'Dry', 'Frizzy', 'Good hair day', 'Itchy scalp', 'Oily', 'Thick', 'Thinning'] },
  { category: 'Lifestyle', tags: ['Air dried', 'Blow dried', 'Hat day', 'High humidity', 'No heat', 'Swam', 'Used heat'] },
]

interface TagPickerProps {
  type: 'skin' | 'hair'
  selectedTags: string[]
  onConfirm: (tags: string[]) => void
  onClose: () => void
}

export default function TagPicker({ type, selectedTags, onConfirm, onClose }: TagPickerProps) {
  const categories = type === 'skin' ? SKIN_TAGS : HAIR_TAGS
  const [localTags, setLocalTags] = useState<string[]>([...selectedTags])

  const hasChanges = JSON.stringify([...localTags].sort()) !== JSON.stringify([...selectedTags].sort())

  const toggleTag = (tag: string) => {
    setLocalTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-sm shadow-xl animate-pop-in flex flex-col"
        style={{ maxHeight: '70vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header — banner color */}
        <div className="flex items-center justify-between px-4 py-3 bg-warm-200 rounded-t-2xl flex-shrink-0">
          <h3 className="font-semibold text-warm-900 uppercase tracking-wider text-sm" style={{ fontFamily: "'WS Paradose', serif" }}>Add Tags</h3>
          <div className="flex items-center gap-1">
            <div className={`transition-all duration-300 ${hasChanges ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}>
              <button onClick={() => onConfirm(localTags)} className="p-2 text-emerald-600 hover:text-emerald-700 transition-colors">
                <Check size={20} strokeWidth={2.5} />
              </button>
            </div>
            <button onClick={onClose} className="p-2 text-warm-600 hover:text-warm-800">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable tag list */}
        <div className="overflow-y-auto flex-1">
          {categories.map(cat => (
            <div key={cat.category}>
              {/* Category header — nav bar color */}
              <div className="px-4 py-2 bg-warm-50/90 backdrop-blur-sm sticky top-0 z-10 border-b border-warm-200/50">
                <p className="text-xs font-bold text-warm-600 uppercase tracking-wider">{cat.category}</p>
              </div>
              <div className="px-4 py-2 flex flex-wrap gap-1.5">
                {cat.tags.map(tag => {
                  const selected = localTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                        selected
                          ? 'bg-sage-600 text-white border-sage-600'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-sage-300'
                      }`}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TagDisplay({ tags, onAddClick }: { tags: string[]; onAddClick: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-2">
      {tags.map(tag => (
        <span key={tag} className="text-xs px-3 py-1 bg-white text-gray-700 rounded-full border border-gray-200">{tag}</span>
      ))}
      <button
        onClick={onAddClick}
        className="w-7 h-7 bg-gray-100 text-gray-500 rounded-full border border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-200 transition-colors"
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
