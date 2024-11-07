import { useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';


export const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

export const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        return decoded.exp < currentTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return true;
    }
};