import { useState, useEffect } from 'react'

export default function DevErrorOverlay() {
  const [errors, setErrors] = useState([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function addError(entry) {
      setErrors(prev => [entry, ...prev].slice(0, 50))
      setOpen(true)
    }

    // Uncaught JS errors
    function onError(e) {
      if (e.message?.includes('favicon')) return
      addError({ type: 'error', msg: e.message, src: `${e.filename}:${e.lineno}`, time: now() })
    }

    // Unhandled promise rejections
    function onUnhandled(e) {
      addError({ type: 'promise', msg: String(e.reason?.message ?? e.reason), src: '', time: now() })
    }

    // console.error override
    const origError = console.error.bind(console)
    console.error = (...args) => {
      origError(...args)
      const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')
      if (msg.includes('favicon') || msg.includes('ReactDOM.render')) return
      addError({ type: 'console', msg, src: '', time: now() })
    }

    // console.warn override
    const origWarn = console.warn.bind(console)
    console.warn = (...args) => {
      origWarn(...args)
      // Only show worker/transcription warnings, not React noise
      const msg = args.join(' ')
      if (msg.includes('TRANSCRIBE') || msg.includes('worker') || msg.includes('onnx')) {
        addError({ type: 'warn', msg, src: '', time: now() })
      }
    }

    window.addEventListener('error', onError)
    window.addEventListener('unhandledrejection', onUnhandled)

    return () => {
      window.removeEventListener('error', onError)
      window.removeEventListener('unhandledrejection', onUnhandled)
      console.error = origError
      console.warn = origWarn
    }
  }, [])

  if (errors.length === 0) return null

  const colors = {
    error:   { bg: '#2a0a0a', border: '#7a2020', dot: '#ff5e5e', label: 'ERROR' },
    promise: { bg: '#2a0a0a', border: '#7a2020', dot: '#ff5e5e', label: 'PROMISE' },
    console: { bg: '#1a1a0a', border: '#5a4a00', dot: '#ffcc00', label: 'WARN' },
    warn:    { bg: '#0a1a2a', border: '#005a7a', dot: '#5ec8ff', label: 'INFO' },
  }

  return (
    <div style={{
      position: 'fixed', bottom: 16, right: 16,
      zIndex: 9999, fontFamily: 'var(--font-mono)',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6,
    }}>
      {/* Badge */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          background: '#1a1a1a', border: '1px solid #ff5e5e',
          borderRadius: 6, padding: '5px 12px',
          color: '#ff5e5e', fontSize: 11, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          fontFamily: 'inherit',
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff5e5e', display: 'block' }} />
        {errors.length} Fehler · {open ? 'ausblenden' : 'anzeigen'}
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          width: 480, maxHeight: 320,
          background: '#111', border: '1px solid #2a2a2a',
          borderRadius: 8, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 12px', borderBottom: '1px solid #2a2a2a',
          }}>
            <span style={{ fontSize: 11, color: '#888' }}>Dev-Fehlerkonsole</span>
            <button
              onClick={() => setErrors([])}
              style={{ background: 'transparent', border: 0, color: '#555', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}
            >leeren</button>
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {errors.map((e, i) => {
              const c = colors[e.type] ?? colors.console
              return (
                <div key={i} style={{
                  padding: '7px 12px',
                  borderBottom: '1px solid #1a1a1a',
                  background: c.bg,
                }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
                    <span style={{ fontSize: 9, color: c.dot, letterSpacing: '0.1em' }}>{c.label}</span>
                    <span style={{ fontSize: 9, color: '#444', marginLeft: 'auto' }}>{e.time}</span>
                  </div>
                  <div style={{ fontSize: 11, color: '#ddd', wordBreak: 'break-word', lineHeight: 1.5 }}>{e.msg}</div>
                  {e.src && <div style={{ fontSize: 10, color: '#555', marginTop: 2 }}>{e.src}</div>}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function now() {
  return new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
