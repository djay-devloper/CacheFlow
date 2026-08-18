import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import Navbar from './Navbar';
import SideMenu from './SideMenu';

const DashboardLayout = ({ activeMenu, children }) => {
    const { user, updateUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!user) {
                try {
                    const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO);
                    updateUser(response.data);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            }
        };

        fetchUserData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-[#fcfbfc]">
            <Navbar
                activeMenu={activeMenu}
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
                onCloseSidebar={closeSidebar}
            />

            <div className="flex min-h-[calc(100vh-61px)] w-full">
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                        onClick={closeSidebar}
                    />
                )}

                <aside
                    className={`
                        fixed left-0 top-[61px] z-40 h-[calc(100vh-61px)] w-64 transition-transform duration-300 ease-in-out
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    `}
                >
                    <SideMenu
                        activeMenu={activeMenu}
                        onMenuClick={closeSidebar}
                    />
                </aside>

                <main className="flex-1 px-3 py-4 sm:px-5 lg:px-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
