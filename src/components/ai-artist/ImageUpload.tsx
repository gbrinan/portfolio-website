/**
 * ImageUpload Component
 * Provides drag-and-drop and file picker functionality for image uploads
 * Requirement: RQ-003
 */

'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadedImage } from '@/types'
import { cn, isValidImageType, isFileSizeValid, generateId, formatFileSize } from '@/lib/utils'

interface ImageUploadProps {
  onUpload: (images: UploadedImage[]) => void
  existingImages?: UploadedImage[]
  maxFileSize?: number
  maxImages?: number
  className?: string
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_IMAGES = 50
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function ImageUpload({
  onUpload,
  existingImages = [],
  maxFileSize = MAX_FILE_SIZE,
  maxImages = MAX_IMAGES,
  className,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<UploadedImage[]>(existingImages)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const processFiles = useCallback(async (files: FileList) => {
    setError(null)
    setUploadProgress(0)

    // Check if adding files would exceed max images
    if (images.length + files.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`)
      return
    }

    const validFiles: File[] = []
    const errors: string[] = []

    // Validate files
    Array.from(files).forEach((file) => {
      if (!isValidImageType(file)) {
        errors.push(`${file.name}: Invalid file type`)
      } else if (!isFileSizeValid(file, maxFileSize / (1024 * 1024))) {
        errors.push(`${file.name}: File size exceeds ${formatFileSize(maxFileSize)}`)
      } else {
        validFiles.push(file)
      }
    })

    if (errors.length > 0) {
      setError(errors.join(', '))
    }

    if (validFiles.length === 0) return

    // Process files
    const uploadedImages: UploadedImage[] = []
    const totalFiles = validFiles.length

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i]
      const url = URL.createObjectURL(file)

      const image: UploadedImage = {
        id: generateId(),
        url,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
      }

      uploadedImages.push(image)
      setUploadProgress(((i + 1) / totalFiles) * 100)
    }

    const updatedImages = [...images, ...uploadedImages]
    setImages(updatedImages)
    onUpload(updatedImages)

    // Reset progress after a delay
    setTimeout(() => setUploadProgress(0), 1000)
  }, [images, maxFileSize, maxImages, onUpload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }, [processFiles])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }, [processFiles])

  const handleRemoveImage = useCallback((id: string) => {
    const updatedImages = images.filter(img => img.id !== id)
    setImages(updatedImages)
    onUpload(updatedImages)
  }, [images, onUpload])

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <div
        data-testid="image-drop-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          isDragging
            ? 'border-primary bg-primary/5 scale-105'
            : 'border-muted hover:border-muted-foreground/50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          multiple
          onChange={handleFileSelect}
          className="sr-only"
          aria-label="Upload Images"
        />

        <motion.div
          className="space-y-4"
          animate={{ scale: isDragging ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-6xl" aria-hidden="true">
            📁
          </div>

          <div>
            <p className="text-lg font-medium">
              Drag and drop images here
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Browse Files
            </button>
          </div>

          <p className="text-xs text-muted-foreground">
            Accepts JPEG, PNG, WebP, GIF up to {formatFileSize(maxFileSize)} each
          </p>
        </motion.div>

        {/* Upload Progress */}
        <AnimatePresence>
          {uploadProgress > 0 && uploadProgress < 100 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-muted"
            >
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-destructive/10 text-destructive rounded-md text-sm"
            role="alert"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Gallery */}
      {images.length > 0 && (
        <div
          data-testid="image-gallery"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {images.map((image) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative group aspect-square rounded-lg overflow-hidden border border-muted"
            >
              <img
                src={image.url}
                alt={image.name}
                className="w-full h-full object-cover"
              />

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(image.id)}
                className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Remove ${image.name}`}
              >
                ✕
              </button>

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">
                {image.name}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Image Count */}
      {images.length > 0 && (
        <p className="text-sm text-muted-foreground text-center">
          {images.length} / {maxImages} images
        </p>
      )}
    </div>
  )
}
