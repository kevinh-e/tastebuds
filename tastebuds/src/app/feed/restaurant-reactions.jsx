"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import EmojiPicker from "emoji-picker-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useAppContext } from "@/context/AppContext"

// Quick reactions for common emotions
const quickReactions = [
  { id: "👍", label: "Like" },
  { id: "❤️", label: "Love" },
  { id: "🔥", label: "Hot" },
  { id: "💰", label: "Pricey" },
  { id: "👎", label: "Dislike" },
]

export function RestaurantReactions({ onReactionChange, currentReaction }) {
  const [selectedReaction, setSelectedReaction] = useState(currentReaction)
  const [hoveredReaction, setHoveredReaction] = useState(null)
  const [recentEmojis, setRecentEmojis] = useState([])
  const [isPickerOpen, setIsPickerOpen] = useState(false)
  const { restIndex } = useAppContext()

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

  useEffect(() => {
    setSelectedReaction(null)
  }, [restIndex])

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
    setIsPickerOpen(false)
  }

  return (
    <div className="flex justify-center items-center max-w-sm mx-auto px-4 sm:max-w-md lg:max-w-lg">
      {/* Quick Reactions */}
      <div className="flex items-center justify-center gap-3 mb-4">
        {quickReactions.map((reaction) => {
          const isSelected = selectedReaction === reaction.id
          const isHovered = hoveredReaction === reaction.id

          return (
            <div key={reaction.id} className="relative">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  className={`
                    relative h-14 w-14 rounded-full border-2 transition-all duration-200
                    ${
                      isSelected
                        ? "bg-muted border-primary text-primary-foreground shadow-lg"
                        : "hover:border-primary/50 hover:shadow-md"
                    }
                  `}
                  onClick={() => handleReactionClick(reaction.id)}
                  onMouseEnter={() => setHoveredReaction(reaction.id)}
                  onMouseLeave={() => setHoveredReaction(null)}
                >
                  <span className="text-2xl">{reaction.id}</span>
                  <span className="sr-only">{reaction.label}</span>

                  {/* Selected indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute -top-1 -right-1 h-5 w-5 bg-primary border-2 border-background rounded-full flex items-center justify-center"
                    >
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </motion.div>
                  )}
                </Button>
              </motion.div>

              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.9 }}
                    className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50"
                  >
                    <div className="relative px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg shadow-lg">
                      {reaction.label}
                      {/* Tooltip arrow pointing downward */}
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}

        {/* More Emojis Button */}
        <div className="relative">
          <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
            <PopoverTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-14 w-14 rounded-full border-2 border-dashed hover:bg-muted hover:border-muted-foreground/40 transition-all duration-200 bg-transparent"
                  onMouseEnter={() => setHoveredReaction("picker")}
                  onMouseLeave={() => setHoveredReaction(null)}
                >
                  <Plus className="h-5 w-5" />
                  <span className="sr-only">More emojis</span>
                </Button>
              </motion.div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none shadow-xl" align="center" sideOffset={8}>
              <EmojiPicker
                onEmojiClick={handleEmojiSelect}
                searchPlaceholder="Search emoji..."
                width="320px"
                height="400px"
                previewConfig={{ showPreview: false }}
                skinTonesDisabled
              />
            </PopoverContent>
          </Popover>

          {/* Tooltip for picker button */}
          <AnimatePresence>
            {hoveredReaction === "picker" && !isPickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.9 }}
                className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50"
              >
                <div className="px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
                  More emojis
                  <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
