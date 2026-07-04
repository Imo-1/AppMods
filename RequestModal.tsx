import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Send, CheckCircle2 } from 'lucide-react'
import { addRequest } from '../lib/store'

interface Props {
  onClose: () => void
}

const MAX_NAME = 60
const MAX_TEXT = 150

export default function RequestModal({ onClose }: Props) {
  const [fullName, setFullName] = useState('')
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const nameValid = fullName.trim().length >= 3 && fullName.trim().split(/\s+/).length >= 3
  const textValid = text.trim().length >= 3 && text.length <= MAX_TEXT

  const submit = async () => {
    setError('')
    if (!nameValid) {
      setError('الرجاء إدخال الاسم الثلاثي كاملاً')
      return
    }
    if (!textValid) {
      setError('نص الطلب يجب أن يكون 3 أحرف على الأقل و 150 حرفاً كحد أقصى')
      return
    }
    setBusy(true)
    try {
      await addRequest(fullName.trim(), text.trim())
      setDone(true)
      setTimeout(onClose, 1200)
    } catch (e) {
      setError('حدث خطأ أثناء الإرسال، حاول مرة أخرى')
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
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            طلب تطبيق أو لعبة
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {done ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="mx-auto mb-3 text-emerald-500" size={48} />
            <p className="font-semibold text-slate-900 dark:text-white">
              تم إرسال طلبك بنجاح!
            </p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              سيتم مراجعة طلبك في لوحة التحكم
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                الاسم الثلاثي
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value.slice(0, MAX_NAME))}
                placeholder="مثال: محمد أحمد علي"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-700/50 dark:text-white dark:focus:bg-slate-700"
              />
              <div className="mt-1 text-left text-xs text-slate-400">
                {fullName.length}/{MAX_NAME}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                نص الطلب
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, MAX_TEXT))}
                placeholder="اكتب اسم التطبيق أو اللعبة المطلوب..."
                rows={3}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-700/50 dark:text-white dark:focus:bg-slate-700"
              />
              <div className="mt-1 text-left text-xs text-slate-400">
                {text.length}/{MAX_TEXT}
              </div>
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                {error}
              </p>
            )}

            <button
              onClick={submit}
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-3 font-semibold text-white shadow-md transition-all hover:bg-emerald-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? (
                'جاري الإرسال...'
              ) : (
                <>
                  <Send size={18} />
                  إرسال الطلب
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
