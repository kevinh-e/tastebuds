"use client"

import Image from "next/image"
import { Trophy, Star, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function WinnerAnnouncement({ restaurant, users, currentUser, onClose }) {
  // Get users who voted yes
  const yesVoters = users.filter((user) => restaurant.votes.yes.includes(user.id))

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto overflow-hidden">
        <div className="bg-gradient-to-b from-orange-500 to-orange-600 p-6 text-white text-center relative">
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
              onClick={onClose}
            >
              ✕
            </Button>
          </div>

          <div className="flex justify-center mb-2">
            <div className="bg-white/20 p-2 rounded-full">
              <Trophy className="h-8 w-8 text-yellow-300" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-1">We Have a Winner!</h2>
          <p className="text-white/80 text-sm">Everyone's going to love this place</p>
        </div>

        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={restaurant.image || "/placeholder.svg?height=80&width=80"}
                alt={restaurant.name}
                fill
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{restaurant.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <Badge variant="outline" className="bg-orange-50 text-orange-600 hover:bg-orange-50">
                  {restaurant.cuisine}
                </Badge>
                <span>•</span>
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {restaurant.location}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{restaurant.rating}</span>
                </div>
                <span className="text-muted-foreground">•</span>
                <div className="text-sm text-muted-foreground">{restaurant.price}</div>
              </div>
            </div>
          </div>

          <p className="text-muted-foreground mb-4">{restaurant.description}</p>

          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Approved by:</h4>
            <div className="flex -space-x-2 overflow-hidden">
              {yesVoters.map((user) => (
                <Avatar key={user.id} className="border-2 border-background">
                  <AvatarFallback className={user.id === currentUser ? "bg-orange-500 text-white" : "bg-gray-200"}>
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button className="flex-1 bg-orange-500 hover:bg-orange-600">
              <a
                href={restaurant.place.googleMapsUri}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View on Maps`}
                draggable="false"
              >
                Get Directions
              </a>
            </Button>
            <Button variant="outline" className="flex-1">
              Make Reservation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

