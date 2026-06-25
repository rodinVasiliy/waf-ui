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

export type RuleMetaResponse = {
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

export type RuleDetail = {
  id: string
  name: string
  enabled: boolean
  actions: ActionParamView[]
  policies: ShortPolicyView[]
  policyOverrides: PolicyActionParamView[]
  expr: ExprView
}

export type PolicyActionParamView = {
  id: string
  name: string
  actions: ActionParamView[]
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

export type RuleOverrideForm = {
  id: string
  actions: string[]
}

export type RuleForm = {
  name: string
  enabled: boolean
  actions: string[]
  policies: string[]
  overrides: RuleOverrideForm[]
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

export const emptyRuleForm: RuleForm = {
  name: "",
  enabled: true,

  actions: [],
  policies: [],
  overrides: [],

  expr: {
    nodeType: "group",
    isNot: false,
    operator: "and",
    children: [],
  },
}