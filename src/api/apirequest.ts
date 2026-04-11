

export async function apiRequest(url: string, options?: RequestInit) {
  const res = await fetch(url, options)

  if (!res.ok) {
    try {
      const body = await res.json()
      throw body
    } catch {
      throw new Error("Unknown backend error")
    }
  }

  const text = await res.text()
  return text ? JSON.parse(text) : null
}