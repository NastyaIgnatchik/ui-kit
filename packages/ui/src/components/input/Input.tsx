import { Input as ShadcnInput } from "@/shared/ui/shadcn/input"
import { forwardRef, type ComponentProps, type ReactNode, useId } from "react"
import { cn } from "@/shared/ui/shadcn/lib/utils"

export type ShadcnInputProps = ComponentProps<typeof ShadcnInput>

export type WrapperProps = {
  label?: ReactNode
  error?: string
  id?: string
  description?: string
  required?: boolean
}

export type InputProps = ShadcnInputProps & WrapperProps

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      disabled,
      label,
      id,
      required,
      description,
      error,
      "aria-invalid": ariaInvalid,
      ...props
    },
    ref
  ) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const errorId = `${inputId}-error`
    const descriptionId = `${inputId}-description`

    return (
      <div>
        {label && (
          <label htmlFor={inputId} className="text-xs text-muted-foreground">
            {required && <span aria-hidden="true" className="text-lg text-destructive"> *</span>}{" "}
            {label}
          </label>
        )}
        <ShadcnInput
          id={inputId}
          ref={ref}
          aria-invalid={ariaInvalid ?? error !== undefined}
          required={required}
          aria-describedby={
            error ? errorId : description ? descriptionId : undefined
          }
          disabled={disabled}
          className={cn(
            "rounded-xs placeholder:text-muted-foreground/50 hover:border-border-hover focus:border-border-hover focus-visible:border-input disabled:bg-input/20 disabled:focus-visible:ring-0",
            className
          )}
          {...props}
        />

        {description && !error && (
          <span id={descriptionId} className="text-xs text-muted-foreground">
            {description}
          </span>
        )}
        {error && (
          <p
            id={errorId}
            role="alert"
            className="my-1 text-sm text-destructive"
          >
            {error}
          </p>
        )}
      </div>
    )
  }
)
