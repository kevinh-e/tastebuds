"use client"

import { useForm } from "react-hook-form"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Toggle } from "@/components/ui/toggle"
import TagInput from "./tag-input.jsx"
import { cuisineOptions, locationOptions } from "./data.js"
import { useAppContext } from "@/context/AppContext.jsx"
import { ChefHat, Coins, Dices, Locate, MapPin, Star } from "lucide-react"
import { socket } from "@/socket.js"

// Define the form schema with zod
const formSchema = z
  .object({
    prices: z.array(z.string()).default([]),
    cuisineTags: z.array(z.string()).default([]),
    locationTags: z.array(z.string()).default([]),
    rating: z.string().optional(),
  })

export default function TasteSelectForm() {
  const { id, roomData, setRoomData, roomCode } = useAppContext()
  const router = useRouter()
  const [userLocation, setUserLocation] = useState(null)

  // ref to hold last‐seen JSON of this user's prefs
  const prevPrefsRef = useRef(null)

  // syncData only needs to setRoomData, with cleanup
  useEffect(() => {
    const handler = (msg) => {
      setRoomData(JSON.parse(msg))
    }
    socket.on("syncData", handler)
    return () => {
      socket.off("syncData", handler)
    }
  }, [setRoomData])

  // initialize the form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prices: [],
      cuisineTags: [],
      locationTags: [],
      rating: "",
    },
  })

  const { reset } = form

  // only reset *your* form when *your* saved preferences truly change
  useEffect(() => {
    const member = roomData?.roomMembers?.[id]
    if (!member?.preferences) return

    const prefs = {
      prices: member.preferences.prices ?? [],
      cuisineTags: member.preferences.cuisineTags ?? [],
      locationTags: member.preferences.locationTags ?? [],
      rating: member.preferences.rating ?? "",
    }
    const prefsJSON = JSON.stringify(prefs)

    if (prefsJSON !== prevPrefsRef.current) {
      reset(prefs)
      prevPrefsRef.current = prefsJSON
    }
  }, [roomData, id, reset])

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.")
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ latitude, longitude })
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          )
          const data = await response.json()
          const locationName = [
            data.address.suburb || data.address.town || data.address.village,
            data.address.city,
          ]
            .filter(Boolean)
            .join(", ")
          const currentTags = form.getValues("locationTags")
          if (!currentTags.includes(locationName)) {
            form.setValue("locationTags", [...currentTags, locationName])
          }
        } catch (error) {
          console.error("Error getting location name:", error)
          const locationTag = `${latitude.toFixed(2)},${longitude.toFixed(2)}`
          const currentTags = form.getValues("locationTags")
          if (!currentTags.includes(locationTag)) {
            form.setValue("locationTags", [...currentTags, locationTag])
          }
        }
      },
      (error) => {
        console.error("Error getting user location:", error)
      }
    )
  }

  const onSubmit = (data) => {
    if (socket.connected && roomCode) {
      socket.emit("sendPreferences", roomCode, JSON.stringify(data), id)
    }
    router.push("/lobby")
  }

  const priceOptions = ["$", "$$", "$$$", "$$$$"]
  const ratingOptions = ["3.5+", "4.0+", "4.5+", "5.0"]

  const addRandomCuisine = () => {
    const current = form.getValues("cuisineTags")
    const available = cuisineOptions.filter((c) => !current.includes(c))
    if (!available.length) return
    const pick = available[Math.floor(Math.random() * available.length)]
    form.setValue("cuisineTags", [...current, pick])
  }

  return (
    <div className="h-full space-y-4 col-span-4">
      <div className="h-full p-6 bg-white border rounded-lg w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Price Section */}
            <FormField
              control={form.control}
              name="prices"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    <Coins className="h-5 text-orange-500 w-5" /> Price
                  </FormLabel>
                  <FormDescription>How much do you want to spend?</FormDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {priceOptions.map((price) => (
                      <FormControl key={price}>
                        <Toggle
                          variant="outline"
                          className="h-10 px-4 rounded-full hover:cursor-pointer"
                          pressed={field.value?.includes(price)}
                          onPressedChange={(pressed) => {
                            const updated = pressed
                              ? [...field.value, price]
                              : field.value.filter((p) => p !== price)
                            field.onChange(updated)
                          }}
                        >
                          {price}
                        </Toggle>
                      </FormControl>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cuisine Section */}
            <FormField
              control={form.control}
              name="cuisineTags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    <ChefHat className="h-5 text-orange-500 w-5" /> Cuisine
                  </FormLabel>
                  <FormDescription>What type of food are you looking for?</FormDescription>
                  <div className="flex space-x-1 items-center">
                    <TagInput
                      onTagsChange={field.onChange}
                      initialTags={field.value}
                      suggestions={cuisineOptions}
                      placeholder="Sushi, Paella..."
                      className="grow-1"
                    />
                    <Button
                      variant="ronaldo"
                      onClick={(e) => {
                        e.preventDefault()
                        addRandomCuisine()
                      }}
                      className="h-full"
                    >
                      <Dices className="text-orange-500" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Section */}
            <FormField
              control={form.control}
              name="locationTags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    <MapPin className="h-5 text-orange-500 w-5" /> Location
                  </FormLabel>
                  <FormDescription>Where would you like to eat?</FormDescription>
                  <div className="flex space-x-1 items-center">
                    <TagInput
                      onTagsChange={field.onChange}
                      initialTags={field.value}
                      suggestions={locationOptions}
                      placeholder="Chatswood, Haymarket..."
                      className="grow-1"
                    />
                    <Button
                      variant="ronaldo"
                      onClick={(e) => {
                        e.preventDefault()
                        getUserLocation()
                      }}
                      className="h-full"
                    >
                      <Locate className="text-orange-500" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rating Section */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    <Star className="h-5 text-orange-500 w-5" /> Rating
                  </FormLabel>
                  <FormDescription>Minimum rating you're looking for</FormDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ratingOptions.map((rating) => (
                      <FormControl key={rating}>
                        <Toggle
                          variant="outline"
                          className={`h-10 px-3 rounded-full hover:cursor-pointer ${
                            field.value === rating
                              ? "bg-primary text-primary-foreground"
                              : ""
                          }`}
                          pressed={field.value === rating}
                          onPressedChange={(pressed) => {
                            if (field.value === rating && !pressed) {
                              field.onChange("")
                            } else if (pressed) {
                              field.onChange(rating)
                            }
                          }}
                        >
                          {rating}
                        </Toggle>
                      </FormControl>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full hover:cursor-pointer">
              Find Restaurants
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
