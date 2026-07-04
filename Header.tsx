import { Moon, Sun, Search, Package, Plus } from 'lucide-react'
import { useTheme } from '../lib/theme'

interface Props {
  search: string
  onSearch: (v: string) => void
  onOpenRequest: () => void
}

export default function Header({ search, onSearch, onOpenRequest }: Props) {
  const { theme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
            <Package size={20} />
          </div>
          <span className="hidden text-lg font-extrabold text-slate-900 dark:text-white sm:block">
            متجر إبراهيم
          </span>
        </div>

        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="ابحث عن تطبيق أو لعبة..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2.5 pr-10 pl-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800 dark:focus:ring-emerald-900/30"
          />
        </div>

        <button
          onClick={onOpenRequest}
          className="inline-flex items-center gap-1.5 rounded-2xl bg-emerald-500 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-600 active:scale-95"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">طلب تطبيق</span>
        </button>

        <button
          onClick={toggle}
          aria-label="تبديل الوضع"
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition-all hover:bg-slate-100 active:scale-95 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  )
}
