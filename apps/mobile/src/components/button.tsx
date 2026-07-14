import { Pressable, Text, type PressableProps } from "react-native"

import { cn } from "@/lib/cn"

type Variant = "default" | "outline" | "destructive"
type Size = "default" | "lg" | "sm" | "icon"

const VARIANT_STYLES: Record<Variant, string> = {
  default: "bg-primary dark:bg-primary-dark",
  outline: "border border-border dark:border-border-dark bg-transparent",
  destructive: "bg-destructive dark:bg-destructive-dark",
}

const VARIANT_TEXT_STYLES: Record<Variant, string> = {
  default: "text-primary-foreground dark:text-primary-foreground-dark",
  outline: "text-foreground dark:text-foreground-dark",
  destructive: "text-destructive-foreground",
}

const SIZE_STYLES: Record<Size, string> = {
  default: "px-4 py-2.5",
  lg: "px-6 py-3.5",
  sm: "px-3 py-1.5",
  icon: "size-10 items-center justify-center p-0",
}

export function Button({
  variant = "default",
  size = "default",
  className,
  textClassName,
  disabled,
  children,
  ...props
}: PressableProps & {
  variant?: Variant
  size?: Size
  className?: string
  textClassName?: string
  children: React.ReactNode
}) {
  return (
    <Pressable
      className={cn(
        "flex-row items-center justify-center gap-2 rounded-md",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        disabled && "opacity-50",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {typeof children === "string" ? (
        <Text
          className={cn(
            "text-center font-medium",
            VARIANT_TEXT_STYLES[variant],
            textClassName
          )}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  )
}
