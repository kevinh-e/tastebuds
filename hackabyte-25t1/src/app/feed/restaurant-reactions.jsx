"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import EmojiPicker from "emoji-picker-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Quick reactions for common emotions
const quickReactions = [
  { id: "👍", label: "Like" },
  { id: "❤️", label: "Love" },
  { id: "🔥", label: "Hot" },
  { id: "☕", label: "Coffee" },
  { id: "🍽️", label: "Food" },
  { id: "💰", label: "Pricey" },
  { id: "👎", label: "Dislike" },
]

export function RestaurantReactions({ onReactionChange, currentReaction }) {
  const [selectedReaction, setSelectedReaction] = useState(currentReaction)
  const [showTooltip, setShowTooltip] = useState(null)
  const [recentEmojis, setRecentEmojis] = useState([])

  useEffect(() => {
    setSelectedReaction(currentReaction)
  }, [currentReaction])

  useEffect(() => {
    // Load recent emojis from localStorage
    try {
      const saved = localStorage.getItem("recentEmojis")
      if (saved) {
        setRecentEmojis(JSON.parse(saved))
      }
    } catch (e) {
      console.error("Failed to load recent emojis", e)
    }
  }, [])

  const saveRecentEmoji = (emoji) => {
    const updated = [emoji, ...recentEmojis.filter((e) => e !== emoji)].slice(0, 8)
    setRecentEmojis(updated)
    try {
      localStorage.setItem("recentEmojis", JSON.stringify(updated))
    } catch (e) {
      console.error("Failed to save recent emojis", e)
    }
  }

  const handleReactionClick = (emoji) => {
    const newReaction = selectedReaction === emoji ? null : emoji
    setSelectedReaction(newReaction)
    if (onReactionChange) {
      onReactionChange(newReaction)
    }

    if (newReaction) {
      saveRecentEmoji(newReaction)
    }
  }

  const handleEmojiSelect = (emojiData) => {
    handleReactionClick(emojiData.emoji)
  }

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-3">How do you feel about this place?</h3>

      <div className="flex flex-wrap gap-2 justify-center mb-2">
        {quickReactions.map((reaction) => {
          const isSelected = selectedReaction === reaction.id

          return (
            <div key={reaction.id} className="relative">
              <Button
                variant="outline"
                size="icon"
                className={`relative h-12 w-12 rounded-full transition-all duration-200 ${
                  isSelected ? `bg-primary text-white border-transparent` : "hover:bg-muted"
                }`}
                onClick={() => handleReactionClick(reaction.id)}
                onMouseEnter={() => setShowTooltip(reaction.id)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <span className="text-xl">{reaction.id}</span>
                <span className="sr-only">{reaction.label}</span>

                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center text-[10px] text-white"
                  />
                )}
              </Button>

              <AnimatePresence>
                {showTooltip === reaction.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap z-10"
                  >
                    {reaction.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}

        {/* Emoji picker button */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full hover:bg-muted"
              onMouseEnter={() => setShowTooltip("picker")}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <Plus className="h-5 w-5" />
              <span className="sr-only">More emojis</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 border-none" align="center">
            <EmojiPicker
              onEmojiClick={handleEmojiSelect}
              searchPlaceholder="Search emoji..."
              width="100%"
              height="350px"
              previewConfig={{ showPreview: false }}
            />
          </PopoverContent>
        </Popover>

        <AnimatePresence>
          {showTooltip === "picker" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute mt-14 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap z-10"
            >
              More emojis
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {selectedReaction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-center text-sm text-muted-foreground"
        >
        </motion.div>
      )}
    </div>
  )
}

