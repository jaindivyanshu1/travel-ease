import { openDB } from 'idb';

const DB_NAME = 'travel-ease-db';
const STORE_NAME = 'journey-logs';

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'timestamp' });
      }
    },
  });
}

export async function saveLogToDB(entry) {
  const db = await initDB();
  const existing = await db.get(STORE_NAME, entry.timestamp);
  if (!existing) {
    await db.put(STORE_NAME, entry);
  }
}

export async function getUnsyncedLogs() {
  const db = await initDB();
  const all = await db.getAll(STORE_NAME);
  return all;
}

export async function clearDB() {
  const db = await initDB();
  await db.clear(STORE_NAME);
}

export async function deleteLogsByTimestamps(timestamps = []) {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  for (const ts of timestamps) {
    await tx.store.delete(ts);
  }
  await tx.done;
}
