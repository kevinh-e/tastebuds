import * as React from "react"
import { cn } from "@/lib/utils" // remove if not using

export function Badge({
    className,
    variant = "default",
    ...props
}) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                variant === "default" &&
                "bg-muted text-muted-foreground border border-transparent",
                variant === "outline" &&
                "border border-muted-foreground text-muted-foreground",
                className
            )}
            {...props}
        />
    )
}
