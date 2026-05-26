import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { usePlayer } from '../hooks/usePlayer.js'
import { findActiveSegment, formatDuration, toSrtTime } from '../lib/segmentUtils.js'
import { getAudio } from '../lib/db.js'
import Player from './Player.jsx'
import ExportMenu from './ExportMenu.jsx'

const TABS = ['Transkript', 'Zusammenfassung', 'Kapitel', 'Sprecher']

export default function TranscriptScreen({ recording, onUpdate }) {
  const [activeTab, setActiveTab] = useState('Transkript')
  const [editMode, setEditMode] = useState(false)
  const [exportOpen, setExportOpen] = useState(false)
  const [audioBuffer, setAudioBuffer] = useState(null)

  const { playerState, play, pause, seek, setSpeed } = usePlayer(recording.id)
  const { positionSec, durationSec } = playerState

  const activeSegmentIdx = findActiveSegment(recording.segments ?? [], positionSec)
  const activeSegmentId = recording.segments?.[activeSegmentIdx]?.id

  const segRefs = useRef({})

  // Scroll active segment into view while playing
  useEffect(() => {
    if (!playerState.playing || !activeSegmentId) return
    const el = segRefs.current[activeSegmentId]
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [activeSegmentId, playerState.playing])

  // Decode audio for waveform visualization
  useEffect(() => {
    getAudio(recording.id).then(async (blob) => {
      if (!blob) return
      try {
        const buf = await blob.arrayBuffer()
        const ctx = new AudioContext({ sampleRate: 16000 })
        const decoded = await ctx.decodeAudioData(buf)
        setAudioBuffer(decoded)
      } catch {
        // Waveform fallback to sine pattern
      }
    })
  }, [recording.id])

  const speakerMap = useMemo(
    () => Object.fromEntries((recording.speakers ?? []).map(s => [s.id, s])),
    [recording.speakers]
  )

  function handleSegmentClick(seg) {
    seek(seg.startSec)
  }

  function handleSegmentEdit(segId, newText) {
    const segments = (recording.segments ?? []).map(s =>
      s.id === segId ? { ...s, text: newText } : s
    )
    onUpdate({ segments })
  }

  function handleSpeakerRename(speakerId, newName) {
    const speakers = (recording.speakers ?? []).map(s =>
      s.id === speakerId ? { ...s, name: newName } : s
    )
    onUpdate({ speakers })
  }

  function handleAddBookmark(seg) {
    const bookmark = {
      id: `bm-${Date.now()}`,
      atSec: seg.startSec,
      label: seg.text.slice(0, 50),
    }
    onUpdate({ bookmarks: [...(recording.bookmarks ?? []), bookmark] })
  }

  function handleDeleteBookmark(id) {
    onUpdate({ bookmarks: (recording.bookmarks ?? []).filter(b => b.id !== id) })
  }

  const wordCount = recording.wordCount
    ?? (recording.segments ?? []).reduce((n, s) => n + s.text.split(/\s+/).filter(Boolean).length, 0)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{
        padding: '0 32px', height: 62, flexShrink: 0,
        borderBottom: '1px solid var(--vx-line)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--vx-paper)',
      }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--vx-muted-2)', marginBottom: 2 }}>Bibliothek</div>
          <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--vx-ink)' }}>{recording.title}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', position: 'relative' }}>
          <button
            onClick={() => setExportOpen(v => !v)}
            style={{
              background: 'var(--vx-paper)', border: '1px solid var(--vx-line)',
              borderRadius: 5, padding: '7px 12px', fontSize: 12,
              cursor: 'pointer', fontFamily: 'inherit', color: 'var(--vx-ink)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 16V4M12 4l-4 4M12 4l4 4"/>
              <path d="M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"/>
            </svg>
            Export
            <span style={{
              marginLeft: 4, padding: '1px 5px', background: 'var(--vx-cream)',
              borderRadius: 2, fontSize: 10, fontFamily: 'var(--font-mono)',
              color: 'var(--vx-muted)',
            }}>TXT · SRT · DOCX · PDF</span>
          </button>
          <ExportMenu recording={recording} open={exportOpen} onClose={() => setExportOpen(false)} />
          <button
            onClick={() => setEditMode(v => !v)}
            style={{
              background: editMode ? 'var(--vx-orange)' : 'var(--vx-ink)',
              color: '#fff', border: 0, borderRadius: 5,
              padding: '8px 14px', fontSize: 12, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {editMode ? 'Fertig' : 'Bearbeiten'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '20px 32px 20px', display: 'flex', gap: 20 }}>
        {/* Transcript card */}
        <div style={{
          flex: 1, background: 'var(--vx-paper)', border: '1px solid var(--vx-line)',
          borderRadius: 8, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0,
        }}>
          {/* Tab bar */}
          <div style={{
            padding: '10px 16px 0', display: 'flex', gap: 14,
            borderBottom: '1px solid var(--vx-line-2)',
            fontSize: 12, flexShrink: 0, alignItems: 'center',
          }}>
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: 'transparent', border: 0,
                  padding: '0 0 9px',
                  fontSize: 12, cursor: 'pointer',
                  fontFamily: 'inherit',
                  color: activeTab === tab ? 'var(--vx-ink)' : 'var(--vx-muted)',
                  fontWeight: activeTab === tab ? 500 : 400,
                  borderBottom: activeTab === tab ? '2px solid var(--vx-orange)' : '2px solid transparent',
                  marginBottom: -1,
                }}
              >
                {tab}
              </button>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 9 }}>
              <span style={{ width: 6, height: 6, background: 'var(--vx-success)', borderRadius: '50%', display: 'block' }} />
              <span style={{ fontSize: 11, color: 'var(--vx-muted-2)' }}>Gespeichert</span>
            </div>
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
            {activeTab === 'Transkript' && (
              <TranscriptList
                segments={recording.segments ?? []}
                speakerMap={speakerMap}
                activeSegmentId={activeSegmentId}
                editMode={editMode}
                segRefs={segRefs}
                onSegmentClick={handleSegmentClick}
                onSegmentEdit={handleSegmentEdit}
                onAddBookmark={handleAddBookmark}
              />
            )}
            {activeTab === 'Zusammenfassung' && (
              <SummaryTab segments={recording.segments ?? []} speakerMap={speakerMap} />
            )}
            {activeTab === 'Kapitel' && (
              <ChaptersTab segments={recording.segments ?? []} onSeek={seek} />
            )}
            {activeTab === 'Sprecher' && (
              <SpeakersTab
                speakers={recording.speakers ?? []}
                segments={recording.segments ?? []}
                onRename={handleSpeakerRename}
              />
            )}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 14, flexShrink: 0 }}>
          {/* Stats */}
          <div style={{ background: 'var(--vx-paper)', border: '1px solid var(--vx-line)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--vx-muted-2)', marginBottom: 10 }}>Statistik</div>
            {[
              ['Dauer', formatDuration(recording.durationSec)],
              ['Wörter', wordCount.toLocaleString('de-DE')],
              ['Sprecher', (recording.speakers ?? []).length],
              ['Segmente', (recording.segments ?? []).length],
              ['Sprache', recording.language === 'auto' ? 'Auto' : recording.language?.toUpperCase() ?? '—'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 12.5, borderBottom: '1px solid var(--vx-line-2)' }}>
                <span style={{ color: 'var(--vx-muted)' }}>{k}</span>
                <span style={{ color: 'var(--vx-ink)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Bookmarks */}
          <div style={{ background: 'var(--vx-paper)', border: '1px solid var(--vx-line)', borderRadius: 8, padding: '14px 16px', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--vx-muted-2)', marginBottom: 10, flexShrink: 0 }}>Lesezeichen</div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {(recording.bookmarks ?? []).length === 0 && (
                <div style={{ fontSize: 12, color: 'var(--vx-muted)', textAlign: 'center', padding: '20px 0' }}>
                  Klick auf ein Segment-Symbol zum Hinzufügen
                </div>
              )}
              {(recording.bookmarks ?? []).map((bm, i) => (
                <div
                  key={bm.id}
                  onClick={() => seek(bm.atSec)}
                  style={{
                    display: 'flex', gap: 8, padding: '7px 0',
                    borderBottom: i < (recording.bookmarks?.length ?? 0) - 1 ? '1px solid var(--vx-line-2)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ width: 2, background: 'var(--vx-orange)', borderRadius: 1, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--vx-muted-2)' }}>{toSrtTime(bm.atSec).replace(',', '.').slice(0, 8)}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--vx-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{bm.label}</div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); handleDeleteBookmark(bm.id) }}
                    style={{ background: 'transparent', border: 0, cursor: 'pointer', color: 'var(--vx-muted)', fontSize: 14, padding: '0 4px', flexShrink: 0 }}
                  >×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Player */}
      <Player
        playerState={playerState}
        play={play}
        pause={pause}
        seek={seek}
        setSpeed={setSpeed}
        audioBuffer={audioBuffer}
      />
    </div>
  )
}

function TranscriptList({ segments, speakerMap, activeSegmentId, editMode, segRefs, onSegmentClick, onSegmentEdit, onAddBookmark }) {
  const [hoveredId, setHoveredId] = useState(null)

  if (segments.length === 0) {
    return <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--vx-muted)', fontSize: 13 }}>Keine Segmente vorhanden</div>
  }

  return (
    <div>
      {segments.map((seg) => {
        const speaker = speakerMap[seg.speakerId]
        const isActive = seg.id === activeSegmentId
        const isHovered = seg.id === hoveredId
        const colorIdx = speaker?.colorIndex ?? 0

        return (
          <div
            key={seg.id}
            ref={el => { if (el) segRefs.current[seg.id] = el }}
            onClick={() => onSegmentClick(seg)}
            onMouseEnter={() => setHoveredId(seg.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              display: 'flex', gap: 12, padding: '8px 6px',
              borderRadius: 5,
              background: isActive ? 'var(--vx-orange-soft)' : isHovered ? '#F5F4F0' : 'transparent',
              marginBottom: 2, cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {/* Speaker avatar */}
            <div style={{
              width: 26, height: 26, borderRadius: '50%', flexShrink: 0, marginTop: 2,
              background: colorIdx === 1 ? 'var(--vx-orange)' : 'var(--vx-ink)',
              color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 600,
            }}>
              {speaker ? speaker.name.slice(0, 1).toUpperCase() : '?'}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Speaker name + timestamp */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 3 }}>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--vx-ink)' }}>
                  {speaker?.name ?? 'Unbekannt'}
                </span>
                <span style={{ fontSize: 10.5, fontFamily: 'var(--font-mono)', color: 'var(--vx-muted-2)' }}>
                  {toSrtTime(seg.startSec).slice(0, 8).replace(',', '.')}
                </span>
              </div>

              {/* Text */}
              {editMode ? (
                <textarea
                  defaultValue={seg.text}
                  onBlur={e => onSegmentEdit(seg.id, e.target.value)}
                  onClick={e => e.stopPropagation()}
                  style={{
                    width: '100%', fontSize: 14, lineHeight: 1.55,
                    color: 'var(--vx-ink)', fontFamily: 'inherit',
                    background: 'transparent', border: '1px solid var(--vx-line)',
                    borderRadius: 4, padding: '4px 6px', resize: 'vertical',
                    outline: 'none', minHeight: 48,
                  }}
                />
              ) : (
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: '#1a1a1a' }}>{seg.text}</p>
              )}
            </div>

            {/* Hover actions */}
            {isHovered && !editMode && (
              <div style={{ display: 'flex', gap: 4, alignItems: 'flex-start', flexShrink: 0 }}>
                <ActionBtn title="Lesezeichen" onClick={e => { e.stopPropagation(); onAddBookmark(seg) }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                  </svg>
                </ActionBtn>
                <ActionBtn title="Kopieren" onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(seg.text) }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                  </svg>
                </ActionBtn>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function ActionBtn({ title, onClick, children }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        background: 'transparent', border: '1px solid var(--vx-line)',
        borderRadius: 4, padding: '4px 5px',
        cursor: 'pointer', color: 'var(--vx-muted)',
        display: 'flex', alignItems: 'center',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = 'var(--vx-ink)'; e.currentTarget.style.borderColor = 'var(--vx-ink)' }}
      onMouseLeave={e => { e.currentTarget.style.color = 'var(--vx-muted)'; e.currentTarget.style.borderColor = 'var(--vx-line)' }}
    >
      {children}
    </button>
  )
}

function SummaryTab({ segments, speakerMap }) {
  const text = segments.map(s => s.text).join(' ')
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? []
  const preview = sentences.slice(0, 5).join(' ')
  return (
    <div style={{ padding: '8px 4px' }}>
      <p style={{ fontSize: 13.5, lineHeight: 1.7, color: 'var(--vx-ink)', marginBottom: 16 }}>
        {preview || 'Keine Zusammenfassung verfügbar.'}
      </p>
      <div style={{ fontSize: 11, color: 'var(--vx-muted)', padding: '10px', background: 'var(--vx-cream)', borderRadius: 6 }}>
        Automatische Zusammenfassung wird in einer zukünftigen Version via KI-API ergänzt.
      </div>
    </div>
  )
}

function ChaptersTab({ segments, onSeek }) {
  const chapters = segments
    .filter((_, i) => i % Math.max(1, Math.floor(segments.length / 6)) === 0)
    .slice(0, 8)
    .map((seg, i) => ({ ...seg, chapterTitle: `Kapitel ${i + 1}` }))

  return (
    <div>
      {chapters.map(ch => (
        <div
          key={ch.id}
          onClick={() => onSeek(ch.startSec)}
          style={{
            padding: '10px 8px', borderBottom: '1px solid var(--vx-line-2)',
            cursor: 'pointer', display: 'flex', gap: 12, alignItems: 'center',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--vx-orange)', flexShrink: 0 }}>
            {toSrtTime(ch.startSec).slice(0, 8)}
          </span>
          <span style={{ fontSize: 13, color: 'var(--vx-ink)' }}>{ch.text.slice(0, 60)}…</span>
        </div>
      ))}
    </div>
  )
}

function SpeakersTab({ speakers, segments, onRename }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {speakers.map(sp => {
        const count = segments.filter(s => s.speakerId === sp.id).length
        return (
          <div key={sp.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', background: 'var(--vx-cream)', borderRadius: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: sp.colorIndex === 1 ? 'var(--vx-orange)' : 'var(--vx-ink)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 600,
            }}>
              {sp.name.slice(0, 1)}
            </div>
            <div style={{ flex: 1 }}>
              <input
                defaultValue={sp.name}
                onBlur={e => onRename(sp.id, e.target.value)}
                style={{
                  background: 'transparent', border: 0, borderBottom: '1px solid var(--vx-line)',
                  fontSize: 13, fontWeight: 500, color: 'var(--vx-ink)',
                  fontFamily: 'inherit', outline: 'none', width: '100%',
                }}
              />
              <div style={{ fontSize: 11, color: 'var(--vx-muted)', marginTop: 3 }}>{count} Segmente</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
