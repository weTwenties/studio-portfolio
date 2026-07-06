"use client";

type CachedProjectImage = {
  projectId: string;
  id: string;
  name: string;
  type: string;
  dataUrl: string;
  isPrimary?: boolean;
  createdAt: number;
  expiresAt: number;
};

const DB_NAME = "studio-portfolio-cms-project-images";
const STORE_NAME = "images";
const TTL_MS = 24 * 60 * 60 * 1000;

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function readAll(): Promise<CachedProjectImage[]> {
  const db = await openDb();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as CachedProjectImage[]);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

async function writeItem(item: CachedProjectImage) {
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).put(item);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

async function deleteItem(id: string) {
  const db = await openDb();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

async function clearProject(projectId: string) {
  const items = await readAll();
  await Promise.all(items.filter((item) => item.projectId === projectId).map((item) => deleteItem(item.id)));
}

export async function saveProjectImagesToCache(projectId: string, files: File[], coverIndex = 0) {
  const now = Date.now();
  await clearProject(projectId);
  await Promise.all(files.map(async (file, index) => {
    const dataUrl = await fileToDataUrl(file);
    const item: CachedProjectImage = {
      projectId,
      id: `${projectId}:${file.name}:${file.size}:${now}:${index}`,
      name: file.name,
      type: file.type,
      dataUrl,
      isPrimary: index === coverIndex,
      createdAt: now,
      expiresAt: now + TTL_MS,
    };
    await writeItem(item);
  }));
}

export async function getProjectImagesFromCache(projectId: string) {
  const now = Date.now();
  const items = (await readAll())
    .filter((item) => item.projectId === projectId && item.expiresAt > now)
    .sort((a, b) => a.createdAt - b.createdAt);
  return items;
}

export async function clearExpiredProjectImages() {
  const now = Date.now();
  const items = await readAll();
  await Promise.all(items.filter((item) => item.expiresAt <= now).map((item) => deleteItem(item.id)));
}

export function dataUrlToFile(dataUrl: string, name: string) {
  const [meta, base64] = dataUrl.split(",");
  const mime = meta.match(/data:(.*?);base64/)?.[1] ?? "application/octet-stream";
  const binary = atob(base64 ?? "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], name, { type: mime });
}

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
