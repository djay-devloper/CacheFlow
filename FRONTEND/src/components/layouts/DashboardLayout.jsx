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
        <div className="min-h-screen w-full overflow-x-hidden bg-[#f7f8fc]">
            <Navbar
                activeMenu={activeMenu}
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
                onCloseSidebar={closeSidebar}
            />

            <div className="flex min-h-[calc(100vh-68px)] w-full">
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-[2px] lg:hidden"
                        onClick={closeSidebar}
                    />
                )}

                <aside
                    className={`
                        fixed left-0 top-[68px] z-40 h-[calc(100vh-68px)] w-64 transition-transform duration-300 ease-in-out
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
                    `}
                >
                    <SideMenu
                        activeMenu={activeMenu}
                        onMenuClick={closeSidebar}
                    />
                </aside>

                <main className="min-w-0 flex-1 px-4 py-5 sm:px-7 lg:ml-64 lg:px-9 lg:py-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
