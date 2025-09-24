// src/utils/helpers.ts

// merge admin-updated formStructure into existing one
export function mergeFormStructures(oldStruct: any, newStruct: any) {
  return { ...oldStruct, ...newStruct };
}

// persist to localStorage
export function saveToLocalStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromLocalStorage<T>(key: string, defaultVal: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return defaultVal;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return defaultVal;
  }
}
