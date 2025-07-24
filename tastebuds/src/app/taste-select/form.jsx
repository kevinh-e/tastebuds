"use client"

import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Toggle } from "@/components/ui/toggle"
import TagInput from "./tag-input.jsx"
import { cuisineOptions, locationOptions } from "./data.js"
import { useAppContext } from "@/context/AppContext.jsx"
import { ChefHat, Coins, Dices, Locate, MapPin, Star } from "lucide-react"

import { socket } from "@/socket.js"

// Define the form schema with zod
const formSchema = z.object({
  prices: z.array(z.string()).default([]),
  cuisineTags: z.array(z.string()).default([]),
  locationTags: z.array(z.string()).default([]),
  rating: z.string().optional(),
})

export default function TasteSelectForm() {
  const [userLocation, setUserLocation] = useState(null)
  const { id, roomData, setRoomData, roomCode } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    socket.on("syncData", (msg) => {
      setRoomData(JSON.parse(msg))
    })
  }, [setRoomData, roomData])

  // Initialize the form with default values
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

  // update the form with user's existing prefs
  useEffect(() => {
    const member = roomData?.roomMembers?.[id]
    if (member?.preferences) {
      const prefs = member.preferences
      reset({
        prices: prefs.prices ?? [],
        cuisineTags: prefs.cuisineTags ?? [],
        locationTags: prefs.locationTags ?? [],
        rating: prefs.rating ?? "",
      })
    }
  }, [roomData, id, reset])

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ latitude, longitude })

          try {
            // Use reverse geocoding to get location name
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            )
            const data = await response.json()
            console.log("Position:")
            console.log(position);
            console.log("Reverse Geocode:")
            console.log(data);

            // Extract suburb or city name
            const locationName = [
              data.address.suburb || data.address.town || data.address.village,
              data.address.city
            ].filter(Boolean).join(', ');

            // Add the location to the form's locationTags
            const currentTags = form.getValues("locationTags")
            if (!currentTags.includes(locationName)) {
              const updatedTags = [...currentTags, locationName]
              form.setValue("locationTags", updatedTags)
            }
          } catch (error) {
            console.error("Error getting location name:", error)
            // Fallback: add coordinates as a tag
            const locationTag = `${latitude.toFixed(2)},${longitude.toFixed(2)}`
            const currentTags = form.getValues("locationTags")
            if (!currentTags.includes(locationTag)) {
              const updatedTags = [...currentTags, locationTag]
              form.setValue("locationTags", updatedTags)
            }
          }
        },
        (error) => {
          console.error("Error getting user location:", error)
        },
      )
    } else {
      console.error("Geolocation is not supported by this browser.")
    }
  }

  const onSubmit = (data) => {
    if (socket.connected && roomCode !== "") {
      // sent the preferences to the server with that room code
      socket.emit("sendPreferences", roomCode, JSON.stringify(data), id)
    }
    router.push("/lobby")
  }

  // Price options
  const priceOptions = ["$", "$$", "$$$", "$$$$"]

  // Rating options
  const ratingOptions = ["3.5+", "4.0+", "4.5+", "5.0"]

  const addRandomCuisine = () => {
    // Get current cuisine tags
    const currentTags = form.getValues("cuisineTags")

    // Get a random cuisine that's not already in the list
    const availableCuisines = cuisineOptions.filter((cuisine) => !currentTags.includes(cuisine))

    // If all cuisines are already selected, don't add any more
    if (availableCuisines.length === 0) return

    // Select a random cuisine from available options
    const randomIndex = Math.floor(Math.random() * availableCuisines.length)
    const randomCuisine = availableCuisines[randomIndex]

    // Add the random cuisine to the form
    const updatedTags = [...currentTags, randomCuisine]
    form.setValue("cuisineTags", updatedTags)
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
                    <Coins className="h-5 text-orange-500 w-5" />
                    Price
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
                            const updatedPrices = pressed
                              ? [...field.value, price]
                              : field.value.filter((p) => p !== price)
                            field.onChange(updatedPrices)
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

            {/* Cuisine Section with TagInput */}
            <FormField
              control={form.control}
              name="cuisineTags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    <ChefHat className="h-5 text-orange-500 w-5" />
                    Cuisine
                  </FormLabel>
                  <FormDescription>What type of food are you looking for?</FormDescription>
                  <FormControl>
                    <div className="flex space-x-1 items-center">
                      <TagInput
                        onTagsChange={field.onChange}
                        placeholder="Sushi, Paella, Burgers, Italian..."
                        initialTags={field.value}
                        className="grow-1"
                        suggestions={cuisineOptions}
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location Section with TagInput */}
            <FormField
              control={form.control}
              name="locationTags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    <MapPin className="h-5 text-orange-500 w-5" />
                    Location
                  </FormLabel>
                  <FormDescription>Where would you like to eat?</FormDescription>
                  <FormControl>
                    <div className="flex space-x-1 items-center">
                      <TagInput
                        onTagsChange={field.onChange}
                        placeholder="Chatswood, Haymarket..."
                        initialTags={field.value}
                        className="grow-1"
                        suggestions={locationOptions}
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
                  </FormControl>
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
                    <Star className="h-5 text-orange-500 w-5" />
                    Rating
                  </FormLabel>
                  <FormDescription>Minimum rating you're looking for</FormDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {ratingOptions.map((rating) => (
                      <FormControl key={rating}>
                        <Toggle
                          variant="outline"
                          className={`h-10 px-3 rounded-full hover:cursor-pointer ${field.value === rating ? "bg-primary text-primary-foreground" : ""}`}
                          pressed={field.value === rating}
                          onPressedChange={(pressed) => {
                            // If already selected and pressed again, deselect it
                            if (field.value === rating && !pressed) {
                              field.onChange("")
                            }
                            // If pressed and not already selected, select it
                            else if (pressed) {
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


