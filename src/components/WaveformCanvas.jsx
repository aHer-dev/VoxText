import { useEffect, useRef, useMemo } from 'react'

const BAR_COUNT = 160
const MAX_BAR_H = 36

export default function WaveformCanvas({ audioBuffer, positionSec, durationSec, onScrub }) {
  const canvasRef = useRef(null)

  const bars = useMemo(() => {
    if (!audioBuffer) {
      // Fallback: sine-based pattern matching the mockup's look
      return Array.from({ length: BAR_COUNT }, (_, i) =>
        4 + Math.abs(Math.sin(i * 0.31 + Math.cos(i * 0.22) * 2)) * MAX_BAR_H
      )
    }
    const data = audioBuffer.getChannelData(0)
    const step = Math.floor(data.length / BAR_COUNT)
    return Array.from({ length: BAR_COUNT }, (_, i) => {
      const start = i * step
      let sumSq = 0
      for (let j = start; j < start + step && j < data.length; j++) {
        sumSq += data[j] * data[j]
      }
      const rms = Math.sqrt(sumSq / step)
      return Math.max(2, Math.min(rms * MAX_BAR_H * 5, MAX_BAR_H))
    })
  }, [audioBuffer])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    const W = canvas.offsetWidth * dpr
    const H = canvas.offsetHeight * dpr

    if (canvas.width !== W || canvas.height !== H) {
      canvas.width = W
      canvas.height = H
    }

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, W, H)

    const totalGap = (BAR_COUNT - 1) * 1.5 * dpr
    const barW = (W - totalGap) / BAR_COUNT
    const gap = 1.5 * dpr
    const playedX = durationSec > 0 ? (positionSec / durationSec) * W : 0

    bars.forEach((h, i) => {
      const scaledH = Math.min(h * dpr, H)
      const x = i * (barW + gap)
      const y = (H - scaledH) / 2
      ctx.fillStyle = x < playedX ? '#E84F1C' : '#3A3A3A'
      ctx.beginPath()
      if (ctx.roundRect) {
        ctx.roundRect(x, y, Math.max(barW, 1), scaledH, 1)
      } else {
        ctx.rect(x, y, Math.max(barW, 1), scaledH)
      }
      ctx.fill()
    })
  }, [bars, positionSec, durationSec])

  function handleClick(e) {
    const rect = canvasRef.current.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    onScrub?.(Math.max(0, Math.min(ratio * durationSec, durationSec)))
  }

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      style={{ flex: 1, height: 44, cursor: 'pointer', display: 'block' }}
    />
  )
}
