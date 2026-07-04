import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, X } from 'lucide-react'
import type { AppItem } from '../lib/store'
import { computeAverage, ratingCount, setRating } from '../lib/store'
import RatingStars from './RatingStars'

interface Props {
  app: AppItem
  userId: string
  onClose: () => void
}

export default function RatingDialog({ app, userId, onClose }: Props) {
  const [hover, setHover] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const current = app.ratings?.[userId] || 0
  const [selected, setSelected] = useState(current)
  const [busy, setBusy] = useState(false)

  const avg = computeAverage(app.ratings)
  const rc = ratingCount(app.ratings)

  const submit = async () => {
    if (selected < 1 || busy) return
    setBusy(true)
    try {
      await setRating(app.id, userId, selected)
      setSubmitted(true)
      setTimeout(onClose, 900)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            تقييم {app.name}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-5 flex items-center justify-between rounded-2xl bg-slate-50 p-3 dark:bg-slate-700/50">
          <span className="text-sm text-slate-500 dark:text-slate-400">المتوسط الحالي</span>
          <RatingStars value={avg} count={rc} size={16} />
        </div>

        {submitted ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
              <Star className="text-amber-400" fill="currentColor" size={28} />
            </div>
            <p className="font-semibold text-slate-900 dark:text-white">
              شكراً لتقييمك!
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              تم حفظ تقييمك بنجاح
            </p>
          </div>
        ) : (
          <>
            <div className="mb-5 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onMouseEnter={() => setHover(n)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setSelected(n)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={36}
                    className={
                      (hover || selected) >= n
                        ? 'text-amber-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }
                    fill="currentColor"
                  />
                </button>
              ))}
            </div>
            <button
              onClick={submit}
              disabled={selected < 1 || busy}
              className="w-full rounded-2xl bg-emerald-500 py-3 font-semibold text-white shadow-md transition-all hover:bg-emerald-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? 'جاري الحفظ...' : 'إرسال التقييم'}
            </button>
          </>
        )}
      </motion.div>
    </div>
  )
}
