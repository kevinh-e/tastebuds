# Tastebuds - Real-Time Restaurant Discovery

Tastebuds is a web application that helps groups of friends collaboratively find and decide on a place to eat in real-time. It uses a Tinder-like swiping interface to gather preferences and leverages the Google Places API to provide tailored restaurant recommendations.

## Features

*   **Real-time collaboration:** See your friends' restaurant picks and preferences as they happen.
*   **Tinder-style swiping:** A fun and intuitive way to vote on restaurant choices.
*   **Google Places integration:** Access a vast database of restaurants with up-to-date information.
*   **Location-based search:** Find restaurants near you or a specified location.
*   **Preference-based filtering:** Narrow down your options by cuisine, price range, and more.
*   **Winning restaurant announcement:** Once everyone has voted, the app declares a winner.

## Tech Stack

*   **Frontend:** Next.js, React, Tailwind CSS
*   **Backend:** Node.js, Socket.IO
*   **API:** Google Places API

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed on your machine.

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/tastebuds.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd tastebuds
    ```
3.  Install the dependencies:
    ```sh
    npm install
    ```
4.  Create a `.env.local` file in the `tastebuds` directory and add your Google Places API key:
    ```
    GOOGLE_PLACES_API_KEY=your_api_key
    ```

### Running the Application

1.  Start the development server:
    ```sh
    npm run dev
    ```
2.  Open your browser and navigate to `http://localhost:3000`.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.