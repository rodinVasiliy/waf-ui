

export async function apiRequest(url: string, options?: RequestInit) {
  const res = await fetch(url, options)

  console.log("STATUS:", res.status)

  if (!res.ok) {
    let body

    try {
      body = await res.json()
    } catch {
      throw new Error("Unknown backend error")
    }

    throw body 
  }

  const text = await res.text()
  return text ? JSON.parse(text) : null
}