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
    const [isSidebarOpen, setIsSidebarOpen] = useState(
        () => window.matchMedia('(min-width: 1024px)').matches
    );

    useEffect(() => {
        const desktopQuery = window.matchMedia('(min-width: 1024px)');
        const syncSidebarWithViewport = (event) => setIsSidebarOpen(event.matches);

        desktopQuery.addEventListener('change', syncSidebarWithViewport);
        return () => desktopQuery.removeEventListener('change', syncSidebarWithViewport);
    }, []);

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
        <div className="min-h-screen w-full overflow-x-clip bg-[#f7f8fc]">
            <Navbar
                activeMenu={activeMenu}
                isSidebarOpen={isSidebarOpen}
                onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
                onCloseSidebar={closeSidebar}
            />

            <div className="min-h-[calc(100vh-68px)] w-full">
                {isSidebarOpen && (
                    <div
                        className="fixed inset-x-0 bottom-0 top-[68px] z-30 bg-slate-950/35 backdrop-blur-[2px] lg:hidden"
                        onClick={closeSidebar}
                        aria-hidden="true"
                    />
                )}

                <aside
                    id="primary-navigation"
                    aria-label="Primary navigation"
                    aria-hidden={!isSidebarOpen}
                    inert={!isSidebarOpen}
                    className={`fixed left-0 top-[68px] z-40 h-[calc(100vh-68px)] w-64 transition-transform duration-300 ease-in-out ${
                        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <SideMenu
                        activeMenu={activeMenu}
                        onMenuClick={closeSidebar}
                    />
                </aside>

                <main className={`min-w-0 px-4 py-6 transition-[margin] duration-300 sm:px-7 lg:px-9 lg:py-8 ${
                    isSidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
                }`}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
