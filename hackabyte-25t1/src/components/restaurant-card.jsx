"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, MapPin, Utensils, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react"
import Image from "next/image"

export default function RestaurantCard({ restaurant, rank, users = [], showVotes = false, isHighlighted = false }) {
  // Find user objects for those who voted yes
  const yesVoters = users.filter((user) => restaurant.votes.yes.includes(user.id))
  const noVoters = users.filter((user) => restaurant.votes.no.includes(user.id))

  // Determine badge style based on rank
  const getRankBadge = () => {
    if (rank === 1) {
      return <Badge className="absolute -top-2 -left-2 bg-yellow-500 border-0">🥇 #1</Badge>
    } else if (rank === 2) {
      return <Badge className="absolute -top-2 -left-2 bg-gray-400 border-0">🥈 #2</Badge>
    } else if (rank === 3) {
      return <Badge className="absolute -top-2 -left-2 bg-amber-700 border-0">🥉 #3</Badge>
    } else {
      return (
        <Badge className="absolute -top-2 -left-2" variant="outline">
          #{rank}
        </Badge>
      )
    }
  }

  // Generate stars for rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    return (
      <div className="flex items-center">
        <span className="text-sm font-medium mr-1">{rating.toFixed(1)}</span>
        <div className="flex text-yellow-500">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i < fullStars
                ? "fill-current"
                : i === fullStars && hasHalfStar
                  ? "fill-current opacity-50"
                  : "stroke-current fill-none"
                }`}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card
      className={`relative overflow-hidden transition-all ${isHighlighted ? "shadow-lg border-primary" : "hover:shadow-md"
        }`}
    >
      {getRankBadge()}
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
            <Image src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} fill className="object-cover" />
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-medium">{restaurant.name}</h3>
              <span className="text-sm font-medium">{restaurant.price}</span>
            </div>

            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Utensils className="h-3 w-3" />
              <span>{restaurant.cuisine}</span>
              <span className="mx-1">•</span>
              <MapPin className="h-3 w-3" />
              <span>{restaurant.location}</span>
            </div>

            <div className="mt-2">{renderStars(restaurant.rating)}</div>

            {showVotes && (
              <div className="mt-3 space-y-2">
                {restaurant.reactions && restaurant.reactions.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {restaurant.reactions.map((reaction, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {reaction.emoji} {reaction.count}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex justify-between">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-xs font-medium">{restaurant.votes.yes.length}</span>
                    <div className="flex -space-x-2 ml-1">
                      {yesVoters.map((user) => (
                        <Avatar key={user.id} className="h-5 w-5 border border-background">
                          <AvatarFallback className="text-[10px]">{user.avatar}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <div className="flex -space-x-2 mr-1">
                      {noVoters.map((user) => (
                        <Avatar key={user.id} className="h-5 w-5 border border-background">
                          <AvatarFallback className="text-[10px]">{user.avatar}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-xs font-medium">{restaurant.votes.no.length}</span>
                    <ThumbsDown className="h-3.5 w-3.5 text-red-500" />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-3 flex justify-end">
              <a
                href="#"
                className="text-xs text-primary flex items-center gap-1 hover:underline"
                onClick={(e) => {
                  e.preventDefault()
                  // In a real app, this would navigate to restaurant details
                  alert(`View details for ${restaurant.name}`)
                }}
              >
                View Details <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

