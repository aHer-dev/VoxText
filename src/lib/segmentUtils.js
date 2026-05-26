export function assignSpeakers(segments, threshold = 1.5) {
  if (segments.length === 0) return segments

  const gaps = segments.slice(1).map((seg, i) =>
    Math.max(0, seg.startSec - segments[i].endSec)
  )

  const sorted = [...gaps].sort((a, b) => a - b)
  const median = sorted[Math.floor(sorted.length / 2)] ?? 0
  const turnThreshold = Math.max(0.8, median * threshold)

  let currentSpeakerIdx = 0
  return segments.map((seg, i) => {
    if (i > 0 && gaps[i - 1] >= turnThreshold) {
      currentSpeakerIdx = 1 - currentSpeakerIdx
    }
    return { ...seg, speakerId: `spk-${currentSpeakerIdx}` }
  })
}

export function defaultSpeakers() {
  return [
    { id: 'spk-0', name: 'Sprecher A', colorIndex: 0 },
    { id: 'spk-1', name: 'Sprecher B', colorIndex: 1 },
  ]
}

export function findActiveSegment(segments, positionSec) {
  if (!segments || segments.length === 0) return -1
  let lo = 0, hi = segments.length - 1
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    const seg = segments[mid]
    if (positionSec < seg.startSec) {
      hi = mid - 1
    } else if (positionSec > seg.endSec) {
      lo = mid + 1
    } else {
      return mid
    }
  }
  return Math.max(0, hi)
}

export function toSrtTime(s) {
  const h  = Math.floor(s / 3600).toString().padStart(2, '0')
  const m  = Math.floor((s % 3600) / 60).toString().padStart(2, '0')
  const sc = Math.floor(s % 60).toString().padStart(2, '0')
  const ms = Math.round((s % 1) * 1000).toString().padStart(3, '0')
  return `${h}:${m}:${sc},${ms}`
}

export function formatDuration(totalSec) {
  if (!totalSec || isNaN(totalSec)) return '0:00'
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = Math.floor(totalSec % 60)
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`
}

export function nanoid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}
