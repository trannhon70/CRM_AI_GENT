import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 500) {
    const [searchDebounce, setSearchDebounce] = useState(value);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Nếu value chưa thay đổi thì không loading
        if (value === searchDebounce) return;

        setLoading(true);

        const timer = setTimeout(() => {
            setSearchDebounce(value);
            setLoading(false);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay, searchDebounce]);

    return {
        searchDebounce,
        loading,
    };
}