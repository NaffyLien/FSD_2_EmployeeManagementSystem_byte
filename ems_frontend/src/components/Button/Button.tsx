import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variantClasses: Record<string, string> = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  secondary: 'bg-slate-200 text-slate-800 hover:bg-slate-300',
  ghost: 'bg-transparent text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-800',
}

const sizeClasses: Record<string, string> = {
  sm: 'py-1.5 px-3.5 text-[13px]',
  md: 'py-2.5 px-5 text-sm',
  lg: 'py-3.5 px-7 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold cursor-pointer border-0 transition-all duration-200 whitespace-nowrap',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  )
}
