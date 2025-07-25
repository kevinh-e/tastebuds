"use client"

import { useState } from "react"
import { Smile } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ReactionSummary({ reactions = {} }) {
  const [showAll, setShowAll] = useState(false)

  const reactionCounts = Object.entries(reactions).reduce((acc, [userId, reaction]) => {
    if (!reaction) return acc
    acc[reaction] = (acc[reaction] || 0) + 1
    return acc
  }, {})

  const sortedReactions = Object.entries(reactionCounts).sort(([, countA], [, countB]) => countB - countA)
  const displayReactions = showAll ? sortedReactions : sortedReactions.slice(0, 3)
  const totalReactions = Object.values(reactionCounts).reduce((sum, count) => sum + count, 0)

  return (
    <div className="flex flex-wrap gap-2 h-8 items-center">
      <TooltipProvider>
        {totalReactions === 0 ? (
          <div className="h-full bg-muted rounded-full px-2 py-1 flex items-center gap-1 text-xs opacity-50">
            <Smile className="w-4 h-4" />
            <span className="text-xs">No reactions</span>
          </div>
        ) : (
          displayReactions.map(([emoji, count]) => (
            <Tooltip key={emoji}>
              <TooltipTrigger asChild>
                <div className="h-full bg-muted rounded-full px-2 py-1 flex items-center gap-1 text-xs">
                  <span className="text-base">{emoji}</span>
                  <span>{count}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>
                  {count} {count === 1 ? "person reacted" : "people reacted"} with {emoji}
                </p>
              </TooltipContent>
            </Tooltip>
          ))
        )}
      </TooltipProvider>

      {sortedReactions.length > 3 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="text-xs text-muted-foreground hover:text-foreground underline"
        >
          +{sortedReactions.length - 3} more
        </button>
      )}

      {showAll && sortedReactions.length > 3 && (
        <button
          onClick={() => setShowAll(false)}
          className="text-xs text-muted-foreground hover:text-foreground underline"
        >
          Show less
        </button>
      )}
    </div>
  )
}
