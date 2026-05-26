import { useEffect, useRef } from 'react'
import { buildTxt, buildSrt, buildDocxBlob, printPdf, downloadBlob, downloadText } from '../lib/export.js'

export default function ExportMenu({ recording, open, onClose }) {
  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, onClose])

  if (!open) return null

  const slug = recording.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  async function handleExport(format) {
    onClose()
    switch (format) {
      case 'txt':
        downloadText(buildTxt(recording), `${slug}.txt`)
        break
      case 'srt':
        downloadText(buildSrt(recording), `${slug}.srt`)
        break
      case 'docx': {
        const blob = await buildDocxBlob(recording)
        downloadBlob(blob, `${slug}.docx`)
        break
      }
      case 'pdf':
        printPdf(recording)
        break
    }
  }

  return (
    <div
      ref={menuRef}
      style={{
        position: 'absolute', top: '100%', right: 0, marginTop: 6,
        background: 'var(--vx-paper)', border: '1px solid var(--vx-line)',
        borderRadius: 8, padding: '6px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        minWidth: 160, zIndex: 100,
      }}
    >
      {[
        { id: 'txt', label: 'TXT — Nur Text', desc: 'Plaintext mit Zeitstempeln' },
        { id: 'srt', label: 'SRT — Untertitel', desc: 'Für Video-Player' },
        { id: 'docx', label: 'DOCX — Word', desc: 'Bearbeitbares Dokument' },
        { id: 'pdf', label: 'PDF — Drucken', desc: 'Via Browser-Druck' },
      ].map(({ id, label, desc }) => (
        <button
          key={id}
          onClick={() => handleExport(id)}
          style={{
            display: 'block', width: '100%',
            background: 'transparent', border: 0,
            padding: '8px 10px', borderRadius: 5,
            cursor: 'pointer', textAlign: 'left',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--vx-cream)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ fontSize: 12.5, color: 'var(--vx-ink)', fontWeight: 500 }}>{label}</div>
          <div style={{ fontSize: 11, color: 'var(--vx-muted)', marginTop: 1 }}>{desc}</div>
        </button>
      ))}
    </div>
  )
}
