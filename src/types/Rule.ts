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
  nodeType: NodeType
  isNot: boolean

  operator?: OperatorType
  children?: ExprView[]

  match?: MatchType
  field?: ExprField
  value?: string
}

export type RuleForm = {
  name: string
  enabled: boolean
  actions: string[]
  overrides: Record<string, string[]>
  expr: ExprView
}

export type NodeType = "condition" | "group"

export type MatchType =
  | "equals"
  | "in"
  | "regex"

export type OperatorType =
  | "and"
  | "or"

export type ExprField =
  | "IP"
  | "Host"
  | "Path"
  | "Method"
  | "UA"
  | "CountryCode"