"use client"

import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Toggle } from "@/components/ui/toggle"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Check } from "lucide-react"
import TagInput from "./tag-input.jsx"
import { useAppContext } from "@/context/AppContext.jsx";

import { socket } from "@/socket.js";
import CopyButton from "@/components/ui/copy-button.jsx";

// Define the form schema with zod
const formSchema = z.object({
  prices: z.array(z.string()).default([]),
  cuisineTags: z.array(z.string()).default([]),
  locationTags: z.array(z.string()).default([]),
  rating: z.string().optional(),
})

export default function TasteSelectForm() {
  const { id, roomData, setRoomData, roomCode } = useAppContext();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    socket.on('syncData', (msg) => {
      // setResponse(JSON.parse(msg));
      setRoomData(JSON.parse(msg));
    });
  }, [roomData]);

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

  const onSubmit = (data) => {
    if (socket.connected && roomCode !== "") {
      // sent the preferences to the server with that room code
      socket.emit("sendPreferences", roomCode, JSON.stringify(data), id);
    }
    router.push('/lobby');
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Price options
  const priceOptions = ["$", "$$", "$$$", "$$$$"]

  // Rating options
  const ratingOptions = ["3.5+", "4.0+", "4.5+", "5.0"]

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="p-6 border rounded-lg w-full max-w-md">
        <div className="flex justify-end">
          <CopyButton
            className="text-lg text-muted-foreground mb-4"
            textToCopy={roomCode}
            displayText={roomCode}
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Price Section */}
            <FormField
              control={form.control}
              name="prices"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold">Price</FormLabel>
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
                  <FormLabel className="text-xl font-semibold">Cuisine</FormLabel>
                  <FormDescription>What type of food are you looking for?</FormDescription>
                  <FormControl>
                    <TagInput
                      onTagsChange={field.onChange}
                      placeholder="Sushi, Paella, Burgers, Italian..."
                      initialTags={field.value}
                    />
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
                  <FormLabel className="text-xl font-semibold">Location</FormLabel>
                  <FormDescription>Where would you like to eat?</FormDescription>
                  <FormControl>
                    <TagInput
                      onTagsChange={field.onChange}
                      placeholder="Chatswood, Haymarket..."
                      initialTags={field.value}
                    />
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
                  <FormLabel className="text-xl font-semibold">Rating</FormLabel>
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

