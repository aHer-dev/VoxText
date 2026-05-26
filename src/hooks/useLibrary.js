import { useState, useEffect, useCallback } from 'react'
import {
  getAllRecordings,
  putRecording,
  patchRecording,
  deleteRecordingFromDB,
  putAudio,
} from '../lib/db.js'

export function useLibrary() {
  const [recordings, setRecordings] = useState([])

  useEffect(() => {
    getAllRecordings().then(setRecordings)
  }, [])

  const saveRecording = useCallback(async (recording, audioBlob) => {
    await putRecording(recording)
    if (audioBlob) await putAudio(recording.id, audioBlob)
    setRecordings(prev => {
      const without = prev.filter(r => r.id !== recording.id)
      return [recording, ...without]
    })
  }, [])

  const updateRecording = useCallback(async (id, partial) => {
    const updated = await patchRecording(id, partial)
    setRecordings(prev => prev.map(r => r.id === id ? updated : r))
    return updated
  }, [])

  const deleteRecording = useCallback(async (id) => {
    await deleteRecordingFromDB(id)
    setRecordings(prev => prev.filter(r => r.id !== id))
  }, [])

  return { recordings, saveRecording, updateRecording, deleteRecording }
}
