import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Plus,
  Trash2,
  Inbox,
  Loader2,
  Package,
  Mail,
} from 'lucide-react'
import {
  addApp,
  deleteApp,
  deleteRequest,
  subscribeApps,
  subscribeRequests,
  type AppItem,
  type AppRequest,
} from '../lib/store'

interface Props {
  onBack: () => void
}

const MEDIAFIRE_REGEX =
  /^https:\/\/download\d+\.mediafire\.com\/.+\/.+\.apk$/

export default function Admin({ onBack }: Props) {
  const [apps, setApps] = useState<AppItem[]>([])
  const [requests, setRequests] = useState<AppRequest[]>([])
  const [tab, setTab] = useState<'apps' | 'requests'>('apps')

  // form
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [downloadUrl, setDownloadUrl] = useState('')
  const [category, setCategory] = useState<'app' | 'game'>('app')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const u1 = subscribeApps(setApps)
    const u2 = subscribeRequests(setRequests)
    return () => {
      u1()
      u2()
    }
  }, [])

  const submit = async () => {
    setError('')
    setSuccess('')
    if (!name.trim()) return setError('اسم التطبيق مطلوب')
    if (!description.trim()) return setError('وصف التطبيق مطلوب')
    if (!logoUrl.trim()) return setError('رابط الشعار مطلوب')
    if (!downloadUrl.trim()) return setError('رابط التحميل مطلوب')
    if (!MEDIAFIRE_REGEX.test(downloadUrl.trim())) {
      return setError(
        'رابط التحميل يجب أن يكون بالشكل: https://download[رقم].mediafire.com/[...]/[اسم].apk'
      )
    }
    setBusy(true)
    try {
      await addApp({
        name: name.trim(),
        description: description.trim(),
        logoUrl: logoUrl.trim(),
        downloadUrl: downloadUrl.trim(),
        category,
      })
      setSuccess('تمت إضافة التطبيق بنجاح')
      setName('')
      setDescription('')
      setLogoUrl('')
      setDownloadUrl('')
      setCategory('app')
      setTimeout(() => setSuccess(''), 3000)
    } catch (e) {
      setError('حدث خطأ أثناء الإضافة')
    } finally {
      setBusy(false)
    }
  }

  const removeApp = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التطبيق؟')) return
    await deleteApp(id)
  }

  const removeReq = async (id: string) => {
    await deleteRequest(id)
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowRight size={18} />
            العودة للمتجر
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 text-white">
              <Package size={18} />
            </div>
            <span className="font-extrabold text-slate-900 dark:text-white">
              لوحة التحكم
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setTab('apps')}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition-all ${
              tab === 'apps'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            التطبيقات والألعاب ({apps.length})
          </button>
          <button
            onClick={() => setTab('requests')}
            className={`flex items-center gap-1.5 rounded-2xl px-4 py-2 text-sm font-semibold transition-all ${
              tab === 'requests'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <Mail size={16} />
            الطلبات ({requests.length})
          </button>
        </div>

        {tab === 'apps' ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Add form */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                <Plus size={18} className="text-emerald-500" />
                إضافة تطبيق / لعبة
              </h3>
              <div className="space-y-3">
                <Field label="الاسم">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputCls}
                    placeholder="اسم التطبيق"
                  />
                </Field>
                <Field label="الوصف">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className={`${inputCls} resize-none`}
                    placeholder="وصف التطبيق"
                  />
                </Field>
                <Field label="رابط الشعار (Logo)">
                  <input
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className={inputCls}
                    placeholder="https://..."
                  />
                </Field>
                <Field label="رابط التحميل المباشر">
                  <input
                    value={downloadUrl}
                    onChange={(e) => setDownloadUrl(e.target.value)}
                    className={`${inputCls} font-mono text-xs`}
                    placeholder="https://download123.mediafire.com/.../file.apk"
                  />
                </Field>
                <Field label="النوع">
                  <div className="flex gap-2">
                    {(['app', 'game'] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`flex-1 rounded-xl py-2 text-sm font-semibold transition-all ${
                          category === c
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {c === 'app' ? 'تطبيق' : 'لعبة'}
                      </button>
                    ))}
                  </div>
                </Field>

                {error && (
                  <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    {success}
                  </p>
                )}

                <button
                  onClick={submit}
                  disabled={busy}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 font-semibold text-white shadow-md transition-all hover:bg-emerald-600 active:scale-95 disabled:opacity-50"
                >
                  {busy ? <Loader2 className="animate-spin\" size={18} /> : <Plus size={18} />}
                  إضافة
                </button>
              </div>
            </motion.div>

            {/* Apps list */}
            <div className="space-y-3">
              {apps.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
                  <Inbox size={32} className="text-slate-400\" />
                  <p className="mt-2 text-sm text-slate-400">لا توجد تطبيقات مضافة</p>
                </div>
              ) : (
                apps.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-700">
                      {a.logoUrl && (
                        <img src={a.logoUrl} alt={a.name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-slate-900 dark:text-white">
                        {a.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {a.category === 'game' ? 'لعبة' : 'تطبيق'} · {a.downloads} تحميل
                      </p>
                    </div>
                    <button
                      onClick={() => removeApp(a.id)}
                      className="rounded-xl p-2 text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-900/30"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 py-16 text-center dark:border-slate-700">
                <Mail size={32} className="text-slate-400\" />
                <p className="mt-2 text-sm text-slate-400">لا توجد طلبات جديدة</p>
              </div>
            ) : (
              requests.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {r.fullName}
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {r.requestText}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {new Date(r.createdAt).toLocaleString('ar-EG')}
                    </p>
                  </div>
                  <button
                    onClick={() => removeReq(r.id)}
                    className="rounded-xl p-2 text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const inputCls =
  'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-700/50 dark:text-white dark:focus:bg-slate-700'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </label>
      {children}
    </div>
  )
}
