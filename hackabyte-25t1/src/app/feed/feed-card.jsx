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

  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // const imageUrls = ['/dummy-images/one.jpg', '/dummy-images/two.jpg', '/dummy-images/three.jpg', '/dummy-images/four.jpg'];
  // TODO: Fetch images from API
  const imageUrls = place?.photos.map(obj => obj.name).slice(0, 4);

  useEffect(() => {
    const placeName = imageUrls[0];
    
    const fetchData = async () => {
      const image = await fetchRestaurantImage(placeName);
      console.log(image);
    };

    fetchData();
  }, []);


  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1))
  }

  return (
    <Card className="w-full max-w-lg overflow-hidden pt-0">
      {/* Image section */}
      {/* <div className="relative h-84 w-full bg-muted">
        <Image
          src={imageUrls[currentImageIndex] || "/placeholder.svg"}
          alt={`Paddy Chans restaurant image ${currentImageIndex + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          priority={currentImageIndex === 0}
          className="object-cover"
        />
        {imageUrls.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full h-8 w-8 z-10"
              onClick={prevImage}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full h-8 w-8 z-10"
              onClick={nextImage}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {imageUrls.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 w-1.5 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`}
                />
              ))}
            </div>
          </>
        )}
      </div> */}

      <CardContent className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="text-xl font-bold">{name}</div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
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
            <span className="text-sm">{phone}</span>
          </div>
        </div>

        <div className="pt-2 border-t">
          <span className="text-sm font-medium">Price Range: </span>
          <span className="text-sm text-muted-foreground">${minPrice}-${maxPrice}</span>
        </div>
        <Button variant="secondary" asChild>
          <a href={mapsLink} target="_blank" rel="noopener noreferrer">View on Maps</a>
        </Button>
      </CardContent>
    </Card>
  )
}