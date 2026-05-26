// CDN import avoids all Vite/ONNX bundling conflicts — same as original prototype
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2/dist/transformers.min.js'

env.allowLocalModels = false
env.useBrowserCache = true

let pipe = null
let currentModel = null

self.onmessage = async (event) => {
  const { type, payload } = event.data

  if (type === 'TRANSCRIBE') {
    const { audioData, modelId, language, recordingId } = payload
    try {
      if (!pipe || currentModel !== modelId) {
        pipe = null
        pipe = await pipeline('automatic-speech-recognition', modelId, {
          progress_callback: (p) => {
            if (p.status === 'downloading') {
              self.postMessage({
                type: 'MODEL_PROGRESS',
                payload: {
                  recordingId,
                  pct: p.total ? Math.round((p.loaded / p.total) * 100) : 0,
                },
              })
            }
            if (p.status === 'ready') {
              self.postMessage({ type: 'MODEL_READY', payload: { recordingId } })
            }
          },
        })
        currentModel = modelId
      }

      self.postMessage({ type: 'TRANSCRIBE_START', payload: { recordingId } })

      const options = {
        return_timestamps: true,
        chunk_length_s: 20,
        stride_length_s: 3,
      }

      if (language && language !== 'auto') {
        options.language = language
        options.task = 'transcribe'
      }

      // chunk_length_s=20, stride=3 → effective step per chunk = 17s
      const totalSec = audioData.length / 16000
      const stepSec = 17
      const totalChunks = Math.max(1, Math.ceil(totalSec / stepSec))
      let chunksProcessed = 0
      let lastTokenChunk = -1

      // callback_function fires per TOKEN — use it only to detect chunk boundaries
      // A new chunk starts when token timestamp resets near 0
      options.callback_function = (beams) => {
        const token = beams?.[0]?.output_token_ids?.length ?? 0
        // Detect chunk boundary: token count resets (new chunk started)
        if (token < lastTokenChunk && chunksProcessed < totalChunks) {
          chunksProcessed++
          const pct = Math.round((chunksProcessed / totalChunks) * 90)
          self.postMessage({ type: 'TRANSCRIBE_PROGRESS', payload: { recordingId, pct } })
        }
        lastTokenChunk = token
      }

      const result = await pipe(audioData, options)

      self.postMessage({ type: 'TRANSCRIBE_DONE', payload: { recordingId, result } })
    } catch (err) {
      self.postMessage({
        type: 'TRANSCRIBE_ERROR',
        payload: { recordingId, error: err.message || String(err) },
      })
    }
  }
}

