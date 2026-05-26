import WaveformCanvas from './WaveformCanvas.jsx'
import { formatDuration } from '../lib/segmentUtils.js'

const SPEEDS = [1, 1.25, 1.5, 2]

export default function Player({ playerState, play, pause, seek, setSpeed, audioBuffer }) {
  const { playing, positionSec, durationSec, speed } = playerState

  function cycleSpeed() {
    const idx = SPEEDS.indexOf(speed)
    setSpeed(SPEEDS[(idx + 1) % SPEEDS.length])
  }

  // Timeline ticks
  function buildTicks(dur) {
    if (!dur || dur <= 0) return []
    const intervals = [60, 300, 600, 1800, 3600]
    const interval = intervals.find(s => dur / s <= 8) ?? 3600
    const ticks = []
    for (let t = 0; t <= dur; t += interval) {
      ticks.push({ t, label: formatDuration(t) })
    }
    return ticks
  }

  const ticks = buildTicks(durationSec)

  return (
    <div style={{
      borderTop: '1px solid var(--vx-line)',
      padding: '14px 32px',
      background: 'var(--vx-ink)',
      color: '#fff',
      display: 'flex', alignItems: 'center', gap: 18,
      flexShrink: 0,
    }}>
      {/* Transport */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <RoundBtn size={32} onClick={() => seek(Math.max(0, positionSec - 10))}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M19 20l-9-8 9-8M5 19V5"/>
          </svg>
        </RoundBtn>
        <RoundBtn size={36} accent onClick={playing ? pause : play}>
          {playing ? (
            <svg width="12" height="14" viewBox="0 0 12 14" fill="#fff">
              <rect x="0" y="0" width="4" height="14" rx="1"/>
              <rect x="8" y="0" width="4" height="14" rx="1"/>
            </svg>
          ) : (
            <svg width="12" height="14" viewBox="0 0 12 14" fill="#fff">
              <path d="M0 0l12 7-12 7V0z"/>
            </svg>
          )}
        </RoundBtn>
        <RoundBtn size={32} onClick={() => seek(Math.min(durationSec, positionSec + 10))}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
            <path d="M5 4l9 8-9 8M19 5v14"/>
          </svg>
        </RoundBtn>
      </div>

      {/* Time */}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#9a9a9a', minWidth: 96, flexShrink: 0 }}>
        {formatDuration(positionSec)}{' '}
        <span style={{ color: '#5a5a5a' }}>/ {formatDuration(durationSec)}</span>
      </div>

      {/* Waveform + ticks */}
      <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
        <WaveformCanvas
          audioBuffer={audioBuffer}
          positionSec={positionSec}
          durationSec={durationSec}
          onScrub={seek}
        />
        {ticks.length > 0 && (
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: -16,
            display: 'flex', justifyContent: 'space-between',
            fontSize: 9.5, color: '#5a5a5a', fontFamily: 'var(--font-mono)',
            pointerEvents: 'none',
          }}>
            {ticks.map(({ t, label }) => (
              <span key={t}>{label}</span>
            ))}
          </div>
        )}
      </div>

      {/* Speed + Volume */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <button
          onClick={cycleSpeed}
          style={{
            background: 'var(--vx-ink-2)', border: 0, color: '#fff',
            borderRadius: 4, padding: '5px 9px',
            cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10.5,
          }}
        >
          {speed % 1 === 0 ? `${speed}.0×` : `${speed}×`}
        </button>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9a9a9a" strokeWidth="1.6">
          <path d="M11 5L6 9H2v6h4l5 4V5z"/>
          <path d="M15.5 8.5a5 5 0 010 7"/>
        </svg>
      </div>
    </div>
  )
}

function RoundBtn({ size, accent, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: '50%',
        background: accent ? 'var(--vx-orange)' : 'var(--vx-ink-2)',
        border: 0, color: '#fff', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  )
}
