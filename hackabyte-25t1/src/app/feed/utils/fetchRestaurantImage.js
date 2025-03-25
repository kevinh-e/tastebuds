async function fetchRestaurantImage(placeName) {
  try {
    // Set reasonable dimensions for restaurant photos
    const maxWidthPx = 600
    const maxHeightPx = 400

    // Construct the URL with the API key and parameters
    const apiKey = "AIzaSyBO07P4ZSbIn2UbRPKHOefbtlKyNiHX3zI"
    const url = `https://places.googleapis.com/v1/${placeName}/media?key=${apiKey}&maxWidthPx=${maxWidthPx}&maxHeightPx=${maxHeightPx}`
    console.log(placeName)
    console.log(url)

    // Make the request
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Error fetching images: ${response.statusText}`)
      return ""
    }

    console.log(response.url)
    return response.url || ""
  } catch (error) {
    console.error(`Error fetching images for ${placeName}:`, error)
    return ""
  }
}

await fetchRestaurantImage('places/ChIJl44XdACxEmsRq10vi-qbegA/photos/AUy1YQ34OvbN1Yf0PSzkeDQIgmQ9gW1bctPaCqlfM5q4OMYzrjzFx41DyVpem7X24ZUS0mcJD2q9o-CI4sBzFNxj4BtL0Z8gKdwLjI-xB3gviYaGpvEJSkzNSINpJp2h43W2-qZq_8C8bgWlrPRBXSnplQIYlPLzRmbWtS0SAehpm5qjpi4tOLYDxLupcp-h6L1txI_1IpkuupH-uCZAJNmZ58ZpbkLqF52-X7ZymEBvwfnb6t1HM1a4BpzGTO9Z-ASv-564ttmy414afLYTJg88Jl0HuuL4R96jDL99p_1IJBFwINjJHydGdGUFnjN6p3CjgQUk5kzMx8P8yIc5DGu1GA-M_Vr9-BthqwpaRfLyQPH0syWjQjn35gkvZ66C2WqTs0Y1IawBII0Bb--KqU1OHVDbr5-khSWFI-P-feBUPiPSWcVq')