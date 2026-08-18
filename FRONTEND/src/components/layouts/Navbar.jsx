import React from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';

const Navbar = ({ activeMenu, isSidebarOpen, onToggleSidebar, onCloseSidebar }) => {
  return (
    <div className="sticky top-0 z-50 flex items-center gap-5 border-b border-gray-200/50 bg-white px-4 py-4 sm:px-7">
      <button
        className="mobile-menu-container flex h-10 w-10 items-center justify-center rounded-lg text-black transition hover:bg-gray-100"
        onClick={() => {
          if (isSidebarOpen) {
            onCloseSidebar();
            return;
          }
          onToggleSidebar();
        }}
        aria-label="Toggle menu"
      >
        {isSidebarOpen ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      <h2 className="text-lg font-medium text-black">CacheFlow</h2>
    </div>
  );
};

export default Navbar;