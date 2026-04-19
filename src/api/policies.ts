import type { PolicyListItem } from "../types/Policy";

const API_URL = "/admin/api/policies"

export async function fetchPolicies(): Promise<PolicyListItem[]> {
    const res = await fetch(API_URL)
    if (!res.ok) {
        throw Error("Failed to get policies")
    }
    return res.json()
}