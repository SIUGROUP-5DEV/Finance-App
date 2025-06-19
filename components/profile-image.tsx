"use client"

import { User } from "lucide-react"

interface ProfileImageProps {
  src?: string
  alt: string
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
}

export function ProfileImage({ src, alt, size = "md", className = "" }: ProfileImageProps) {
  const sizeClass = sizeClasses[size]

  if (src && src !== "/placeholder.svg?height=40&width=40") {
    return (
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className={`${sizeClass} rounded-full object-cover border-2 border-white/20 ${className}`}
      />
    )
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-white/20 border-2 border-white/20 flex items-center justify-center ${className}`}
    >
      <User
        className={`${size === "sm" ? "h-4 w-4" : size === "md" ? "h-6 w-6" : size === "lg" ? "h-8 w-8" : "h-12 w-12"} text-white`}
      />
    </div>
  )
}
