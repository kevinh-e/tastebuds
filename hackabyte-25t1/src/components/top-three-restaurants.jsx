import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, MapPin, Utensils, ThumbsUp, ThumbsDown } from "lucide-react"
import Image from "next/image"

export default function TopThreeRestaurants({ restaurants, users }) {
  if (!restaurants || restaurants.length === 0) {
    return null
  }

  // Medal emojis for top 3
  const medals = ["🥇", "🥈", "🥉"]

  // Background gradients for top 3
  const backgrounds = [
    "bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800/50",
    "bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-gray-200 dark:border-gray-800/50",
    "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 border-amber-200 dark:border-amber-800/50",
  ]

  return (
    <div className="grid grid-cols-1 gap-4">
      {restaurants.map((restaurant, index) => {
        // Find user objects for those who voted yes
        const yesVoters = users.filter((user) => restaurant.votes.yes.includes(user.id))
        const noVoters = users.filter((user) => restaurant.votes.no.includes(user.id))

        return (
          <Card key={restaurant.id} className={`overflow-hidden border-2 ${backgrounds[index]} shadow-md`}>
            <div className="relative">
              <div className="absolute top-2 left-2 z-10">
                <Badge
                  className={`text-lg px-3 py-1 ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-amber-700"
                    } border-0`}
                >
                  {medals[index]} #{index + 1}
                </Badge>
              </div>

              <div className="h-32 relative">
                <Image
                  src={restaurant.image || "/placeholder.svg?height=128&width=400"}
                  alt={restaurant.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 text-white">
                  <h3 className="font-bold text-xl">{restaurant.name}</h3>
                  <div className="flex items-center gap-1 text-xs">
                    <Utensils className="h-3 w-3" />
                    <span>{restaurant.cuisine}</span>
                    <span className="mx-1">•</span>
                    <MapPin className="h-3 w-3" />
                    <span>{restaurant.location}</span>
                    <span className="mx-1">•</span>
                    <span>{restaurant.price}</span>
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(restaurant.rating)
                        ? "text-yellow-500 fill-current"
                        : i < Math.ceil(restaurant.rating)
                          ? "text-yellow-500 fill-current opacity-50"
                          : "text-gray-300 dark:text-gray-600"
                        }`}
                    />
                  ))}
                  <span className="ml-1 text-sm font-medium">{restaurant.rating.toFixed(1)}</span>
                </div>

                <div className="flex gap-1">
                  {restaurant.reactions &&
                    restaurant.reactions.map((reaction, i) => (
                      <span key={i} className="text-lg">
                        {reaction.emoji}
                      </span>
                    ))}
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-3">{restaurant.description}</p>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">{restaurant.votes.yes.length}</span>
                  <div className="flex -space-x-2 ml-1">
                    {yesVoters.map((user) => (
                      <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
                        <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <div className="flex -space-x-2 mr-1">
                    {noVoters.map((user) => (
                      <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
                        <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <span className="text-sm font-medium">{restaurant.votes.no.length}</span>
                  <ThumbsDown className="h-4 w-4 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

