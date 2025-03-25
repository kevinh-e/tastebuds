"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function CopyButton({
  textToCopy,
  displayText,
  variant = "outline",
  className,
  buttonProps,
}) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(textToCopy)
    setCopied(true)

    // Reset after 2 seconds
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Button
      onClick={handleCopy}
      variant={variant}
      className={cn("flex items-center gap-2", className)}
      {...buttonProps}
    >
      {copied ? (
        <>
          <span>Copied!</span>
          <Check className="size-4" />
        </>
      ) : (
        <>
          <span>{`#${textToCopy}`}</span>
          <Copy className="size-4" />
        </>
      )}
    </Button>
  )
}

