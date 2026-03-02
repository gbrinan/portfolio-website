/**
 * TC-003: Image Upload Functionality Specification Test
 * Requirement: RQ-003 - Image Upload Functionality
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImageUpload } from '@/components/ai-artist/ImageUpload'
import { UploadedImage } from '@/types'

describe('TC-003: Image Upload (RQ-003)', () => {
  const mockOnUpload = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Drag-and-Drop Functionality', () => {
    it('should highlight drop zone when file is dragged over', async () => {
      render(<ImageUpload onUpload={mockOnUpload} />)

      const dropZone = screen.getByTestId('image-drop-zone')
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

      fireEvent.dragOver(dropZone)

      await waitFor(() => {
        expect(dropZone).toHaveClass('drag-over')
      })
    })

    it('should process and display images when dropped', async () => {
      render(<ImageUpload onUpload={mockOnUpload} />)

      const dropZone = screen.getByTestId('image-drop-zone')
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file],
        },
      })

      await waitFor(() => {
        expect(mockOnUpload).toHaveBeenCalled()
      })
    })
  })

  describe('File Picker Functionality', () => {
    it('should provide file picker button as alternative', () => {
      render(<ImageUpload onUpload={mockOnUpload} />)

      const fileInput = screen.getByLabelText(/Upload Images/i)
      expect(fileInput).toBeInTheDocument()
      expect(fileInput).toHaveAttribute('type', 'file')
      expect(fileInput).toHaveAttribute('accept', 'image/jpeg,image/png,image/webp,image/gif')
    })

    it('should allow multiple file selection', () => {
      render(<ImageUpload onUpload={mockOnUpload} />)

      const fileInput = screen.getByLabelText(/Upload Images/i)
      expect(fileInput).toHaveAttribute('multiple')
    })
  })

  describe('Image Validation', () => {
    it('should validate file type (JPEG, PNG, WebP, GIF)', async () => {
      render(<ImageUpload onUpload={mockOnUpload} />)

      const invalidFile = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const dropZone = screen.getByTestId('image-drop-zone')

      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [invalidFile],
        },
      })

      await waitFor(() => {
        expect(screen.getByText(/Invalid file type/i)).toBeInTheDocument()
      })
    })

    it('should enforce maximum file size of 10MB', async () => {
      render(<ImageUpload onUpload={mockOnUpload} />)

      // 11MB 파일 생성
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      })
      const dropZone = screen.getByTestId('image-drop-zone')

      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [largeFile],
        },
      })

      await waitFor(() => {
        expect(screen.getByText(/File size exceeds 10MB/i)).toBeInTheDocument()
      })
    })

    it('should enforce maximum of 50 images', async () => {
      const existingImages: UploadedImage[] = Array.from({ length: 50 }, (_, i) => ({
        id: `img-${i}`,
        url: `https://example.com/img${i}.jpg`,
        name: `image${i}.jpg`,
        size: 1024,
        type: 'image/jpeg',
        uploadedAt: new Date(),
      }))

      render(<ImageUpload onUpload={mockOnUpload} existingImages={existingImages} />)

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const dropZone = screen.getByTestId('image-drop-zone')

      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file],
        },
      })

      await waitFor(() => {
        expect(screen.getByText(/Maximum 50 images allowed/i)).toBeInTheDocument()
      })
    })
  })

  describe('Preview Generation', () => {
    it('should generate preview for uploaded images', async () => {
      render(<ImageUpload onUpload={mockOnUpload} />)

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const dropZone = screen.getByTestId('image-drop-zone')

      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [file],
        },
      })

      await waitFor(() => {
        const preview = screen.getByRole('img', { name: /test.jpg/i })
        expect(preview).toBeInTheDocument()
        expect(preview).toHaveAttribute('src', expect.stringContaining('blob:'))
      })
    })
  })

  describe('Gallery Display', () => {
    it('should display images in responsive grid', () => {
      const mockImages: UploadedImage[] = [
        {
          id: '1',
          url: 'https://example.com/img1.jpg',
          name: 'image1.jpg',
          size: 1024,
          type: 'image/jpeg',
          uploadedAt: new Date(),
        },
        {
          id: '2',
          url: 'https://example.com/img2.jpg',
          name: 'image2.jpg',
          size: 2048,
          type: 'image/jpeg',
          uploadedAt: new Date(),
        },
      ]

      render(<ImageUpload onUpload={mockOnUpload} existingImages={mockImages} />)

      const gallery = screen.getByTestId('image-gallery')
      expect(gallery).toBeInTheDocument()
      expect(gallery).toHaveClass('grid')
    })
  })

  describe('Upload Progress', () => {
    it('should show progress indicator for large files', async () => {
      jest.useFakeTimers()

      render(<ImageUpload onUpload={mockOnUpload} />)

      const largeFile = new File(['x'.repeat(5 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      })
      const dropZone = screen.getByTestId('image-drop-zone')

      fireEvent.drop(dropZone, {
        dataTransfer: {
          files: [largeFile],
        },
      })

      await waitFor(() => {
        const progressBar = screen.getByRole('progressbar')
        expect(progressBar).toBeInTheDocument()
      })

      jest.useRealTimers()
    })
  })
})
