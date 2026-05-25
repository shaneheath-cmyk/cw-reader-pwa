'use client'
import { useState } from 'react'
import { login } from '@/lib/auth'

export default function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await login(email, password)
      onLogin()
    } catch {
      setError('Invalid email or password.')
    } finally { setLoading(false) }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-obsidian px-6">
      {/* Logo */}
      <div className="mb-10 text-center">
        <h1 className="font-headline text-4xl text-aurum tracking-widest">Collective Writings</h1>
        <p className="font-label text-sm text-ecru/50 mt-1 tracking-[0.2em]">MEMBER LIBRARY</p>
      </div>

      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full bg-charcoal border border-aurum/30 text-ecru px-4 py-3 rounded focus:outline-none focus:border-aurum placeholder-ecru/30 font-headline text-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full bg-charcoal border border-aurum/30 text-ecru px-4 py-3 rounded focus:outline-none focus:border-aurum placeholder-ecru/30 font-headline text-lg"
        />
        {error && <p className="text-red-400 text-sm font-label tracking-wider">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-aurum text-obsidian font-label tracking-[0.15em] py-3 rounded hover:bg-aurum/90 transition disabled:opacity-50 text-lg"
        >
          {loading ? 'SIGNING IN...' : 'ENTER LIBRARY'}
        </button>
      </form>

      <p className="mt-8 text-ecru/30 text-sm font-label tracking-widest">
        COLLECTIVE WRITINGS · MEMBER ACCESS
      </p>
    </div>
  )
}
