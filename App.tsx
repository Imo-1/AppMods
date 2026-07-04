import { useEffect, useState } from 'react'
import { ThemeProvider } from './lib/theme'
import { useOnlineStatus } from './lib/useOnlineStatus'
import { subscribeApps, type AppItem } from './lib/store'
import Store from './pages/Store'
import Admin from './pages/Admin'

const USER_ID_KEY = 'ib_uid'

function getOrCreateUserId(): string {
  let id = localStorage.getItem(USER_ID_KEY)
  if (!id) {
    id = 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
    localStorage.setItem(USER_ID_KEY, id)
  }
  return id
}

function OfflineScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 text-center dark:bg-slate-950">
      <img
        src="/images/offline.svg"
        alt="لا يوجد اتصال"
        className="mb-6 w-56 max-w-[70vw]"
      />
      <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
        عذرًا، لا يتوفر اتصال بالإنترنت
      </h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        يرجى التحقق من اتصالك بالإنترنت ثم المحاولة مرة أخرى
      </p>
    </div>
  )
}

function AppInner() {
  const online = useOnlineStatus()
  const [view, setView] = useState<'store' | 'admin'>('store')
  const [apps, setApps] = useState<AppItem[]>([])
  const [loading, setLoading] = useState(true)
  const [userId] = useState(() => getOrCreateUserId())

  useEffect(() => {
    if (!online) return
    const unsub = subscribeApps((list) => {
      setApps(list)
      setLoading(false)
    })
    return unsub
  }, [online])

  if (!online) return <OfflineScreen />

  if (view === 'admin') {
    return <Admin onBack={() => setView('store')} />
  }

  return (
    <Store
      apps={apps}
      loading={loading}
      userId={userId}
      onOpenAdmin={() => setView('admin')}
    />
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  )
}
