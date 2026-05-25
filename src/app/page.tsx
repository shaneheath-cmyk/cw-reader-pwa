'use client'
import { useEffect, useState } from 'react'
import { getSubscriber } from '@/lib/auth'
import LoginScreen from '@/components/LoginScreen'
import LibraryHome from '@/components/LibraryHome'

export default function Home() {
  const [loading, setLoading]   = useState(true)
  const [authed,  setAuthed]    = useState(false)

  useEffect(() => {
    getSubscriber().then(sub => {
      setAuthed(!!sub)
      setLoading(false)
    })
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-obsidian">
      <div className="w-8 h-8 border-2 border-aurum border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return authed
    ? <LibraryHome onLogout={() => setAuthed(false)} />
    : <LoginScreen  onLogin={() => setAuthed(true)} />
}
