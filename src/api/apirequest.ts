

export async function apiRequest(url:string, options?: RequestInit) {
    const res = await fetch(url, options)
    
    if (!res.ok){
        let body
        try{
            body = await res.json()
        } catch {
            throw new Error("Unknown backend error")
        }
        throw body
    }
    return res.json()
}