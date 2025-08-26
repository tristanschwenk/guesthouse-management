import { ref } from 'vue';

export const useStorage = () => {
  // Check if we're in a browser environment
  const isClient = typeof window !== 'undefined';

  /**
   * Get data from localStorage
   * @param key The key to retrieve data from
   * @param defaultValue Default value if key doesn't exist
   * @returns The stored value or default value
   */
  const getItem = <T>(key: string, defaultValue: T): T => {
    if (!isClient) return defaultValue;
    
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error getting item ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  /**
   * Set data in localStorage
   * @param key The key to store data under
   * @param value The value to store
   */
  const setItem = <T>(key: string, value: T): void => {
    if (!isClient) return;
    
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting item ${key} in localStorage:`, error);
    }
  };

  /**
   * Remove data from localStorage
   * @param key The key to remove
   */
  const removeItem = (key: string): void => {
    if (!isClient) return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing item ${key} from localStorage:`, error);
    }
  };

  /**
   * Clear all data from localStorage
   */
  const clear = (): void => {
    if (!isClient) return;
    
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  /**
   * Get all keys from localStorage
   * @returns Array of keys
   */
  const getKeys = (): string[] => {
    if (!isClient) return [];
    
    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting keys from localStorage:', error);
      return [];
    }
  };

  return {
    getItem,
    setItem,
    removeItem,
    clear,
    getKeys
  };
};

