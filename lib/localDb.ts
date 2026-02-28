import { get, set, del, keys } from 'idb-keyval';
import { AppData } from '../types';

/**
 * Saves a file to IndexedDB and returns a temporary object URL.
 * Note: Object URLs are session-specific, so we need to re-generate them on load.
 * However, for simplicity in this app, we will store the Base64 string in IDB
 * and return a Base64 data URL. This is less efficient but easier to integrate
 * with the existing string-based URL system.
 */
export const saveFileLocally = async (file: File): Promise<string> => {
  try {
    // Convert to Base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Generate a unique ID
    const id = `local-img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Save to IndexedDB (which can handle much larger data than localStorage)
    await set(id, base64);
    
    // Return a special protocol URL that our app can recognize, OR just return the Base64
    // Returning Base64 directly is the most compatible "offline" mode for now,
    // as it works with <img> tags immediately.
    // The only downside is the initial load size, but IDB is fast.
    return base64; 
  } catch (error) {
    console.error("Failed to save file locally:", error);
    throw new Error("Local storage failed. File might be too large even for IndexedDB.");
  }
};

/**
 * Retrieves all locally stored images (if we needed to list them).
 */
export const getLocalImages = async () => {
  const allKeys = await keys();
  const images: Record<string, string> = {};
  for (const key of allKeys) {
    if (typeof key === 'string' && key.startsWith('local-img-')) {
      const val = await get(key);
      if (val) images[key] = val;
    }
  }
  return images;
};

/**
 * Saves the entire application data (Projects, Services, Skills, Messages) to IndexedDB.
 * This acts as the primary "built-in database" when Supabase is offline.
 */
export const saveAppDataLocally = async (data: AppData): Promise<void> => {
  try {
    await set('portfolio_data', data);
    console.log("Data saved to local built-in database (IndexedDB).");
  } catch (error) {
    console.error("Failed to save app data locally:", error);
    throw new Error("Failed to save data to local database.");
  }
};

/**
 * Retrieves the application data from IndexedDB.
 */
export const getAppDataLocally = async (): Promise<AppData | undefined> => {
  try {
    const data = await get<AppData>('portfolio_data');
    return data;
  } catch (error) {
    console.error("Failed to load app data locally:", error);
    return undefined;
  }
};
