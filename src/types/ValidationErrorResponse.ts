export interface ValidationErrorResponse {
    code: "validation_error"
    fields: Record<string, string>
}