import type { FirmData } from '../types';

const API_BASE_URL = 'http://localhost:3001/api'; // Ensure this is the correct backend URL

export const getAllFirms = async (): Promise<FirmData[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/firms`);
        if (!response.ok) {
            // You might want to parse the error response from the server if available
            const errorData = await response.text(); // or response.json() if backend sends structured errors
            console.error('API Error Response:', errorData);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData || response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Network or other error in getAllFirms:', error);
        // Re-throw or handle as appropriate for your error strategy
        throw error; // Re-throwing allows the hook to catch it
    }
};
