import { motion } from 'framer-motion'
import { X, Download, Star, Gamepad2, AppWindow } from 'lucide-react'
import type { AppItem } from '../lib/store'
import { computeAverage, ratingCount } from '../lib/store'
import RatingStars from './RatingStars'

interface Props {
  app: AppItem
  userId: string
  onDownload: (app: AppItem) => void
  onRate: (app: AppItem) => void
  onClose: () => void
}

export default function AppDetail({ app, userId, onDownload, onRate, onClose }: Props) {
  const avg = computeAverage(app.ratings)
  const rc = ratingCount(app.ratings)
  const userRating = app.ratings?.[userId] || 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl dark:bg-slate-800 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <div className="h-28 bg-gradient-to-br from-emerald-500 to-teal-600" />
          <button
            onClick={onClose}
            className="absolute left-4 top-4 rounded-full bg-black/20 p-2 text-white backdrop-blur hover:bg-black/30"
          >
            <X size={18} />
          </button>
          <div className="-mt-12 px-6">
            <div className="h-24 w-24 overflow-hidden rounded-3xl bg-white shadow-lg ring-4 ring-white dark:ring-slate-800">
              {app.logoUrl ? (
                <img src={app.logoUrl} alt={app.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400 dark:bg-slate-700">
                  {app.category === 'game' ? <Gamepad2 size={32} /> : <AppWindow size={32} />}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-4">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {app.name}
          </h2>
          <div className="mt-1 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              {app.category === 'game' ? 'لعبة' : 'تطبيق'}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 p-4 dark:bg-slate-700/40">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {avg > 0 ? avg.toFixed(1) : '—'}
              </span>
              <RatingStars value={avg} size={14} />
              <span className="mt-0.5 text-xs text-slate-400">{rc} تقييم</span>
            </div>
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-600" />
            <div className="flex flex-col items-center">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {app.downloads.toLocaleString('en-US')}
              </span>
              <Download size={16} className="mt-1 text-slate-400" />
              <span className="mt-0.5 text-xs text-slate-400">تحميل</span>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="mb-2 text-sm font-bold text-slate-900 dark:text-white">
              الوصف
            </h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {app.description}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => onDownload(app)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3.5 font-bold text-white shadow-md transition-all hover:bg-emerald-600 active:scale-95"
            >
              <Download size={20} />
              تحميل مباشر
            </button>
            <button
              onClick={() => onRate(app)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50 active:scale-95 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Star size={18} className="text-amber-400" fill="currentColor" />
              {userRating > 0 ? `تعديل تقييمك (${userRating})` : 'تقييم التطبيق'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
