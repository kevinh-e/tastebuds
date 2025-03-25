"use client"

import Image from "next/image"
import { Star, MapPin, ThumbsUp, ThumbsDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function RestaurantCard({ restaurant, rank, users, currentUser, showVotes = false }) {
  if (!restaurant || !restaurant.place) return null

  const place = restaurant.place
  const votes = restaurant.votes || { yes: [], no: [] }
  const reactions = restaurant.reactions || {}

  // Get restaurant details
  const name = place.displayName?.text || place.name
  const cuisine = place.primaryTypeDisplayName?.text || place.primaryType || "Restaurant"
  const location = place.shortFormattedAddress || place.formattedAddress
  const rating = place.rating || 0
  const price = place.priceLevel || "$$"

  // Get image URL
  const imageUrl =
    place.photos && place.photos.length > 0 ? place.photos[0].googleMapsUri : "/placeholder.svg?height=80&width=80"

  // Format reactions for display
  const formattedReactions = Object.entries(reactions).map(([emoji, userIds]) => ({
    emoji,
    users: Array.isArray(userIds) ? userIds : [userIds],
  }))

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <div className="flex items-start p-3 gap-3">
        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
          {rank <= 3 && (
            <div className="absolute top-0 left-0 bg-orange-500 text-white z-10 px-1.5 py-0.5 rounded-br-lg">
              <span className="text-xs font-bold">{rank}</span>
            </div>
          )}
          <Image src={imageUrl || "/placeholder.svg"} alt={name} fill className="object-cover" />
        </div>

        <div className="flex-1">
          <h3 className="font-bold">{name}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <Badge variant="outline" className="bg-orange-50 text-orange-600 hover:bg-orange-50 text-xs py-0">
              {cuisine}
            </Badge>
            <span>•</span>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-0.5" />
              {location}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-xs font-medium">{rating}</span>
            </div>
            <span className="text-muted-foreground text-xs">•</span>
            <div className="text-xs text-muted-foreground">{price}</div>
          </div>
        </div>
      </div>

      {showVotes && (
        <div className="px-3 pb-3 pt-1">
          {formattedReactions.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {formattedReactions.map((reaction, index) => (
                <Badge key={index} variant="secondary" className="text-xs py-0.5">
                  {reaction.emoji} {reaction.users.length}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex justify-between">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3.5 w-3.5 text-green-500" />
              <div className="flex -space-x-1.5">
                {votes.yes.map((userId) => {
                  const user = users.find((u) => u.id === userId)
                  return user ? (
                    <Avatar key={userId} className="h-5 w-5 border border-white">
                      <AvatarFallback
                        className={userId === currentUser ? "bg-orange-500 text-white text-xs" : "bg-gray-200 text-xs"}
                      >
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                  ) : null
                })}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <div className="flex -space-x-1.5">
                {votes.no.map((userId) => {
                  const user = users.find((u) => u.id === userId)
                  return user ? (
                    <Avatar key={userId} className="h-5 w-5 border border-white">
                      <AvatarFallback
                        className={userId === currentUser ? "bg-orange-500 text-white text-xs" : "bg-gray-200 text-xs"}
                      >
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                  ) : null
                })}
              </div>
              <ThumbsDown className="h-3.5 w-3.5 text-red-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

