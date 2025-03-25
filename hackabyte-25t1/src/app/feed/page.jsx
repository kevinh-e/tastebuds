"use client"

import { useState } from "react"
import { FeedCard } from "./feed-card"
import { EXAMPLE_PLACE } from "./example-place"

export default function FeedPage() {
    const [currentVote, setCurrentVote] = useState(null)

    const handleVoteChange = (vote) => {
        setCurrentVote(vote)
    }

    return (
        <div className="bg-gray-100 min-h-screen p-8 flex flex-col items-center justify-center">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Swipe to Vote</h1>
                <p className="text-gray-600">Swipe right for Yes, left for No. You can change your vote anytime.</p>
            </div>

            <FeedCard place={EXAMPLE_PLACE} onVoteChange={handleVoteChange} />

            {currentVote && (
                <div
                    className={`mt-8 p-4 rounded-lg shadow-md ${currentVote === "yes" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                >
                    <p className="text-xl font-medium">
                        You voted: <span className="font-bold">{currentVote.toUpperCase()}</span>
                    </p>
                    <p className="text-sm mt-1">Swipe {currentVote === "yes" ? "left" : "right"} to change your vote</p>
                </div>
            )}
        </div>
    )
}

