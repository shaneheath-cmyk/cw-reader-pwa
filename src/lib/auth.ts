// Shared auth with CW Library backend
// Token stored in localStorage, validated on each load

const CW_API = process.env.NEXT_PUBLIC_CW_API_URL || 'https://read.collectivewritings.com.au/api'

export interface Subscriber {
  id: string
  email: string
  full_name: string
  plan: string
  entitled_titles: string[]
}

export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${CW_API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) throw new Error('Invalid credentials')
  const data = await res.json()
  localStorage.setItem('cw_token', data.token)
  return data.token
}

export async function getSubscriber(): Promise<Subscriber | null> {
  const token = localStorage.getItem('cw_token')
  if (!token) return null
  try {
    const res = await fetch(`${CW_API}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) { logout(); return null }
    return res.json()
  } catch { return null }
}

export function logout() {
  localStorage.removeItem('cw_token')
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('cw_token')
}
