import { useState, useEffect } from 'react';
import type { FirmData } from '../types';
import { getAllFirms } from '../services/firmApi';

export interface UseFetchFirmsReturn {
    firms: FirmData[];
    isLoading: boolean;
    error: string | null; // Changed to string for simpler error message display
}

export const useFetchFirms = (): UseFetchFirmsReturn => {
    const [firms, setFirms] = useState<FirmData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadFirms = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getAllFirms();
                setFirms(data);
            } catch (err) {
                // Set a user-friendly error message string
                const errorMessage = (err instanceof Error) ? err.message : 'An unknown error occurred while fetching firms.';
                setError(errorMessage);
                console.error("Error in useFetchFirms hook:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadFirms();
    }, []); // Empty dependency array means it runs once on mount

    return { firms, isLoading, error };
};
