import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import UploadScreen from './components/UploadScreen.jsx'
import TranscriptScreen from './components/TranscriptScreen.jsx'
import DevErrorOverlay from './components/DevErrorOverlay.jsx'
import { useLibrary } from './hooks/useLibrary.js'

export default function App() {
  const [view, setView] = useState('upload')
  const [activeId, setActiveId] = useState(null)
  const { recordings, saveRecording, updateRecording, deleteRecording } = useLibrary()

  function openRecording(id) {
    setActiveId(id)
    setView('transcript')
  }

  function newTranscription() {
    setActiveId(null)
    setView('upload')
  }

  async function handleTranscriptionComplete(recording, audioBlob) {
    await saveRecording(recording, audioBlob)
    if (recording.status === 'ready') {
      openRecording(recording.id)
    }
  }

  const activeRecording = recordings.find(r => r.id === activeId) ?? null

  return (
    <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden' }}>
      <DevErrorOverlay />
      <Sidebar
        recordings={recordings}
        activeId={activeId}
        onSelect={openRecording}
        onNew={newTranscription}
      />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--vx-cream)' }}>
        {view === 'upload' && (
          <UploadScreen
            onTranscriptionComplete={handleTranscriptionComplete}
            onProgress={(id, pct) => updateRecording(id, { progress: pct })}
          />
        )}
        {view === 'transcript' && activeRecording && (
          <TranscriptScreen
            recording={activeRecording}
            onUpdate={(partial) => updateRecording(activeId, partial)}
          />
        )}
        {view === 'transcript' && !activeRecording && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--vx-muted)', fontSize: 13 }}>
            Keine Transkription ausgewählt
          </div>
        )}
      </main>
    </div>
  )
}
