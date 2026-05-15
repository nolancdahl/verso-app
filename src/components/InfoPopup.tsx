import { useState } from 'react'
import { Info, X } from 'lucide-react'

interface InfoPopupProps {
  content: string
  title?: string
}

export default function InfoPopup({ content, title }: InfoPopupProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 transition-colors"
      >
        <Info size={14} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/30" onClick={() => setOpen(false)}>
          <div
            className="bg-white rounded-2xl p-5 w-full max-w-md shadow-xl animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{title || 'Why this is good'}</h3>
              <button onClick={() => setOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
          </div>
        </div>
      )}
    </>
  )
}
