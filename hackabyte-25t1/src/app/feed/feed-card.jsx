"use client"

import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion"
import { MapPin, Star, X, Check, ChevronLeft, ChevronRight, Phone, ChevronsRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchRestaurantImage } from "./utils/fetchRestaurantImage"
import { Skeleton } from "@/components/ui/skeleton"
import { useAppContext } from "@/context/AppContext"
import { ReactionSummary } from "./utils/reaction-summary"

import { socket } from "@/socket"

export function FeedCard({ reactions, place, onVoteChange, onSkip, isHost, progress = null, location }) {
  const toRadians = (degrees) => degrees * Math.PI / 180;

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  const [vote, setVote] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  // Track the card's position
  const x = useMotionValue(0)
  const controls = useAnimation()

  // Calculate rotation based on x position
  // The card will pivot around its bottom middle point
  const rotate = useTransform(x, [-150, 0, 150], [-15, 0, 15])

  // Calculate opacity for the indicators
  const yesOpacity = useTransform(x, [0, 100], [0, 1])
  const noOpacity = useTransform(x, [-100, 0], [1, 0])

  // Calculate scale for the indicators
  const yesScale = useTransform(x, [0, 100], [0.8, 1])
  const noScale = useTransform(x, [-100, 0], [1, 0.8])

  // Threshold for triggering a vote
  const THRESHOLD = 100

  // Update the parent component when vote changes
  useEffect(() => {
    if (onVoteChange) {
      onVoteChange(vote)
    }
  }, [vote])

  // Reset x position after vote
  useEffect(() => {
    controls.start({ x: 0, rotate: 0 })
  }, [vote, controls])

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (event, info) => {
    setIsDragging(false)

    if (info.offset.x > THRESHOLD) {
      // Swiped right - "Yes"
      setVote("yes")
    } else if (info.offset.x < -THRESHOLD) {
      // Swiped left - "No"
      setVote("no")
    }

    // Always return to upright position
    controls.start({
      x: 0,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30,
      },
    })
  }

  // Map x position to a smooth color gradient
  const backgroundColour = useTransform(
    x,
    [-150, 0, 150],
    ["rgba(239, 68, 68, 0.2)", "#ffffff", "rgba(34, 197, 94, 0.2)"], // Red → White → Green
  )

  // Border color should match background color
  const borderColour = useTransform(
    x,
    [-150, 0, 150],
    ["rgba(239, 68, 68, 0.8)", "rgba(255, 255, 255, 0)", "rgba(34, 197, 94, 0.8)"], // Red → Transparent → Green
  )

  const name = place?.displayName?.text || "Unnamed Place"
  const address = place?.shortFormattedAddress || "No address available"
  const phone = place?.nationalPhoneNumber || "No phone number available"
  const rating = place?.rating || 0
  const totalRatings = place?.userRatingCount || 0
  const primaryType = place?.primaryTypeDisplayName?.text || "Unknown Type"
  const minPrice = place?.priceRange?.startPrice?.units || 10
  const maxPrice = place?.priceRange?.endPrice?.units || 40
  const openNow = place?.regularOpeningHours?.openNow || false
  const mapsLink = place?.googleMapsUri || ""
  const photoNames = place?.photos.map((obj) => obj.name).slice(0, 4)

  const placeCoordinates = place?.location;
  const distance = location && placeCoordinates
    ? getDistanceFromLatLonInKm(
      location.latitude,
      location.longitude,
      placeCoordinates.latitude,
      placeCoordinates.longitude
    )
    : null;

  const [imageUrls, setImageUrls] = useState([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const { restIndex, roomCode } = useAppContext()

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1))
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1))
  }

  useEffect(() => {
    const fetchImages = async () => {
      if (!photoNames || photoNames.length === 0) return

      try {
        const imageUrls = await Promise.all(
          photoNames.map(async (photoName) => {
            return await fetchRestaurantImage(photoName)
          }),
        )

        socket.emit("setThumbnail", roomCode, restIndex, imageUrls[0]);

        setImageUrls(imageUrls) // Store images in order
      } catch (error) {
        console.error("Failed to fetch images:", error)
      }
    }

    fetchImages()
    setVote(null)
  }, [restIndex])

  // Calculate progress indicator dimensions
  const cardWidth = 100 // 100%
  const cardHeight = 100 // 100%

  // Calculate the perimeter of the card
  const perimeter = 2 * (cardWidth + cardHeight)

  // Calculate the length of the progress line based on the progress value
  const progressLength = progress !== null ? perimeter * progress : 0

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* "Yes" indicator */}
      <motion.div
        className="absolute top-1/2 right-8 transform -translate-y-1/2 bg-green-500 text-white rounded-full p-4 z-10"
        style={{ opacity: yesOpacity, scale: yesScale }}
      >
        <Check className="h-8 w-8" />
      </motion.div>

      {/* "No" indicator */}
      <motion.div
        className="absolute top-1/2 left-8 transform -translate-y-1/2 bg-red-500 text-white rounded-full p-4 z-10"
        style={{ opacity: noOpacity, scale: noScale }}
      >
        <X className="h-8 w-8" />
      </motion.div>

      {/* Current vote indicator */}
      {!isDragging && (
        <div
          className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-full z-20 font-bold text-white
          ${!vote ? "bg-black/50" : vote === "yes" ? "bg-green-500/75" : "bg-red-500/75"}`}
        >
          {!vote ? "Swipe to vote" : vote === "yes" ? "YES" : "NO"}
        </div>
      )}

      {/* Card */}
      <motion.div
        className="rounded-xl shadow-md overflow-hidden w-full transition-none border-2 relative"
        style={{
          x,
          rotate,
          transformOrigin: "bottom center",
          background: backgroundColour,
          borderColor: borderColour,
        }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Progress indicator */}
        {progress !== null && (
          <div
            className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none overflow-hidden rounded-xl"
            style={{ padding: "2px" }}
          >
            <div
              className="absolute bg-primary h-2 shadow-md"
              style={{
                width: `${progress * 100}%`,
                top: 0,
                left: 0,
                borderTopLeftRadius: "0.5rem",
                borderTopRightRadius: progress === 1 ? "0.5rem" : 0,
              }}
            />
          </div>
        )}

        <div className="relative">
          {/* Image container */}
          <div className="overflow-hidden relative h-128 w-full bg-muted aspect-[3/2]">
            {imageUrls[currentImageIndex] ? (
              <>
                <img
                  src={imageUrls[currentImageIndex] || "/placeholder.svg"}
                  alt={`${name} - image ${currentImageIndex + 1}`}
                  referrerPolicy="no-referrer"
                  draggable="false"
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
                {imageUrls.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full h-8 w-8 z-10 cursor-pointer"
                      onClick={prevImage}
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                      <span className="sr-only">Previous image</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full h-8 w-8 z-10 cursor-pointer"
                      onClick={nextImage}
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                      <span className="sr-only">Next image</span>
                    </Button>

                    <div
                      className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10"
                      role="tablist"
                      aria-label="Image navigation"
                    >
                      {imageUrls.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-1.5 w-1.5 rounded-full transition-colors ${index === currentImageIndex ? "bg-white" : "bg-white/50 hover:bg-white/70"
                            }`}
                          role="tab"
                          aria-selected={index === currentImageIndex}
                          aria-label={`View image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <Skeleton className="absolute top-0 left-0 w-full h-full" />
            )}
          </div>

          {/* Colored overlay based on swipe direction - only during active drag */}
          <motion.div
            className="absolute inset-0 bg-green-500 bg-opacity-30 rounded-t-xl pointer-events-none"
            style={{ opacity: yesOpacity }}
          />
          <motion.div
            className="absolute inset-0 bg-red-500 bg-opacity-30 rounded-t-xl pointer-events-none"
            style={{ opacity: noOpacity }}
          />
        </div>
        <div className="p-6 space-y-3">
          {/* Title / Open status */}
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">{name}</h3>
            <Badge
              variant="outline"
              className={openNow ? "bg-white text-green-700 border-green-200" : "bg-white text-red-700 border-red-200"}
            >
              {openNow ? "Open" : "Closed"}
            </Badge>
          </div>

          {/* Type / Rating */}
          <div className="flex items-center text-sm text-muted-foreground">
            <Badge variant="secondary">{primaryType}</Badge>
            <div className="flex items-center ml-auto">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
              <span className="font-medium">{rating}</span>
              <span className="text-xs ml-1">({totalRatings})</span>
            </div>
          </div>

          {/* Address / Phone */}
          <div className="space-y-2">
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
                draggable="false"
              >
                {address}
              </a>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
              <a href={`tel:${phone.replace(/[^\d]/g, "")}`} className="text-sm hover:underline" draggable="false">
                {phone}
              </a>
            </div>
          </div>

          <div className="pt-2 border-t flex justify-between">
            <div>
              <span className="text-sm font-medium">Price Range: </span>
              <span className="text-sm text-muted-foreground">
                ${minPrice}-${maxPrice}
              </span>
            </div>

            <div>
              {distance != null && (
                <>
                  {/* <span className="mx-2">•</span> */}
                  <span className="text-sm font-medium">Distance: </span>
                  <span className="text-sm text-muted-foreground">
                    {distance.toFixed(2)} km
                  </span>
                </>
              )}
            </div>
          </div>


          <ReactionSummary reactions={reactions} />
          <div className="w-full flex flex-row gap-2">
            <Button className="grow-3" asChild>
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${name} on Maps`}
                draggable="false"
              >
                View on Maps
              </a>
            </Button>
            {isHost ? (
              <Button variant="secondary" className="grow-1" onClick={onSkip}>
                Skip
                <ChevronsRight />
              </Button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

