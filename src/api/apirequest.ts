

export async function apiRequest(url:string, options?: RequestInit) {
    const res = await fetch(url, options)
    
    if (!res.ok){
        let body
        try{
            body = await res.json()
        } catch {
            throw new Error("Unknown backend error")
        }
        throw new Error(body?.message || "Request failed")
    }
    const text = await res.text()
    return text ? JSON.parse(text) : null
}