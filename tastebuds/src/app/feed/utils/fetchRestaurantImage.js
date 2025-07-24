export async function fetchRestaurantImage(placeName) {
  try {
    // Set reasonable dimensions for restaurant photos
    const maxWidthPx = 600;
    const maxHeightPx = 400;

    // Construct the URL with the API key and parameters
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const url = `https://places.googleapis.com/v1/${placeName}/media?key=${apiKey}&maxWidthPx=${maxWidthPx}&maxHeightPx=${maxHeightPx}`;


    // Make the request
    const response = await fetch(url);

    return response.url;
  } catch (error) {
    console.error(`Error fetching images for ${placeName}:`, error);
    return "";
  }
}