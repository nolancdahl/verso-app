import { useEffect, useRef, useCallback } from 'react'

export function useWakeLock() {
  const wakeLock = useRef<WakeLockSentinel | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  // Method 1: Wake Lock API
  const requestWakeLock = useCallback(async () => {
    if (wakeLock.current) {
      try { await wakeLock.current.release() } catch {}
      wakeLock.current = null
    }

    try {
      if ('wakeLock' in navigator) {
        wakeLock.current = await navigator.wakeLock.request('screen')
        wakeLock.current.addEventListener('release', () => {
          wakeLock.current = null
          if (document.visibilityState === 'visible') {
            setTimeout(() => requestWakeLock(), 1000)
          }
        })
      }
    } catch {
      // Silently fail — fallback video method handles it
    }
  }, [])

  // Method 2: Hidden video trick — plays a tiny silent video on loop
  // This prevents the screen from sleeping on browsers that don't support Wake Lock API
  const startVideoKeepAwake = useCallback(() => {
    if (videoRef.current) return

    const video = document.createElement('video')
    video.setAttribute('playsinline', '')
    video.setAttribute('muted', '')
    video.setAttribute('loop', '')
    video.muted = true
    video.style.position = 'fixed'
    video.style.top = '-9999px'
    video.style.left = '-9999px'
    video.style.width = '1px'
    video.style.height = '1px'
    video.style.opacity = '0.01'

    // Create a tiny silent video using a data URI (1 second of silence)
    // This is a minimal valid MP4 with no audio/video content
    const canvas = document.createElement('canvas')
    canvas.width = 2
    canvas.height = 2
    const stream = canvas.captureStream(1)
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' })
    const chunks: Blob[] = []

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data)
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' })
      video.src = URL.createObjectURL(blob)
      video.play().catch(() => {})
      document.body.appendChild(video)
      videoRef.current = video
    }

    mediaRecorder.start()
    setTimeout(() => mediaRecorder.stop(), 500)
  }, [])

  const stopVideoKeepAwake = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause()
      if (videoRef.current.src) URL.revokeObjectURL(videoRef.current.src)
      videoRef.current.remove()
      videoRef.current = null
    }
  }, [])

  useEffect(() => {
    // Try both methods
    requestWakeLock()
    startVideoKeepAwake()

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock()
        if (!videoRef.current) startVideoKeepAwake()
      }
    }

    const handleFocus = () => {
      requestWakeLock()
    }

    // Also try to keep alive with periodic user-less interaction
    const keepAlive = setInterval(() => {
      if (document.visibilityState === 'visible') {
        if (!wakeLock.current) requestWakeLock()
        // Ensure video is still playing
        if (videoRef.current && videoRef.current.paused) {
          videoRef.current.play().catch(() => {})
        }
      }
    }, 15000)

    document.addEventListener('visibilitychange', handleVisibility)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
      window.removeEventListener('focus', handleFocus)
      clearInterval(keepAlive)
      stopVideoKeepAwake()
      if (wakeLock.current) wakeLock.current.release()
    }
  }, [requestWakeLock, startVideoKeepAwake, stopVideoKeepAwake])
}
