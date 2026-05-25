'use client'
import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window { ePub: any }
}

export default function EpubReader({
  epubUrl, title, onClose
}: {
  epubUrl: string
  title:   string
  onClose: () => void
}) {
  const viewerRef  = useRef<HTMLDivElement>(null)
  const bookRef    = useRef<any>(null)
  const renditionRef = useRef<any>(null)
  const [fontSize,   setFontSize]   = useState(16)
  const [chapter,    setChapter]    = useState('')
  const [progress,   setProgress]   = useState(0)

  useEffect(() => {
    // Load epub.js dynamically
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/epubjs/dist/epub.min.js'
    script.onload = () => {
      if (!viewerRef.current) return
      const book = window.ePub(epubUrl)
      bookRef.current = book
      const rendition = book.renderTo(viewerRef.current, {
        width: '100%', height: '100%', flow: 'paginated'
      })
      renditionRef.current = rendition
      rendition.display()

      rendition.on('relocated', (location: any) => {
        setChapter(location.start.cfi)
        book.locations.percentageFromCfi(location.start.cfi).then((pct: number) => {
          setProgress(Math.round(pct * 100))
        })
      })

      rendition.themes.fontSize(`${fontSize}px`)
    }
    document.head.appendChild(script)
    return () => { bookRef.current?.destroy() }
  }, [epubUrl])

  function nextPage() { renditionRef.current?.next() }
  function prevPage() { renditionRef.current?.prev() }

  function changeFontSize(delta: number) {
    const newSize = Math.min(Math.max(fontSize + delta, 12), 28)
    setFontSize(newSize)
    renditionRef.current?.themes.fontSize(`${newSize}px`)
  }

  return (
    <div className="flex flex-col h-screen bg-obsidian safe-top safe-bottom">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-aurum/20">
        <button onClick={onClose} className="font-label text-xs text-ecru/50 tracking-widest hover:text-aurum transition">
          ← LIBRARY
        </button>
        <p className="font-headline text-sm text-ecru/70 truncate max-w-[180px]">{title}</p>
        <div className="flex items-center gap-2">
          <button onClick={() => changeFontSize(-1)} className="text-ecru/50 hover:text-aurum text-lg w-8 text-center">A-</button>
          <button onClick={() => changeFontSize(+1)} className="text-ecru/50 hover:text-aurum text-xl w-8 text-center">A+</button>
        </div>
      </div>

      {/* Epub viewer */}
      <div
        ref={viewerRef}
        className="flex-1 bg-ecru"
        style={{ touchAction: 'pan-y' }}
      />

      {/* Bottom bar */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-aurum/20">
        <button onClick={prevPage}
          className="font-label text-xs text-aurum tracking-widest px-4 py-2 border border-aurum/40 rounded hover:bg-aurum/10 transition">
          PREV
        </button>
        <span className="font-label text-xs text-ecru/40 tracking-widest">{progress}%</span>
        <button onClick={nextPage}
          className="font-label text-xs text-aurum tracking-widest px-4 py-2 border border-aurum/40 rounded hover:bg-aurum/10 transition">
          NEXT
        </button>
      </div>
    </div>
  )
}
