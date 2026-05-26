import { useState, useRef, useCallback, useEffect } from 'react'
import { useTranscriber } from '../hooks/useTranscriber.js'
import { defaultSpeakers, nanoid } from '../lib/segmentUtils.js'

const MODELS = [
  { value: 'Xenova/whisper-tiny', label: 'Tiny — sehr schnell (~40 MB)' },
  { value: 'Xenova/whisper-base', label: 'Base — schnell (~75 MB)' },
  { value: 'Xenova/whisper-small', label: 'Small — empfohlen (~250 MB)' },
  { value: 'Xenova/whisper-medium', label: 'Medium — genau (~500 MB)' },
]

const LANGUAGES = [
  { value: 'auto', label: 'Auto-Erkennung' },
  { value: 'de', label: 'Deutsch' },
  { value: 'en', label: 'Englisch' },
  { value: 'fr', label: 'Französisch' },
  { value: 'es', label: 'Spanisch' },
  { value: 'it', label: 'Italienisch' },
  { value: 'pt', label: 'Portugiesisch' },
  { value: 'ru', label: 'Russisch' },
  { value: 'ja', label: 'Japanisch' },
  { value: 'zh', label: 'Chinesisch' },
  { value: 'ar', label: 'Arabisch' },
]

export default function UploadScreen({ onTranscriptionComplete, onProgress }) {
  const [mode, setMode] = useState('file')
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [options, setOptions] = useState({
    language: 'auto',
    modelId: 'Xenova/whisper-base',
    speakers: 2,
    timestamps: 'sentence',
  })
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState('')
  const [error, setError] = useState(null)
  const [currentRecordingId, setCurrentRecordingId] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const elapsedRef = useRef(null)
  const fileInputRef = useRef(null)
  const { transcribe, cancel } = useTranscriber()

  useEffect(() => {
    if (processing) {
      setElapsed(0)
      elapsedRef.current = setInterval(() => setElapsed(s => s + 1), 1000)
    } else {
      clearInterval(elapsedRef.current)
    }
    return () => clearInterval(elapsedRef.current)
  }, [processing])

  function setFileAndReset(f) {
    setFile(f)
    setError(null)
  }

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback(() => setDragActive(false), [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragActive(false)
    const f = e.dataTransfer.files[0]
    if (f) setFileAndReset(f)
  }, [])

  async function startTranscription() {
    if (!file || processing) return
    setProcessing(true)
    setProgress(2)
    setPhase('Datei wird dekodiert…')
    setError(null)

    const recordingId = nanoid()
    setCurrentRecordingId(recordingId)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const audioContext = new AudioContext({ sampleRate: 16000 })
      let audioBuffer
      try {
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      } catch {
        throw new Error('Format nicht unterstützt. Bitte MP3, MP4, WAV, M4A oder OGG verwenden.')
      }

      const audioData = audioBuffer.getChannelData(0)
      const durationSec = audioBuffer.duration

      const pendingRecording = {
        id: recordingId,
        title: file.name.replace(/\.[^.]+$/, ''),
        createdAt: new Date().toISOString(),
        durationSec,
        language: options.language,
        speakers: defaultSpeakers(),
        segments: [],
        bookmarks: [],
        status: 'processing',
        progress: 0,
        wordCount: 0,
      }

      await onTranscriptionComplete(pendingRecording, file)

      setPhase('Modell wird geladen…')
      setProgress(5)

      const segments = await transcribe({
        audioData,
        modelId: options.modelId,
        language: options.language,
        recordingId,
        speakerCount: options.speakers,
        onProgress: (pct, ph) => {
          setProgress(pct)
          setPhase(ph)
          onProgress(recordingId, pct)
        },
      })

      const wordCount = segments.reduce((n, s) => n + s.text.split(/\s+/).filter(Boolean).length, 0)

      const finalRecording = {
        ...pendingRecording,
        segments,
        status: 'ready',
        progress: 100,
        wordCount,
      }

      await onTranscriptionComplete(finalRecording, null)

    } catch (err) {
      setError(err.message || String(err))
      setProcessing(false)
      setProgress(0)
      setCurrentRecordingId(null)
      onProgress(recordingId, 0)
    }
  }

  function handleCancel() {
    if (currentRecordingId) cancel(currentRecordingId)
    setProcessing(false)
    setProgress(0)
    setPhase('')
    setCurrentRecordingId(null)
  }

  const dropzoneStyle = {
    width: '100%', maxWidth: 640,
    background: dragActive ? '#FDF1EB' : 'var(--vx-paper)',
    border: `2px dashed ${dragActive ? 'var(--vx-orange)' : '#D9D6CE'}`,
    borderRadius: 10,
    padding: '56px 40px',
    textAlign: 'center',
    cursor: processing ? 'default' : 'pointer',
    transition: 'border-color 0.15s, background 0.15s',
    position: 'relative',
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top bar */}
      <div style={{
        padding: '0 32px', height: 62,
        borderBottom: '1px solid var(--vx-line)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--vx-paper)',
      }}>
        <div style={{ fontSize: 13, color: 'var(--vx-muted)' }}>Neue Transkription</div>
        <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--vx-muted)', alignItems: 'center' }}>
          <kbd style={{
            background: '#fff', border: '1px solid var(--vx-line)',
            borderRadius: 3, padding: '2px 6px',
            fontFamily: 'var(--font-mono)', fontSize: 11,
          }}>⌘N</kbd>
          <span>für neue Aufnahme</span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 48px', overflowY: 'auto' }}>

        {/* Mode tabs */}
        <div style={{
          display: 'flex', background: 'var(--vx-paper)',
          border: '1px solid var(--vx-line)', borderRadius: 8,
          padding: 4, marginBottom: 32, gap: 2,
        }}>
          {[['Datei', 'file', false], ['URL einfügen', 'url', true], ['Aufnehmen', 'record', true]].map(([label, id, disabled]) => {
            const isActive = mode === id
            return (
              <button
                key={id}
                onClick={() => !disabled && setMode(id)}
                style={{
                  padding: '9px 18px', borderRadius: 5, border: 0,
                  background: isActive ? 'var(--vx-ink)' : 'transparent',
                  color: isActive ? '#fff' : disabled ? '#b8b8b8' : 'var(--vx-ink)',
                  fontSize: 13, fontWeight: isActive ? 500 : 400,
                  cursor: disabled ? 'default' : 'pointer',
                  fontFamily: 'inherit',
                  display: 'flex', alignItems: 'center', gap: 7,
                }}
              >
                {label}
                {disabled && (
                  <span style={{
                    fontSize: 9.5, background: '#EDE9E1', color: '#8a8a8a',
                    padding: '1px 5px', borderRadius: 3, letterSpacing: '0.04em',
                  }}>BALD</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Drop zone */}
        <div
          style={dropzoneStyle}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !processing && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,video/*,.mp3,.mp4,.wav,.m4a,.ogg,.webm,.flac,.aac,.mov,.avi,.mkv"
            style={{ display: 'none' }}
            onChange={e => e.target.files[0] && setFileAndReset(e.target.files[0])}
          />

          {/* Icon */}
          <div style={{
            margin: '0 auto 24px', width: 64, height: 64, borderRadius: 14,
            background: 'var(--vx-ink)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--vx-orange)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1-.3-3.3 1.3a11.4 11.4 0 00-6 0C6.7 2.8 5.7 3.1 5.7 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004.3 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>
            </svg>
          </div>

          {file ? (
            <>
              <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 6, letterSpacing: '-0.01em' }}>{file.name}</div>
              <div style={{ fontSize: 13, color: 'var(--vx-muted)' }}>{(file.size / 1024 / 1024).toFixed(1)} MB</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 22, fontWeight: 500, marginBottom: 8, letterSpacing: '-0.01em' }}>Datei hierher ziehen</div>
              <div style={{ fontSize: 13.5, color: 'var(--vx-muted)', marginBottom: 24 }}>oder per Klick auswählen</div>
              <button
                style={{
                  background: 'var(--vx-orange)', color: '#fff', border: 0,
                  borderRadius: 6, padding: '12px 28px',
                  fontSize: 13.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                }}
                onClick={e => { e.stopPropagation(); fileInputRef.current?.click() }}
              >
                Datei auswählen
              </button>
            </>
          )}

          {/* Format pills */}
          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'center', gap: 24, fontSize: 11.5, color: '#8a8a8a' }}>
            {[['Audio', ['MP3', 'WAV', 'M4A', 'FLAC'], true], ['Video', ['MP4', 'MOV', 'MKV', 'WEBM'], false]].map(([grp, fmts, isAudio]) => (
              <div key={grp} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ color: isAudio ? 'var(--vx-orange)' : 'var(--vx-ink)', fontWeight: 500, marginRight: 2 }}>{grp}</span>
                {fmts.map(f => (
                  <span key={f} style={{
                    padding: '2px 7px', background: 'var(--vx-cream)',
                    borderRadius: 3, fontFamily: 'var(--font-mono)', fontSize: 10.5,
                  }}>{f}</span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Options grid */}
        <div style={{ width: '100%', maxWidth: 640, marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <OptionCard label="Modell" value={MODELS.find(m => m.value === options.modelId)?.label.split('—')[0].trim() ?? options.modelId}>
            <select
              value={options.modelId}
              onChange={e => setOptions(o => ({ ...o, modelId: e.target.value }))}
              style={selectStyle}
            >
              {MODELS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </OptionCard>
          <OptionCard label="Sprache" value={LANGUAGES.find(l => l.value === options.language)?.label ?? options.language}>
            <select
              value={options.language}
              onChange={e => setOptions(o => ({ ...o, language: e.target.value }))}
              style={selectStyle}
            >
              {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
            </select>
          </OptionCard>
          <OptionCard label="Sprecher" value={`${options.speakers} erwartet`}>
            <select
              value={options.speakers}
              onChange={e => setOptions(o => ({ ...o, speakers: Number(e.target.value) }))}
              style={selectStyle}
            >
              {[1,2,3,4].map(n => <option key={n} value={n}>{n} Sprecher</option>)}
            </select>
          </OptionCard>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginTop: 16, width: '100%', maxWidth: 640,
            background: '#2a1010', border: '1px solid #5a2020',
            borderRadius: 8, padding: '12px 16px',
            color: '#ff5e5e', fontSize: 13,
          }}>
            {error}
          </div>
        )}

        {/* Progress */}
        {processing && (
          <div style={{ marginTop: 16, width: '100%', maxWidth: 640, background: 'var(--vx-paper)', border: '1px solid var(--vx-line)', borderRadius: 8, padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Spinner />
              <span style={{ fontSize: 13, color: 'var(--vx-ink)' }}>{phase}</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--vx-muted)' }}>
                {progress}% · {Math.floor(elapsed/60)}:{String(elapsed%60).padStart(2,'0')}
              </span>
              <button
                onClick={handleCancel}
                style={{ background: 'transparent', border: '1px solid var(--vx-line)', borderRadius: 5, padding: '3px 10px', fontSize: 11, cursor: 'pointer', color: 'var(--vx-muted)', fontFamily: 'inherit' }}
              >Abbrechen</button>
            </div>
            <div style={{ height: 3, background: 'var(--vx-line)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'var(--vx-orange)', transition: 'width 0.3s ease', borderRadius: 2 }} />
            </div>
          </div>
        )}

        {/* Start button */}
        {file && !processing && (
          <button
            onClick={startTranscription}
            style={{
              marginTop: 16, width: '100%', maxWidth: 640,
              background: 'var(--vx-orange)', color: '#fff', border: 0,
              borderRadius: 10, padding: '14px', fontSize: 14, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.02em',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--vx-orange-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--vx-orange)'}
          >
            Transkription starten
          </button>
        )}
      </div>
    </div>
  )
}

const selectStyle = {
  width: '100%', background: 'var(--vx-cream)',
  color: 'var(--vx-ink)', border: '1px solid var(--vx-line)',
  borderRadius: 4, padding: '5px 8px',
  fontFamily: 'inherit', fontSize: 12, cursor: 'pointer', outline: 'none',
  marginTop: 6,
}

function OptionCard({ label, value, children }) {
  return (
    <div style={{
      background: 'var(--vx-paper)', border: '1px solid var(--vx-line)',
      borderRadius: 6, padding: '10px 14px',
    }}>
      <div style={{ fontSize: 10.5, letterSpacing: '0.1em', color: 'var(--vx-muted-2)', textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
      {children}
    </div>
  )
}

function Spinner() {
  return (
    <div style={{
      width: 14, height: 14, borderRadius: '50%',
      border: '2px solid var(--vx-line)',
      borderTopColor: 'var(--vx-orange)',
      animation: 'spin 0.8s linear infinite',
      flexShrink: 0,
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
