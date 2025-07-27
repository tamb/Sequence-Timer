/**
 * @file A service class that abstracts away the localforage storage library.
 */
import localforage from "localforage";

export class StorageService {
  /**
   * Saves a value to storage.
   * @param key The key to save the value under.
   * @param value The value to save.
   */
  async setItem<T>(key: string, value: T): Promise<T> {
    return localforage.setItem(key, value);
  }

  /**
   * Retrieves a value from storage.
   * @param key The key of the value to retrieve.
   */
  async getItem<T>(key: string): Promise<T | null> {
    return localforage.getItem(key);
  }

  /**
   * Removes a value from storage.
   * @param key The key of the value to remove.
   */
  async removeItem(key: string): Promise<void> {
    return localforage.removeItem(key);
  }

  /**
   * Gets all keys from storage.
   */
  async keys(): Promise<string[]> {
    return localforage.keys();
  }

  /**
   * Clears all data from storage.
   */
  async clear(): Promise<void> {
    return localforage.clear();
  }
}

export const storageService = new StorageService();
