import { useState } from 'react'
import { formatDuration } from '../lib/segmentUtils.js'

export default function Sidebar({ recordings, activeId, onSelect, onNew }) {
  const [query, setQuery] = useState('')

  const filtered = recordings.filter(r =>
    r.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <aside style={{
      width: 280, minWidth: 280,
      background: 'var(--vx-sidebar-bg)',
      color: 'var(--vx-sidebar-text)',
      display: 'flex', flexDirection: 'column',
      borderRight: '1px solid var(--vx-sidebar-divider)',
      fontFamily: 'var(--font-sans)',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 20px 18px', borderBottom: '1px solid var(--vx-sidebar-divider)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 26, height: 26, background: 'var(--vx-orange)', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round">
              <path d="M3 4v6M6 2v10M9 5v4M12 3v8"/>
            </svg>
          </div>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: 14, letterSpacing: '-0.01em' }}>
            VoxText <span style={{ color: 'var(--vx-sidebar-muted)', fontWeight: 400, marginLeft: 4 }}>Studio</span>
          </div>
        </div>
      </div>

      {/* New Transcription CTA */}
      <button
        onClick={onNew}
        style={{
          margin: '16px 20px 8px',
          background: 'var(--vx-orange)', border: 0, color: '#fff',
          padding: '11px 14px', borderRadius: 6,
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--vx-orange-hover)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--vx-orange)'}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Neue Transkription
      </button>

      {/* Search */}
      <div style={{ padding: '14px 20px 8px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--vx-sidebar-muted)" strokeWidth="1.8">
          <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
        </svg>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Durchsuchen…"
          style={{
            background: 'transparent', border: 0, outline: 0,
            color: 'var(--vx-sidebar-text)', fontSize: 13,
            fontFamily: 'inherit', flex: 1,
          }}
        />
      </div>

      {/* Library label */}
      <div style={{
        padding: '8px 20px 6px',
        fontSize: 10.5, letterSpacing: '0.14em',
        textTransform: 'uppercase', color: 'var(--vx-sidebar-muted)',
      }}>
        Bibliothek
      </div>

      {/* Library list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
        {filtered.length === 0 && (
          <div style={{ padding: '20px 12px', fontSize: 12, color: 'var(--vx-sidebar-muted)', textAlign: 'center' }}>
            {recordings.length === 0 ? 'Noch keine Transkriptionen' : 'Keine Ergebnisse'}
          </div>
        )}
        {filtered.map(rec => {
          const isActive = rec.id === activeId
          return (
            <div
              key={rec.id}
              onClick={() => rec.status === 'ready' && onSelect(rec.id)}
              style={{
                padding: '10px 12px', borderRadius: 5, marginBottom: 1,
                background: isActive ? 'var(--vx-ink-2)' : 'transparent',
                cursor: rec.status === 'ready' ? 'pointer' : 'default',
                position: 'relative',
              }}
            >
              {isActive && (
                <span style={{
                  position: 'absolute', left: 0, top: 8, bottom: 8,
                  width: 2, background: 'var(--vx-orange)', borderRadius: 1,
                }} />
              )}
              <div style={{
                fontSize: 13, color: isActive ? '#fff' : '#D0D0D0',
                fontWeight: isActive ? 500 : 400, marginBottom: 3,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {rec.title}
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 11, color: 'var(--vx-sidebar-muted)',
                fontFamily: 'var(--font-mono)',
              }}>
                <span>{formatDate(rec.createdAt)}</span>
                <span>{formatDuration(rec.durationSec)}</span>
              </div>
              {rec.status === 'processing' && (
                <div style={{ height: 2, background: '#2a2a2a', borderRadius: 1, marginTop: 5 }}>
                  <div style={{
                    height: '100%', width: `${rec.progress ?? 0}%`,
                    background: 'var(--vx-orange)',
                    borderRadius: 1, transition: 'width 0.3s',
                  }} />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* User block */}
      <div style={{
        padding: '14px 20px',
        borderTop: '1px solid var(--vx-sidebar-divider)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: 'var(--vx-orange)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 600, flexShrink: 0,
        }}>
          VT
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, color: '#fff' }}>VoxText Studio</div>
          <div style={{ fontSize: 11, color: 'var(--vx-sidebar-muted)' }}>Lokal · Offline</div>
        </div>
      </div>
    </aside>
  )
}

function formatDate(iso) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now - d
  if (diff < 86400000) return 'Heute'
  if (diff < 172800000) return 'Gestern'
  return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' })
}
