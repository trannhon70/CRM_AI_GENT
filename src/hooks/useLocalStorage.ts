import { useState, useEffect, useCallback } from "react";

type SetValue<T> = T | ((prev: T) => T);

export function useLocalStorage<T>(key: string, initialValue: T) {
    const readValue = useCallback((): T => {
        if (typeof window === "undefined") return initialValue;

        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    }, [key, initialValue]);

    const [value, setValue] = useState<T>(readValue);

    const setStorage = useCallback(
        (newValue: SetValue<T>) => {
            const valueToStore =
                newValue instanceof Function ? newValue(readValue()) : newValue;

            setValue(valueToStore);
            localStorage.setItem(key, JSON.stringify(valueToStore));

            // Đồng bộ giữa các component
            window.dispatchEvent(
                new CustomEvent("local-storage", {
                    detail: { key },
                })
            );
        },
        [key, readValue]
    );

    const remove = useCallback(() => {
        localStorage.removeItem(key);
        setValue(initialValue);

        window.dispatchEvent(
            new CustomEvent("local-storage", {
                detail: { key },
            })
        );
    }, [key, initialValue]);

    useEffect(() => {
        const handleChange = (event?: Event) => {
            if (
                event instanceof CustomEvent &&
                event.detail?.key !== key
            ) {
                return;
            }

            setValue(readValue());
        };

        // tab khác
        window.addEventListener("storage", handleChange);

        // cùng tab
        window.addEventListener("local-storage", handleChange);

        return () => {
            window.removeEventListener("storage", handleChange);
            window.removeEventListener("local-storage", handleChange);
        };
    }, [key, readValue]);

    return {
        value,
        setStorage,
        remove,
        refresh: () => setValue(readValue()),
    };
}