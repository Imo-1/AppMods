import { Star } from 'lucide-react'

interface Props {
  value: number
  count?: number
  size?: number
}

export default function RatingStars({ value, count, size = 16 }: Props) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = value >= n - 0.25
          const half = value >= n - 0.75 && value < n - 0.25
          return (
            <div key={n} className="relative" style={{ width: size, height: size }}>
              <Star
                size={size}
                className="absolute inset-0 text-slate-300 dark:text-slate-600"
              />
              {(filled || half) && (
                <Star
                  size={size}
                  className="absolute inset-0 text-amber-400"
                  fill="currentColor"
                  style={
                    half
                      ? { clipPath: 'inset(0 50% 0 0)' }
                      : undefined
                  }
                />
              )}
            </div>
          )
        })}
      </div>
      <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
        {value > 0 ? value.toFixed(1) : '—'}
      </span>
      {count !== undefined && (
        <span className="text-xs text-slate-400 dark:text-slate-500">
          ({count})
        </span>
      )}
    </div>
  )
}
