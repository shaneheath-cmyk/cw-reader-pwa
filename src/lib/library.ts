// Fetches subscriber's entitled titles from CW Library backend

const CW_API = process.env.NEXT_PUBLIC_CW_API_URL || 'https://read.collectivewritings.com.au/api'

export interface Title {
  id: string
  title: string
  author: string
  cover_url: string
  has_epub: boolean
  has_audio: boolean
  genre: string
}

export async function getLibrary(token: string): Promise<Title[]> {
  const res = await fetch(`${CW_API}/library`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Could not load library')
  return res.json()
}

export async function getEpubUrl(titleId: string, token: string): Promise<string> {
  const res = await fetch(`${CW_API}/titles/${titleId}/epub-url`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Could not get epub')
  const data = await res.json()
  return data.signed_url
}

export async function getAudioUrl(titleId: string, token: string): Promise<string> {
  const res = await fetch(`${CW_API}/titles/${titleId}/audio-url`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) throw new Error('Could not get audio')
  const data = await res.json()
  return data.signed_url
}
