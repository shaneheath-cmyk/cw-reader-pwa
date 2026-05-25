'use client'
import { useEffect, useRef, useState } from 'react'

export default function AudioPlayer({
  audioUrl, title, onClose
}: {
  audioUrl: string
  title:    string
  onClose:  () => void
}) {
  const audioRef   = useRef<HTMLAudioElement>(null)
  const [playing,  setPlaying]  = useState(false)
  const [current,  setCurrent]  = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setCurrent(audio.currentTime)
    const onLoad = () => setDuration(audio.duration)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onLoad)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoad)
    }
  }, [])

  function togglePlay() {
    const audio = audioRef.current!
    playing ? audio.pause() : audio.play()
    setPlaying(!playing)
  }

  function scrub(e: React.ChangeEvent<HTMLInputElement>) {
    const audio = audioRef.current!
    audio.currentTime = Number(e.target.value)
    setCurrent(Number(e.target.value))
  }

  function skip(seconds: number) {
    const audio = audioRef.current!
    audio.currentTime = Math.min(Math.max(audio.currentTime + seconds, 0), duration)
  }

  function fmt(s: number) {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = Math.floor(s % 60)
    return h > 0
      ? `${h}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
      : `${m}:${String(sec).padStart(2,'0')}`
  }

  return (
    <div className="flex flex-col h-screen bg-obsidian safe-top safe-bottom">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-aurum/20">
        <button onClick={onClose} className="font-label text-xs text-ecru/50 tracking-widest hover:text-aurum transition">
          ← LIBRARY
        </button>
        <p className="font-label text-xs text-ecru/30 tracking-widest">AUDIOBOOK</p>
        <div className="w-16" />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 space-y-8">
        {/* Cover placeholder */}
        <div className="w-48 h-48 bg-charcoal rounded-lg border border-aurum/20 flex items-center justify-center">
          <span className="font-headline text-5xl text-aurum/40">CW</span>
        </div>

        <div className="text-center">
          <h2 className="font-headline text-2xl text-ecru">{title}</h2>
          <p className="font-label text-xs text-ecru/40 tracking-widest mt-1">COLLECTIVE WRITINGS</p>
        </div>

        {/* Progress bar */}
        <div className="w-full space-y-2">
          <input
            type="range" min={0} max={duration || 100} value={current}
            onChange={scrub}
            className="w-full h-1 accent-aurum cursor-pointer"
          />
          <div className="flex justify-between font-label text-xs text-ecru/40 tracking-wider">
            <span>{fmt(current)}</span>
            <span>{fmt(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-8">
          <button onClick={() => skip(-30)}
            className="font-label text-xs text-ecru/50 hover:text-aurum transition tracking-widest">
            -30s
          </button>
          <button onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-aurum text-obsidian flex items-center justify-center hover:bg-aurum/90 transition shadow-lg">
            <span className="text-2xl">{playing ? '⏸' : '▶'}</span>
          </button>
          <button onClick={() => skip(+30)}
            className="font-label text-xs text-ecru/50 hover:text-aurum transition tracking-widest">
            +30s
          </button>
        </div>
      </div>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  )
}
