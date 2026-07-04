import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Search, Inbox, Loader2 } from 'lucide-react'
import type { AppItem } from '../lib/store'
import AppCard from '../components/AppCard'
import AppDetail from '../components/AppDetail'
import RatingDialog from '../components/RatingDialog'
import RequestModal from '../components/RequestModal'
import Header from '../components/Header'
import { incrementDownload } from '../lib/store'

interface Props {
  apps: AppItem[]
  loading: boolean
  userId: string
  onOpenAdmin: () => void
}

type Filter = 'all' | 'app' | 'game'

export default function Store({ apps, loading, userId, onOpenAdmin }: Props) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [selected, setSelected] = useState<AppItem | null>(null)
  const [ratingApp, setRatingApp] = useState<AppItem | null>(null)
  const [showRequest, setShowRequest] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return apps.filter((a) => {
      if (filter !== 'all' && a.category !== filter) return false
      if (q && !a.name.toLowerCase().includes(q) && !a.description.toLowerCase().includes(q))
        return false
      return true
    })
  }, [apps, search, filter])

  const handleDownload = async (app: AppItem) => {
    // increment count first (real download), then open direct link
    incrementDownload(app.id, app.downloads).catch(() => {})
    window.location.href = app.downloadUrl
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Header
        search={search}
        onSearch={setSearch}
        onOpenRequest={() => setShowRequest(true)}
      />

      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Filter tabs */}
        <div className="mb-6 flex items-center gap-2">
          {([
            { k: 'all', label: 'الكل' },
            { k: 'app', label: 'تطبيقات' },
            { k: 'game', label: 'ألعاب' },
          ] as { k: Filter; label: string }[]).map((t) => (
            <button
              key={t.k}
              onClick={() => setFilter(t.k)}
              className={`rounded-2xl px-4 py-2 text-sm font-semibold transition-all ${
                filter === t.k
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
          <button
            onClick={onOpenAdmin}
            className="mr-auto rounded-2xl px-4 py-2 text-sm font-medium text-slate-400 transition-all hover:text-slate-600 dark:hover:text-slate-200"
          >
            لوحة التحكم
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin text-emerald-500\" size={40} />
            <p className="mt-3 text-sm text-slate-400">جاري تحميل المتجر...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-100 dark:bg-slate-800">
              {search ? <Search size={32} className="text-slate-400" /> : <Inbox size={32} className="text-slate-400" />}
            </div>
            <p className="font-semibold text-slate-700 dark:text-slate-200">
              {search ? 'لا توجد نتائج مطابقة' : 'لا توجد تطبيقات بعد'}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {search ? 'جرّب كلمات بحث أخرى' : 'يمكنك إضافة تطبيقات من لوحة التحكم'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  onDownload={handleDownload}
                  onClick={(a) => setSelected(a)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      <AnimatePresence>
        {selected && (
          <AppDetail
            app={selected}
            userId={userId}
            onDownload={handleDownload}
            onRate={(a) => setRatingApp(a)}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>

      {ratingApp && (
        <RatingDialog
          app={ratingApp}
          userId={userId}
          onClose={() => setRatingApp(null)}
        />
      )}

      {showRequest && <RequestModal onClose={() => setShowRequest(false)} />}
    </div>
  )
}
