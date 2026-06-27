type ErrorProps = {
  field: string
  errors: Record<string,string>
}

export function ValidationError({
  field,
  errors,
}: ErrorProps) {

  if (!errors[field]) {
    return null
  }

  return (
    <div className="validation-error">
      {errors[field]}
    </div>
  )
}