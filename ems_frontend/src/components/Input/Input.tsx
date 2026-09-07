import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, id, className = '', ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className={`flex flex-col gap-[6px] ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-[15px] font-inherit text-gray-900 bg-white transition-all duration-200 box-border focus:outline-none focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/15 placeholder:text-gray-400 ${error ? 'border-red-500 focus:ring-red-500/15' : ''}`}
        {...props}
      />
      {error && <span className="text-sm text-red-500 font-medium">{error}</span>}
    </div>
  )
}
