import { openDB } from 'idb'

const DB_NAME = 'voxtext-studio'
const DB_VERSION = 1

let dbPromise = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore('recordings', { keyPath: 'id' })
        store.createIndex('by-created', 'createdAt')
        db.createObjectStore('audio', { keyPath: 'id' })
      },
    })
  }
  return dbPromise
}

export async function getAllRecordings() {
  const db = await getDB()
  const all = await db.getAllFromIndex('recordings', 'by-created')
  return all.reverse()
}

export async function getRecording(id) {
  const db = await getDB()
  return db.get('recordings', id)
}

export async function putRecording(recording) {
  const db = await getDB()
  await db.put('recordings', recording)
  return recording
}

export async function patchRecording(id, partial) {
  const db = await getDB()
  const tx = db.transaction('recordings', 'readwrite')
  const existing = await tx.store.get(id)
  if (!existing) throw new Error(`Recording ${id} not found`)
  const updated = { ...existing, ...partial }
  await tx.store.put(updated)
  await tx.done
  return updated
}

export async function deleteRecordingFromDB(id) {
  const db = await getDB()
  const tx = db.transaction(['recordings', 'audio'], 'readwrite')
  await tx.objectStore('recordings').delete(id)
  await tx.objectStore('audio').delete(id)
  await tx.done
}

export async function putAudio(id, blob) {
  const db = await getDB()
  await db.put('audio', { id, blob })
}

export async function getAudio(id) {
  const db = await getDB()
  const entry = await db.get('audio', id)
  return entry?.blob ?? null
}
