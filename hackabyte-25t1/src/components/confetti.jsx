"use client"

import { useEffect, useState } from "react"
import ReactConfetti from "react-confetti"

export default function Confetti({ duration = 3000 }) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)

    const timeout = setTimeout(() => {
      setIsActive(false)
    }, duration)

    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timeout)
    }
  }, [duration])

  if (!isActive) return null

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={false}
      numberOfPieces={200}
      colors={["#f97316", "#fb923c", "#fdba74", "#ffedd5", "#fff7ed"]}
    />
  )
}


