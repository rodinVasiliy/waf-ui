export type RuleListItem = {
  id: string
  name: string
  enabled: boolean
}

export type RuleDetailResponse = {
  rule: RuleDetail
  available_actions: ActionParamView[]
  available_policies: ShortPolicyView[]
}

export type ActionParamView = {
  id: string
  name: string
}

export type ShortPolicyView = {
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
  expr: ExprView
}

export type ExprView = {
  nodeType: string
  isNot: boolean
  operator?: string
  children?: ExprView[]
  match?: string
  field?: string
  value?: string
}

export type RuleForm = {
  name: string
  enabled: boolean
  actions: string[]
  overrides: Record<string, string[]>
  expr: ExprView
}