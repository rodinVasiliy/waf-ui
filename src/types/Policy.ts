export interface PolicyListItem {
  id: string
  name: string
  wl: string[]
  webapps: string[]
}

export interface PolicyEdit {
  id: string
  name: string
  wl: string[]
  rules: PolicyRule[]
}

export interface PolicyRule {
  id: string
  name: string
  enabled: boolean
  actions: PolicyAction[]
}

export interface PolicyAction {
  id: string
  name: string
}