import { useState, useRef, useEffect, useCallback } from 'react'
import { getAudio } from '../lib/db.js'

export function usePlayer(recordingId) {
  const audioRef = useRef(null)
  const rafRef = useRef(null)
  const [playerState, setPlayerState] = useState({
    playing: false,
    positionSec: 0,
    durationSec: 0,
    speed: 1,
  })

  // Create audio element once
  useEffect(() => {
    audioRef.current = new Audio()
    return () => {
      audioRef.current?.pause()
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Load audio blob whenever recordingId changes
  useEffect(() => {
    if (!recordingId) return
    let objectUrl = null

    getAudio(recordingId).then(blob => {
      if (!blob) return
      objectUrl = URL.createObjectURL(blob)
      const audio = audioRef.current
      audio.src = objectUrl
      audio.load()
    })

    const audio = audioRef.current
    const onMeta = () => setPlayerState(s => ({ ...s, durationSec: audio.duration || 0 }))
    const onEnded = () => {
      setPlayerState(s => ({ ...s, playing: false }))
      cancelAnimationFrame(rafRef.current)
    }
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('ended', onEnded)
      audio.pause()
      cancelAnimationFrame(rafRef.current)
      setPlayerState({ playing: false, positionSec: 0, durationSec: 0, speed: 1 })
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [recordingId])

  const startRAF = useCallback(() => {
    const tick = () => {
      setPlayerState(s => ({ ...s, positionSec: audioRef.current?.currentTime ?? 0 }))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [])

  const play = useCallback(() => {
    audioRef.current?.play()
    setPlayerState(s => ({ ...s, playing: true }))
    startRAF()
  }, [startRAF])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setPlayerState(s => ({ ...s, playing: false }))
    cancelAnimationFrame(rafRef.current)
  }, [])

  const seek = useCallback((sec) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = sec
    setPlayerState(s => ({ ...s, positionSec: sec }))
  }, [])

  const setSpeed = useCallback((speed) => {
    if (audioRef.current) audioRef.current.playbackRate = speed
    setPlayerState(s => ({ ...s, speed }))
  }, [])

  return { playerState, play, pause, seek, setSpeed }
}
