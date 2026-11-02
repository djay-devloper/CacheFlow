import React from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { LuCircleDollarSign } from 'react-icons/lu';
import { UserContext } from '../../context/userContext';

const Navbar = ({ activeMenu, isSidebarOpen, onToggleSidebar, onCloseSidebar }) => {
  const { user } = React.useContext(UserContext);

  return (
    <header className="sticky top-0 z-50 flex h-[68px] items-center justify-between border-b border-slate-200/70 bg-white/90 px-4 backdrop-blur-xl sm:px-7 lg:px-8">
      <div className="flex items-center gap-3">
      <button
        className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 lg:hidden"
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

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm shadow-violet-600/20 lg:hidden">
          <LuCircleDollarSign className="text-xl" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{activeMenu || 'Dashboard'}</p>
          <p className="hidden text-xs text-slate-500 sm:block">Your personal finance workspace</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-800">{user?.fullName || 'Your account'}</p>
          <p className="text-xs text-slate-500">Personal workspace</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-sm font-semibold text-violet-700 ring-2 ring-violet-100">
          {user?.profileImageUrl ? (
            <img src={user.profileImageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            (user?.fullName || 'C').trim().charAt(0).toUpperCase()
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;