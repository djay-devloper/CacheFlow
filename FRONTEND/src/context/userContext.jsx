import React, { createContext, useState, useEffect } from 'react';
import { BASE_URL } from '../utils/apiPaths';

export const UserContext = createContext();

const normalizeProfileImageUrl = (profileImageUrl) => {
    if (!profileImageUrl) return profileImageUrl;
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//i.test(profileImageUrl)) {
        return profileImageUrl.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i, BASE_URL.replace(/\/$/, ''));
    }
    return profileImageUrl;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize user from localStorage on mount
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                const normalizedUser = parsedUser?.profileImageUrl
                    ? { ...parsedUser, profileImageUrl: normalizeProfileImageUrl(parsedUser.profileImageUrl) }
                    : parsedUser;
                setUser(normalizedUser);
            }
        } catch (error) {
            console.error('Failed to parse stored user data:', error);
            localStorage.removeItem('user');
        }
        setIsInitialized(true);
    }, []);

    // Function to update user information
    const updateUser = (userData) => {
        const normalizedUser = userData?.profileImageUrl
            ? { ...userData, profileImageUrl: normalizeProfileImageUrl(userData.profileImageUrl) }
            : userData;

        setUser(normalizedUser);
        // Persist user data to localStorage
        try {
            localStorage.setItem('user', JSON.stringify(normalizedUser));
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
