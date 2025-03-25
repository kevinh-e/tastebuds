"use client";

import { useEffect, useState } from "react";
import { fetchRestaurantImage } from "../feed/utils/fetchRestaurantImage";

export default function Page() {
  const [imageUrl, setImageUrl] = useState();
  const photoName = "places/ChIJl44XdACxEmsRq10vi-qbegA/photos/AUy1YQ34OvbN1Yf0PSzkeDQIgmQ9gW1bctPaCqlfM5q4OMYzrjzFx41DyVpem7X24ZUS0mcJD2q9o-CI4sBzFNxj4BtL0Z8gKdwLjI-xB3gviYaGpvEJSkzNSINpJp2h43W2-qZq_8C8bgWlrPRBXSnplQIYlPLzRmbWtS0SAehpm5qjpi4tOLYDxLupcp-h6L1txI_1IpkuupH-uCZAJNmZ58ZpbkLqF52-X7ZymEBvwfnb6t1HM1a4BpzGTO9Z-ASv-564ttmy414afLYTJg88Jl0HuuL4R96jDL99p_1IJBFwINjJHydGdGUFnjN6p3CjgQUk5kzMx8P8yIc5DGu1GA-M_Vr9-BthqwpaRfLyQPH0syWjQjn35gkvZ66C2WqTs0Y1IawBII0Bb--KqU1OHVDbr5-khSWFI-P-feBUPiPSWcVq"

  useEffect(() => {
    const fetchImage = async () => {
      const res = await fetchRestaurantImage(photoName)
      console.log(res);
      setImageUrl(res)
    }

    fetchImage();
  }, []);

  return (
    <div>
      <h1>Page</h1>

      {imageUrl && 
      <>
        <p>Image URL: {imageUrl}</p>
        <img
          src={imageUrl}
          alt="img"
          referrerpolicy="no-referrer"
        />
      </>
      }
    </div>
  );
}