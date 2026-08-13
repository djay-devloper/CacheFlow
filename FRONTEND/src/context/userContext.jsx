import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize user from localStorage on mount
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Failed to parse stored user data:', error);
            localStorage.removeItem('user');
        }
        setIsInitialized(true);
    }, []);

    // Function to update user information
    const updateUser = (userData) => {
        setUser(userData);
        // Persist user data to localStorage
        try {
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('Failed to save user data to localStorage:', error);
        }
    };

    // Function to clear user information (e.g., on logout)
    const clearUser = () => {
        setUser(null);
        // Remove user data from localStorage
        try {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        } catch (error) {
            console.error('Failed to clear localStorage:', error);
        }
    };

    return (
        <UserContext.Provider value={{ user, updateUser, clearUser, isInitialized }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;
