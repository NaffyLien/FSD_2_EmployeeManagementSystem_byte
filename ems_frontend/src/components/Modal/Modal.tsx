import type { ReactNode } from 'react'
import { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses: Record<string, string> = {
    sm: 'max-w-[400px]',
    md: 'max-w-[560px]',
    lg: 'max-w-[720px]',
  }

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 z-[1000] sm:p-4"
      style={{ animation: 'fadeIn 0.15s ease' }}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl w-full max-h-[90vh] flex flex-col shadow-2xl sm:max-h-[85vh] sm:rounded-[20px] ${sizeClasses[size]}`}
        style={{ animation: 'slideUp 0.2s ease' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between py-5 px-6 border-b border-slate-200 sm:py-4 sm:px-5">
          <h2 className="text-lg font-bold text-slate-900 m-0">{title}</h2>
          <button
            className="bg-transparent border-none text-slate-500 cursor-pointer p-1 rounded-md flex items-center transition-all duration-200 hover:bg-slate-100 hover:text-slate-900"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto sm:p-5">{children}</div>
        <div className="flex py-5 px-6 rounded-b-[5px]  ">
        </div>
      </div>
    </div>
  )
}
