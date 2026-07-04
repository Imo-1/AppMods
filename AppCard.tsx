import { Download, Gamepad2, AppWindow } from 'lucide-react'
import { motion } from 'framer-motion'
import type { AppItem } from '../lib/store'
import { computeAverage, ratingCount } from '../lib/store'
import RatingStars from './RatingStars'

interface Props {
  app: AppItem
  onDownload: (app: AppItem) => void
  onClick: (app: AppItem) => void
}

export default function AppCard({ app, onDownload, onClick }: Props) {
  const avg = computeAverage(app.ratings)
  const rc = ratingCount(app.ratings)

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDownload(app)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={() => onClick(app)}
      className="group cursor-pointer rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm transition-all hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-600"
    >
      <div className="flex items-start gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-700 ring-1 ring-slate-200 dark:ring-slate-600">
          {app.logoUrl ? (
            <img
              src={app.logoUrl}
              alt={app.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-slate-400">
              {app.category === 'game' ? <Gamepad2 size={24} /> : <AppWindow size={24} />}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-bold text-slate-900 dark:text-white">
            {app.name}
          </h3>
          <div className="mt-0.5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
              {app.category === 'game' ? 'لعبة' : 'تطبيق'}
            </span>
          </div>
          <div className="mt-1.5">
            <RatingStars value={avg} count={rc} size={13} />
          </div>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        {app.description}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
          <Download size={13} />
          {app.downloads.toLocaleString('en-US')} تحميل
        </span>
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-600 hover:shadow-md active:scale-95"
        >
          <Download size={14} />
          تحميل
        </button>
      </div>
    </motion.div>
  )
}
