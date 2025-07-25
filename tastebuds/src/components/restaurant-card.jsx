"use client"
import { Star, MapPin, ThumbsUp, ThumbsDown, ExternalLink, Crown, Medal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Smile } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function RestaurantCard({
  restaurant,
  rank,
  users,
  currentUser,
  showVotes = false,
}) {
  const [imageError, setImageError] = useState(false)

  if (!restaurant || !restaurant.place) return null

  const place = restaurant.place
  const votes = restaurant.votes || { yes: [], no: [] }
  const reactions = restaurant.reactions || {}

  // Get restaurant details
  const name = place.displayName?.text || place.name
  const cuisine = place.primaryTypeDisplayName?.text || place.primaryType || "Restaurant"
  const location = place.shortFormattedAddress || place.formattedAddress
  const rating = place.rating || 0
  const totalVotes = votes.yes.length + votes.no.length
  const approvalRate = totalVotes > 0 ? Math.round((votes.yes.length / totalVotes) * 100) : 0

  // Price level formatting
  const getPriceDisplay = (priceLevel) => {
    switch (priceLevel) {
      case "PRICE_LEVEL_FREE":
      case "PRICE_LEVEL_INEXPENSIVE":
        return "$"
      case "PRICE_LEVEL_MODERATE":
        return "$$"
      case "PRICE_LEVEL_EXPENSIVE":
        return "$$$"
      case "PRICE_LEVEL_VERY_EXPENSIVE":
        return "$$$$"
      default:
        return "$$"
    }
  }

  const price = getPriceDisplay(place.priceLevel)
  const imageUrl = restaurant.thumbnail

  // Format reactions for display
  const formattedReactions = Object.entries(reactions).map(([userIds, emoji]) => ({
    users: Array.isArray(userIds) ? userIds : [userIds],
    emoji,
  }))

  // Get rank styling
  const getRankStyling = (rank) => {
    if (rank === 1) {
      return {
        icon: <Crown className="h-3 w-3 md:h-4 md:w-4" />,
        bgColor: "bg-gradient-to-r from-yellow-400 to-amber-500",
        textColor: "text-white",
        borderColor: "border-yellow-300",
      }
    } else if (rank === 2) {
      return {
        icon: <Medal className="h-3 w-3 md:h-4 md:w-4" />,
        bgColor: "bg-gradient-to-r from-gray-300 to-gray-400",
        textColor: "text-white",
        borderColor: "border-gray-300",
      }
    } else if (rank === 3) {
      return {
        icon: <Medal className="h-3 w-3 md:h-4 md:w-4" />,
        bgColor: "bg-gradient-to-r from-amber-600 to-orange-600",
        textColor: "text-white",
        borderColor: "border-amber-300",
      }
    }
    return {
      icon: null,
      bgColor: "bg-gray-100",
      textColor: "text-gray-700",
      borderColor: "border-gray-200",
    }
  }

  const rankStyle = getRankStyling(rank)

  // Check if current user voted
  const userVotedYes = votes.yes.includes(currentUser)
  const userVotedNo = votes.no.includes(currentUser)

  return (
    <Card
      className={`group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 shadow-sm p-1.5 ${
        rank <= 3 ? rankStyle.borderColor : "border-gray-100"
      } bg-white overflow-hidden`}
    >
      <CardContent className="p-0 h-full">
        <div className="flex h-full">
          {/* Image Section */}
          <div className="relative w-20 md:w-32 flex-shrink-0 bg-gray-100  rounded-tl-lg rounded-bl-lg overflow-hidden">
            {/* Rank Badge */}
            <div
              className={`absolute top-1.5 left-1.5 md:top-2 md:left-2 z-20 flex items-center gap-1 px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-xs md:text-sm font-bold shadow-lg ${rankStyle.bgColor} ${rankStyle.textColor}`}
            >
              {rankStyle.icon}
              <span>#{rank}</span>
            </div>

            {/* Restaurant Image */}
            <div className="relative w-full h-full overflow-hidden">
              {!imageError && imageUrl ? (
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={`${name} restaurant`}
                  className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  onError={() => setImageError(true)}
                  referrerPolicy="no-referrer"
                  draggable="false"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-100 via-amber-50 to-orange-100 flex flex-col items-center justify-center">
                  <div className="text-xl md:text-2xl mb-1">🍽️</div>
                  <div className="text-[10px] md:text-xs text-gray-500 font-medium px-1 text-center">No Image</div>
                </div>
              )}

              {/* Overlay on hover - only on desktop */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 hidden md:flex items-center justify-center">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-white/90 hover:bg-white text-gray-900 shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 text-xs"
                  asChild
                >
                  <a href={place.googleMapsUri} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col p-2 md:p-3 min-w-0 space-y-2">
            {/* Header - Fixed height */}
            <div className="flex-shrink-0 space-y-2">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold md:font-bold text-sm md:text-base text-gray-900 line-clamp-1 min-w-0 flex-1 group-hover:text-orange-600 transition-colors">
                  <a
                    href={place.googleMapsUri}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline truncate block"
                  >
                    {name}
                  </a>
                </h3>
                {approvalRate >= 80 && (
                  <Badge className="bg-green-100 text-green-700 border-green-200 shrink-0 text-xs px-1.5 py-0.5">
                    {approvalRate}%
                  </Badge>
                )}
              </div>

              {/* Restaurant Details - Fixed height */}
              <div className="flex flex-wrap items-center text-xs space-x-2">
                <Badge
                  variant="outline"
                  className="bg-orange-50 text-orange-700 border-orange-200 text-[10px] md:text-xs px-1 py-0 md:px-2 md:py-0.5 truncate"
                >
                  {cuisine}
                </Badge>

                {rating > 0 && (
                  <div className="flex items-center gap-0.5 bg-yellow-50 text-yellow-700 px-1 py-0.5 md:px-2 md:py-1 rounded-full border border-yellow-200">
                    <Star className="h-2.5 w-2.5 md:h-3 md:w-3 fill-current" />
                    <span className="font-medium text-[10px] md:text-xs">{rating.toFixed(1)}</span>
                  </div>
                )}

                <div className="flex items-center gap-0.5 text-gray-600 bg-gray-50 px-1 py-0.5 md:px-2 md:py-1 rounded-full border border-gray-200">
                  <span className="font-medium text-[10px] md:text-xs">{price}</span>
                </div>
              </div>

              {/* Location - Fixed height */}
              <div className="flex items-start gap-1 text-xs text-gray-600">
                <MapPin className="h-3 w-3 mt-0.5 text-gray-400 shrink-0" />
                <span className="line-clamp-2 text-[11px] md:text-xs leading-tight">{location}</span>
              </div>
            </div>

            {/* Reactions - Fixed height section */}
            <div className="flex-shrink-0 w-fit h-8">
              {formattedReactions.length === 0 ? (
                <div className="h-full bg-muted rounded-full px-2 py-1 flex items-center gap-1 text-xs opacity-50">
                  <Smile className="w-4 h-4" />
                  <span className="text-xs">No reactions</span>
                </div>
              ) : (
                formattedReactions.slice(0,3).map((reaction, index) => (
                  <Tooltip key={`${reaction.emoji}-${index}`}>
                    <TooltipTrigger asChild>
                      <div className="h-full bg-muted rounded-full px-2 py-1 flex items-center gap-1 text-xs">
                        <span className="text-base">{reaction.emoji}</span>
                        <span>{reaction.users.length}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p>
                        {reaction.users.length} {reaction.users.length === 1 ? "person reacted" : "people reacted"} with {reaction.emoji}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))
              )}
            </div>

            {/* Voting Section - Fixed height */}
            {showVotes && (
              <div className="flex-shrink-0 pt-1 md:pt-2 border-t border-gray-100 mt-auto">
                <div className="flex items-center justify-between">
                  {/* Yes Votes */}
                  <div className="flex items-center gap-1 md:gap-2">
                    <div
                      className={`flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full transition-colors ${
                        userVotedYes ? "bg-green-100 border border-green-300" : "bg-green-50 border border-green-200"
                      }`}
                    >
                      <ThumbsUp className={`h-3 w-3 ${userVotedYes ? "text-green-600" : "text-green-500"}`} />
                      <span className={`text-xs font-medium ${userVotedYes ? "text-green-700" : "text-green-600"}`}>
                        {votes.yes.length}
                      </span>
                    </div>

                    {votes.yes.length > 0 && (
                      <div className="flex -space-x-0.5 md:-space-x-1">
                        {votes.yes.slice(0, 2).map((userId) => {
                          const user = users.find((u) => u.id === userId)
                          return user ? (
                            <Avatar key={userId} className="h-4 w-4 md:h-5 md:w-5 border border-white shadow-sm">
                              <AvatarFallback
                                className={`text-[8px] md:text-xs ${
                                  userId === currentUser ? "bg-orange-500 text-white" : "bg-green-500 text-white"
                                }`}
                              >
                                {user.avatar}
                              </AvatarFallback>
                            </Avatar>
                          ) : null
                        })}
                        {votes.yes.length > 2 && (
                          <div className="h-4 w-4 md:h-5 md:w-5 rounded-full bg-green-100 border border-white shadow-sm flex items-center justify-center">
                            <span className="text-[8px] md:text-xs font-medium text-green-600">
                              +{votes.yes.length - 2}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* No Votes */}
                  <div className="flex items-center gap-1 md:gap-2">
                    {votes.no.length > 0 && (
                      <div className="flex -space-x-0.5 md:-space-x-1">
                        {votes.no.length > 2 && (
                          <div className="h-4 w-4 md:h-5 md:w-5 rounded-full bg-red-100 border border-white shadow-sm flex items-center justify-center">
                            <span className="text-[8px] md:text-xs font-medium text-red-600">
                              +{votes.no.length - 2}
                            </span>
                          </div>
                        )}
                        {votes.no.slice(-2).map((userId) => {
                          const user = users.find((u) => u.id === userId)
                          return user ? (
                            <Avatar key={userId} className="h-4 w-4 md:h-5 md:w-5 border border-white shadow-sm">
                              <AvatarFallback
                                className={`text-[8px] md:text-xs ${
                                  userId === currentUser ? "bg-orange-500 text-white" : "bg-red-500 text-white"
                                }`}
                              >
                                {user.avatar}
                              </AvatarFallback>
                            </Avatar>
                          ) : null
                        })}
                      </div>
                    )}

                    <div
                      className={`flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full transition-colors ${
                        userVotedNo ? "bg-red-100 border border-red-300" : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <span className={`text-xs font-medium ${userVotedNo ? "text-red-700" : "text-red-600"}`}>
                        {votes.no.length}
                      </span>
                      <ThumbsDown className={`h-3 w-3 ${userVotedNo ? "text-red-600" : "text-red-500"}`} />
                    </div>
                  </div>
                </div>

                {/* Progress bar - only show on desktop */}
                {totalVotes > 0 && (
                  <div className="mt-3 hidden md:block">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-500 h-1 rounded-full transition-all duration-500"
                        style={{ width: `${approvalRate}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
