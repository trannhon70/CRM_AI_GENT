import { useState, useCallback } from 'react';

type SetValue<T> = T | ((prev: T) => T);

export function useLocalStorage<T>(key: string, initialValue: T) {
    // GET
    const readValue = (): T => {
        if (typeof window === 'undefined') return initialValue;

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error('Error reading localStorage key:', key, error);
            return initialValue;
        }
    };

    const [value, setValue] = useState<T>(readValue);

    // SET / UPDATE
    const setStorageValue = useCallback((newValue: SetValue<T>) => {
        try {
            const valueToStore =
                newValue instanceof Function ? newValue(value) : newValue;

            setValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error('Error setting localStorage key:', key, error);
        }
    }, [key, value]);

    // REMOVE
    const removeValue = useCallback(() => {
        try {
            window.localStorage.removeItem(key);
            setValue(initialValue);
        } catch (error) {
            console.error('Error removing localStorage key:', key, error);
        }
    }, [key, initialValue]);

    return {
        value,
        set: setStorageValue,
        remove: removeValue,
        refresh: () => setValue(readValue()), // optional re-sync
    };
}