"use client"

import { useState, useEffect } from "react"

interface TypewriterProps {
  text: string
  speed?: number
  onFinished?: () => void
}

export function Typewriter({ text, speed = 50, onFinished }: TypewriterProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    if (isFinished) return

    if (displayedText.length < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText(text.substring(0, displayedText.length + 1))
      }, speed)
      return () => clearTimeout(timeoutId)
    } else {
      setIsFinished(true)
      if (onFinished) {
        setTimeout(onFinished, 500) // Delay before calling onFinished
      }
    }
  }, [displayedText, text, speed, onFinished, isFinished])

  return (
    <span>
      {displayedText}
      {!isFinished && <span className="animate-blink">_</span>}
    </span>
  )
}
