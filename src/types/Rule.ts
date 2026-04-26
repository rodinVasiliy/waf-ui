export type RuleListItem = {
  id: string
  name: string
  enabled: boolean
}

export type ActionParamView = {
  id: string
  name: string
}

export type PolicyActionParamView = {
  id: string
  name: string
  actions: ActionParamView[]
}

export type RuleDetail = {
  id: string
  name: string
  enabled: boolean
  actions: ActionParamView[]
  policyActionParams: PolicyActionParamView[]
}