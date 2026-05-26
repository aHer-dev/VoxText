import { useRef, useCallback, useEffect } from 'react'
import { assignSpeakers } from '../lib/segmentUtils.js'

// 6× real-time + 3 min buffer, minimum 5 min, maximum 60 min
function calcTimeout(audioData) {
  const durationSec = audioData.length / 16000
  return Math.min(60 * 60 * 1000, Math.max(5 * 60 * 1000, durationSec * 6 * 1000 + 3 * 60 * 1000))
}

export function useTranscriber() {
  const workerRef = useRef(null)
  const pendingRef = useRef({})

  function spawnWorker() {
    const worker = new Worker(
      new URL('../workers/transcriber.worker.js', import.meta.url),
      { type: 'module' }
    )
    worker.onmessage = (e) => {
      const { type, payload } = e.data
      const handler = pendingRef.current[payload?.recordingId]
      if (handler) handler(type, payload)
    }
    worker.onerror = (e) => {
      // Worker crashed — reject all pending
      Object.values(pendingRef.current).forEach(h =>
        h('TRANSCRIBE_ERROR', { error: e.message || 'Worker-Absturz' })
      )
      pendingRef.current = {}
      // Respawn for next use
      workerRef.current = spawnWorker()
    }
    return worker
  }

  useEffect(() => {
    workerRef.current = spawnWorker()
    return () => workerRef.current?.terminate()
  }, [])

  const cancel = useCallback((recordingId) => {
    delete pendingRef.current[recordingId]
    // Restart worker to abort in-flight computation
    workerRef.current?.terminate()
    workerRef.current = spawnWorker()
  }, [])

  const transcribe = useCallback(({
    audioData,
    modelId,
    language,
    recordingId,
    speakerCount,
    onProgress,
  }) => {
    return new Promise((resolve, reject) => {
      let timeoutId = null
      const timeoutMs = calcTimeout(audioData)

      pendingRef.current[recordingId] = (type, payload) => {
        switch (type) {
          case 'MODEL_PROGRESS':
            onProgress?.(Math.round(payload.pct * 0.4), 'Modell wird geladen…')
            break
          case 'MODEL_READY':
            onProgress?.(40, 'Modell bereit…')
            break
          case 'TRANSCRIBE_START':
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
              delete pendingRef.current[recordingId]
              workerRef.current?.terminate()
              workerRef.current = spawnWorker()
              const mins = Math.round(timeoutMs / 60000)
              reject(new Error(`Timeout nach ${mins} Min. Bitte kleineres Modell (Base/Tiny) verwenden.`))
            }, timeoutMs)
            onProgress?.(45, 'Transkription läuft…')
            break
          case 'TRANSCRIBE_PROGRESS':
            onProgress?.(45 + Math.round(payload.pct * 0.5), 'Transkription läuft…')
            break
          case 'TRANSCRIBE_DONE': {
            clearTimeout(timeoutId)
            const segments = buildSegments(payload.result.chunks ?? [], speakerCount)
            delete pendingRef.current[recordingId]
            onProgress?.(100, 'Fertig')
            resolve(segments)
            break
          }
          case 'TRANSCRIBE_ERROR':
            clearTimeout(timeoutId)
            delete pendingRef.current[recordingId]
            reject(new Error(payload.error))
            break
        }
      }

      workerRef.current.postMessage(
        { type: 'TRANSCRIBE', payload: { audioData, modelId, language, recordingId } },
        [audioData.buffer]
      )
    })
  }, [])

  return { transcribe, cancel }
}

function buildSegments(chunks, speakerCount) {
  const raw = chunks.map((c, i) => ({
    id: `seg-${i}`,
    speakerId: 'spk-0',
    startSec: c.timestamp[0] ?? 0,
    endSec: c.timestamp[1] ?? (c.timestamp[0] ?? 0) + 2,
    text: c.text.trim(),
  }))
  return speakerCount >= 2 ? assignSpeakers(raw) : raw
}
