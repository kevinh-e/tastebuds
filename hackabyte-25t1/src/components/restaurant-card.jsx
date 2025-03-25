import Image from "next/image"
import { Star, MapPin, ThumbsUp, ThumbsDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function RestaurantCard({ restaurant, rank, users, showVotes = false }) {
  const yesVoters = users.filter((user) => restaurant.votes.yes.includes(user.id))
  const noVoters = users.filter((user) => restaurant.votes.no.includes(user.id))

  const currentUserVotedYes = restaurant.votes.yes.includes("current")
  const currentUserVotedNo = restaurant.votes.no.includes("current")

  return (
    <div
      className={`rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-all ${rank === 1 ? "border-orange-300" : ""}`}
    >
      <div className="flex p-4">
        {rank && (
          <div
            className={`flex items-center justify-center h-8 w-8 rounded-full mr-3 flex-shrink-0 ${
              rank === 1
                ? "bg-orange-500 text-white"
                : rank === 2
                  ? "bg-gray-200 text-gray-700"
                  : rank === 3
                    ? "bg-amber-700 text-white"
                    : "bg-gray-100 text-gray-500"
            }`}
          >
            <span className="font-bold text-sm">{rank}</span>
          </div>
        )}

        <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
          <Image src={restaurant.image || "/placeholder.svg"} alt={restaurant.name} fill className="object-cover" />
        </div>

        <div className="ml-3 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{restaurant.name}</h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-xs py-0 h-5 bg-orange-50 text-orange-600 hover:bg-orange-50">
                  {restaurant.cuisine}
                </Badge>
                <span>•</span>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-0.5" />
                  {restaurant.location}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="flex items-center">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="ml-0.5 text-xs font-medium">{restaurant.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">•</span>
              <div className="text-xs text-muted-foreground">{restaurant.price}</div>
            </div>
          </div>

          {showVotes && (
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <ThumbsUp
                    className={`h-3.5 w-3.5 mr-1 ${currentUserVotedYes ? "fill-green-500 text-green-500" : "text-gray-400"}`}
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex -space-x-1.5">
                          {yesVoters.slice(0, 3).map((user) => (
                            <Avatar key={user.id} className="h-5 w-5 border border-background">
                              <AvatarFallback
                                className={`text-[10px] ${user.id === "current" ? "bg-orange-500 text-white" : "bg-gray-200"}`}
                              >
                                {user.avatar}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {yesVoters.length > 3 && (
                            <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] border border-background">
                              +{yesVoters.length - 3}
                            </div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Liked by: {yesVoters.map((u) => u.name).join(", ")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center">
                  <ThumbsDown
                    className={`h-3.5 w-3.5 mr-1 ${currentUserVotedNo ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex -space-x-1.5">
                          {noVoters.slice(0, 3).map((user) => (
                            <Avatar key={user.id} className="h-5 w-5 border border-background">
                              <AvatarFallback
                                className={`text-[10px] ${user.id === "current" ? "bg-orange-500 text-white" : "bg-gray-200"}`}
                              >
                                {user.avatar}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {noVoters.length > 3 && (
                            <div className="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center text-[10px] border border-background">
                              +{noVoters.length - 3}
                            </div>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">Passed by: {noVoters.map((u) => u.name).join(", ")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>

              {restaurant.reactions && restaurant.reactions.length > 0 && (
                <div className="flex gap-1">
                  {restaurant.reactions.map((reaction, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-xs bg-gray-100 px-1.5 py-0.5 rounded-full">
                            {reaction.emoji} {reaction.users.length}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            {reaction.users.map((id) => users.find((u) => u.id === id)?.name).join(", ")}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

