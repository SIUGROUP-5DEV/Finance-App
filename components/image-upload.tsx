"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ProfileImage } from "@/components/profile-image"
import { Camera, Upload } from "lucide-react"

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (imageUrl: string) => void
  userName: string
}

export default function ImageUpload({ currentImage, onImageChange, userName }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file")
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB")
      return
    }

    setIsUploading(true)

    // Create a FileReader to convert the file to base64
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      onImageChange(result)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <ProfileImage src={currentImage} alt={userName} size="xl" />
        <Button
          size="icon"
          className="absolute -bottom-2 -right-2 rounded-full h-8 w-8"
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-center">
        <Button variant="outline" onClick={handleUploadClick} disabled={isUploading} className="gap-2">
          <Upload className="h-4 w-4" />
          {isUploading ? "Uploading..." : "Change Photo"}
        </Button>
        <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 5MB.</p>
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
    </div>
  )
}
