'use client'
import { useEffect, useState } from 'react'
import { getToken, logout } from '@/lib/auth'
import { getLibrary, Title } from '@/lib/library'
import EpubReader from './EpubReader'
import AudioPlayer from './AudioPlayer'

export default function LibraryHome({ onLogout }: { onLogout: () => void }) {
  const [titles,       setTitles]       = useState<Title[]>([])
  const [loading,      setLoading]      = useState(true)
  const [activeEpub,   setActiveEpub]   = useState<string | null>(null)
  const [activeAudio,  setActiveAudio]  = useState<{ url: string; title: string } | null>(null)
  const [activeTitle,  setActiveTitle]  = useState<Title | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) { onLogout(); return }
    getLibrary(token).then(t => { setTitles(t); setLoading(false) })
  }, [])

  function handleLogout() { logout(); onLogout() }

  if (activeEpub && activeTitle) return (
    <EpubReader
      epubUrl={activeEpub}
      title={activeTitle.title}
      onClose={() => { setActiveEpub(null); setActiveTitle(null) }}
    />
  )

  if (activeAudio) return (
    <AudioPlayer
      audioUrl={activeAudio.url}
      title={activeAudio.title}
      onClose={() => setActiveAudio(null)}
    />
  )

  return (
    <div className="min-h-screen bg-obsidian">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 border-b border-aurum/20 safe-top">
        <h1 className="font-headline text-2xl text-aurum tracking-widest">Collective Writings</h1>
        <button onClick={handleLogout} className="font-label text-xs text-ecru/40 tracking-widest hover:text-aurum transition">
          SIGN OUT
        </button>
      </header>

      {/* Library grid */}
      <main className="px-4 py-6">
        <p className="font-label text-xs text-ecru/40 tracking-[0.2em] mb-5">YOUR LIBRARY</p>

        {loading ? (
          <div className="flex justify-center mt-20">
            <div className="w-8 h-8 border-2 border-aurum border-t-transparent rounded-full animate-spin" />
          </div>
        ) : titles.length === 0 ? (
          <p className="text-ecru/40 font-headline text-lg text-center mt-20">No titles in your library yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {titles.map(t => (
              <TitleCard
                key={t.id}
                title={t}
                onRead={url  => { setActiveEpub(url);  setActiveTitle(t) }}
                onListen={url => setActiveAudio({ url, title: t.title })}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function TitleCard({
  title, onRead, onListen
}: {
  title: Title
  onRead:   (url: string) => void
  onListen: (url: string) => void
}) {
  const [loading, setLoading] = useState(false)
  const token = getToken()!

  async function openEpub() {
    setLoading(true)
    const { getEpubUrl } = await import('@/lib/library')
    const url = await getEpubUrl(title.id, token)
    onRead(url)
    setLoading(false)
  }

  async function openAudio() {
    setLoading(true)
    const { getAudioUrl } = await import('@/lib/library')
    const url = await getAudioUrl(title.id, token)
    onListen(url)
    setLoading(false)
  }

  return (
    <div className="bg-charcoal rounded-lg overflow-hidden border border-aurum/10">
      {title.cover_url
        ? <img src={title.cover_url} alt={title.title} className="w-full aspect-[2/3] object-cover" />
        : <div className="w-full aspect-[2/3] bg-deepblack flex items-center justify-center">
            <span className="font-headline text-aurum/30 text-4xl">CW</span>
          </div>
      }
      <div className="p-3 space-y-1">
        <p className="font-headline text-ecru text-sm leading-tight line-clamp-2">{title.title}</p>
        <p className="font-label text-xs text-ecru/40 tracking-wider">{title.author}</p>
        <div className="flex gap-2 pt-2">
          {title.has_epub && (
            <button onClick={openEpub} disabled={loading}
              className="flex-1 bg-aurum text-obsidian font-label text-xs tracking-wider py-1.5 rounded hover:bg-aurum/90 transition disabled:opacity-50">
              READ
            </button>
          )}
          {title.has_audio && (
            <button onClick={openAudio} disabled={loading}
              className="flex-1 border border-aurum text-aurum font-label text-xs tracking-wider py-1.5 rounded hover:bg-aurum/10 transition disabled:opacity-50">
              LISTEN
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
