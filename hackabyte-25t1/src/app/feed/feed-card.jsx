"use client"

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import { ChevronLeft, ChevronRight, MapPin, Phone, Star } from "lucide-react"
import { useEffect, useState } from "react";
import { fetchRestaurantImage } from "./utils/fetchRestaurantImage";

export default function FeedCard({ place }) {
  const name = place.displayName?.text || "Unnamed Place";
  const address = place.shortFormattedAddress || "No address available";
  const phone = place?.nationalPhoneNumber || "No phone number available";
  const rating = place?.rating || 0;
  const totalRatings = place?.userRatingCount || 0;
  const primaryType = place?.primaryTypeDisplayName.text || "Unknown Type";
  const minPrice = place?.priceRange.startPrice.units;
  const maxPrice = place?.priceRange.endPrice.units;
  const openNow = place?.regularOpeningHours.openNow;
  const mapsLink = place?.googleMapsUri;

  const photoNames = place?.photos.map(obj => obj.name).slice(0, 4);
  

  const [imageUrls, setImageUrls] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? imageUrls.length - 1 : prev - 1))
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === imageUrls.length - 1 ? 0 : prev + 1))
  }

  useEffect(() => {
    const fetchImages = async () => {
      if (!photoNames || photoNames.length === 0) return;

      try {
        const imageUrls = await Promise.all(
          photoNames.map(async (photoName) => {
            return await fetchRestaurantImage(photoName);
          })
        );

        console.log(imageUrls); // Logs array of image URLs
        setImageUrls(imageUrls); // Store images in order
      } catch (error) {
        console.error("Failed to fetch images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <Card className="w-full max-w-lg pt-0 overflow-hidden">
      <div className="overflow-hidden relative h-128 w-full bg-muted aspect-[3/2]">
        <img
          src={imageUrls[currentImageIndex] || "/placeholder.svg"}
          alt={`${name} - image ${currentImageIndex + 1}`}
          referrerPolicy="no-referrer"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        {imageUrls.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full h-8 w-8 z-10"
              onClick={prevImage}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous image</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full h-8 w-8 z-10"
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
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50 hover:bg-white/70"
                  }`}
                  role="tab"
                  aria-selected={index === currentImageIndex}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <CardContent className="space-y-4 p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-bold">{name}</h3>
          <Badge
            variant="outline"
            className={
              openNow ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
            }
          >
            {openNow ? "Open" : "Closed"}
          </Badge>
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          <Badge variant="secondary" className="mr-2">
            {primaryType}
          </Badge>
          <div className="flex items-center ml-auto">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400 mr-1" />
            <span className="font-medium">{rating}</span>
            <span className="text-xs ml-1">({totalRatings})</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground" />
            <span className="text-sm">{address}</span>
          </div>
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
            <a href={`tel:${phone.replace(/[^\d]/g, "")}`} className="text-sm hover:underline">
              {phone}
            </a>
          </div>
        </div>

        <div className="pt-2 border-t">
          <span className="text-sm font-medium">Price Range: </span>
          <span className="text-sm text-muted-foreground">
            ${minPrice}-${maxPrice}
          </span>
        </div>

        <Button variant="secondary" className="w-full" asChild>
          <a href={mapsLink} target="_blank" rel="noopener noreferrer" aria-label={`View ${name} on Maps`}>
            View on Maps
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}