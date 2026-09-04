import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/shared/ui/shadcn/lib/utils"
import { forwardRef, type ComponentProps } from "react"
import { Button as ShadcnButton } from "@/shared/ui/shadcn/button"

export type VariantsProps = VariantProps<typeof button>
export type ShadcnButtonProps = ComponentProps<typeof ShadcnButton>
export type ButtonProps = ShadcnButtonProps & VariantsProps

const button = cva("rounded-xs border-2 enabled:cursor-pointer", {
  variants: {
    variant: {
      default: "text-white",
      destructive:
        "bg-destructive text-white hover:bg-destructive/60 dark:bg-destructive/70 dark:hover:bg-destructive/50",
      outline: "",
      secondary: "",
      ghost: "",
      link: "",
    },
  },
  defaultVariants: { variant: "default" },
})

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => (
    <ShadcnButton
      ref={ref}
      variant={variant}
      className={cn(button({ variant }), className)}
      {...props}
    />
  )
)
