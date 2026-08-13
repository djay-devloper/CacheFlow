import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

export const useUserAuth = () => {

    const{ user, updateUser, clearUser, isInitialized } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Wait for context to initialize
        if (!isInitialized) return;
        
        // If user is already loaded, don't fetch again
        if (user) return;

        // Check if token exists
        const token = localStorage.getItem('token');
        if (!token) {
            navigate("/login");
            return;
        }

        let isMounted = true;
        const fetchUserInfo = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
                if (isMounted && response?.data) {
                    updateUser(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch user info:", error);
                if (isMounted) {
                    clearUser();
                    navigate("/login");
                }
            }
        };

        fetchUserInfo();

        return () => {
            isMounted = false;
        };
    }, [isInitialized, user, updateUser, clearUser, navigate]);
};