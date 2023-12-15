import { useEffect, useState } from "react";

// We don't want to exhaust our database with queries for every single keystroke that the user write in the search input, we wanna delay it OR we wanna debounce it 
// When the user stopped typing for at least half a second, we're going to consider that as if user finished what they want

export function useDebounce<T>(value: T, delay?: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay || 500);

        return () => {
            clearTimeout(timer);
        }
    }, [value, delay]);

    return debouncedValue;
};