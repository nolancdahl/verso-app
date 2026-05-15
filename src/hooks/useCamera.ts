import { useCallback, useRef } from 'react'

export function useCamera() {
  // Keep a ref to the input so it doesn't get garbage collected on mobile
  const inputRef = useRef<HTMLInputElement | null>(null)

  const pickPhoto = useCallback((useLiveCamera?: boolean): Promise<string | null> => {
    return new Promise((resolve) => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      if (useLiveCamera) input.capture = 'environment'
      inputRef.current = input

      // Append to DOM temporarily to prevent GC on some mobile browsers
      input.style.position = 'fixed'
      input.style.top = '-9999px'
      input.style.left = '-9999px'
      document.body.appendChild(input)

      const cleanup = () => {
        if (input.parentNode) {
          document.body.removeChild(input)
        }
        inputRef.current = null
      }

      input.addEventListener('change', () => {
        const file = input.files?.[0]
        if (!file) {
          cleanup()
          resolve(null)
          return
        }

        const reader = new FileReader()
        reader.onload = () => {
          const img = new window.Image()
          img.onload = () => {
            const canvas = document.createElement('canvas')
            const maxSize = 1200
            let { width, height } = img
            if (width > height && width > maxSize) {
              height = (height / width) * maxSize
              width = maxSize
            } else if (height > maxSize) {
              width = (width / height) * maxSize
              height = maxSize
            }
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')!
            ctx.drawImage(img, 0, 0, width, height)
            const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
            cleanup()
            resolve(dataUrl)
          }
          img.onerror = () => {
            cleanup()
            resolve(null)
          }
          img.src = reader.result as string
        }
        reader.onerror = () => {
          cleanup()
          resolve(null)
        }
        reader.readAsDataURL(file)
      })

      input.click()
    })
  }, [])

  const capturePhoto = useCallback(() => pickPhoto(false), [pickPhoto])

  return { capturePhoto, pickPhoto }
}
