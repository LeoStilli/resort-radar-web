'use client'

import { useState } from 'react'

interface TrailMapProps {
  src: string
  resortName: string
}

export function TrailMap({ src, resortName }: TrailMapProps) {
  const [imgFailed, setImgFailed] = useState(false)
  const [lightbox, setLightbox] = useState(false)

  const isPdf = src.toLowerCase().includes('.pdf')

  if (isPdf) {
    const viewerSrc = `https://docs.google.com/viewer?url=${encodeURIComponent(src)}&embedded=true`
    return (
      <div className='space-y-3'>
        <div className='overflow-hidden rounded-2xl border border-white/10 bg-white/5' style={{ height: '580px' }}>
          <iframe
            src={viewerSrc}
            title={`${resortName} trail map`}
            className='h-full w-full'
            allow='fullscreen'
          />
        </div>
        <a
          href={src}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center justify-end gap-1.5 text-xs text-white/30 transition hover:text-gold'
        >
          <svg viewBox='0 0 16 16' fill='none' className='h-3.5 w-3.5' stroke='currentColor' strokeWidth='1.5'>
            <path strokeLinecap='round' strokeLinejoin='round' d='M4.75 11.25 11.25 4.75M11.25 4.75H6.75m4.5 0v4.5' />
          </svg>
          Open full map in new tab
        </a>
      </div>
    )
  }

  // Image fallback (for any future JPG/PNG maps)
  if (imgFailed) {
    return (
      <div className='flex h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5'>
        <svg viewBox='0 0 24 24' fill='none' className='h-8 w-8 text-white/20' stroke='currentColor' strokeWidth='1.5'>
          <path strokeLinecap='round' strokeLinejoin='round' d='M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z' />
        </svg>
        <p className='text-sm text-white/30'>Trail map unavailable</p>
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setLightbox(true)}
        className='group relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-gold/30'
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`${resortName} trail map`}
          onError={() => setImgFailed(true)}
          className='h-auto w-full object-contain'
        />
        <div className='absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100'>
          <span className='flex items-center gap-2 rounded-full bg-navy/80 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm'>
            <svg viewBox='0 0 24 24' fill='none' className='h-4 w-4' stroke='currentColor' strokeWidth='2'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15' />
            </svg>
            View Full Map
          </span>
        </div>
      </button>

      {lightbox && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm'
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            className='absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20'
          >
            <svg viewBox='0 0 24 24' fill='none' className='h-5 w-5' stroke='currentColor' strokeWidth='2'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18 18 6M6 6l12 12' />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`${resortName} trail map`}
            className='max-h-[90vh] max-w-[95vw] rounded-xl object-contain shadow-2xl'
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
