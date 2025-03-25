"use client"

import Image from "next/image"
import { Star, MapPin, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function TopThreeRestaurants({ restaurants, users, currentUser }) {
  if (!restaurants || !restaurants.length) return null

  const winner = restaurants[0]
  const runnersUp = restaurants.slice(1, 3)

  // Get winner details
  const winnerPlace = winner.place
  const winnerName = winnerPlace.displayName?.text || winnerPlace.name
  const winnerCuisine = winnerPlace.primaryTypeDisplayName?.text || winnerPlace.primaryType || "Restaurant"
  const winnerLocation = winnerPlace.shortFormattedAddress || winnerPlace.formattedAddress
  const winnerRating = winnerPlace.rating || 0
  const winnerPrice = winnerPlace.priceLevel || "$$"

  // Get winner image URL
  const winnerImageUrl =
    winnerPlace.photos && winnerPlace.photos.length > 0
      ? winnerPlace.photos[0].googleMapsUri
      : "/placeholder.svg?height=80&width=80"

  return (
    <div className="bg-gradient-to-br from-orange-50 to-white rounded-xl p-4 border border-orange-100 shadow-sm mb-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
          <div className="absolute top-0 left-0 bg-orange-500 text-white z-10 px-1.5 py-0.5 rounded-br-lg">
            <Trophy className="h-3.5 w-3.5" />
          </div>
          <Image src={winnerImageUrl || "/placeholder.svg"} alt={winnerName} fill className="object-cover" />
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-lg">{winnerName}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
            <Badge variant="outline" className="bg-orange-50 text-orange-600 hover:bg-orange-50">
              {winnerCuisine}
            </Badge>
            <span>•</span>
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {winnerLocation}
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="ml-1 text-sm font-medium">{winnerRating}</span>
            </div>
            <span className="text-muted-foreground">•</span>
            <div className="text-sm text-muted-foreground">{winnerPrice}</div>
          </div>
          <Button
            size="sm"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={() => window.open(winnerPlace.googleMapsUri, "_blank")}
          >
            View on Maps
          </Button>
        </div>
      </div>

      {runnersUp.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-orange-100">
          {runnersUp.map((restaurant, index) => {
            const place = restaurant.place
            const name = place.displayName?.text || place.name
            const rating = place.rating || 0
            const price = place.priceLevel || "$$"
            const imageUrl =
              place.photos && place.photos.length > 0
                ? place.photos[0].googleMapsUri
                : "/placeholder.svg?height=80&width=80"

            return (
              <div key={place.id} className="flex items-center gap-2">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 flex-shrink-0">
                  <span className="font-medium text-xs text-gray-700">{index + 2}</span>
                </div>
                <div className="relative h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                  <Image src={imageUrl || "/placeholder.svg"} alt={name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{name}</h4>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-0.5" />
                    {rating}
                    <span className="mx-1">•</span>
                    {price}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

