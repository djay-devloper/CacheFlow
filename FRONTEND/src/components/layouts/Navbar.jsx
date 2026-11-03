import React from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { LuCircleDollarSign } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import { UserContext } from '../../context/userContext';

const Navbar = ({ activeMenu, isSidebarOpen, onToggleSidebar, onCloseSidebar }) => {
  const { user } = React.useContext(UserContext);

  return (
    <header className="sticky top-0 z-50 flex h-[68px] items-center justify-between border-b border-slate-200/70 bg-white/95 px-3 backdrop-blur-xl sm:px-5 lg:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <button
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100"
            onClick={() => {
              if (isSidebarOpen) {
                onCloseSidebar();
                return;
              }
              onToggleSidebar();
            }}
            aria-label="Toggle menu"
            aria-controls="primary-navigation"
            aria-expanded={isSidebarOpen}
          >
            {isSidebarOpen ? (
              <HiOutlineX className="text-2xl" />
            ) : (
              <HiOutlineMenu className="text-2xl" />
            )}
          </button>

          <Link to="/home" className="flex shrink-0 items-center gap-2.5" aria-label="CacheFlow dashboard">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm shadow-violet-600/20">
              <LuCircleDollarSign className="text-xl" />
            </span>
            <span className="hidden text-base font-bold tracking-tight text-slate-950 sm:inline">CacheFlow</span>
          </Link>
          <span className="hidden h-8 w-px bg-slate-200 sm:block" aria-hidden="true" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{activeMenu || 'Dashboard'}</p>
            <p className="hidden text-xs text-slate-500 md:block">Your personal finance workspace</p>
          </div>
        </div>

        <div className="ml-3 flex shrink-0 items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-800">{user?.fullName || 'Your account'}</p>
            <p className="text-xs text-slate-500">Personal workspace</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-sm font-semibold text-violet-700 ring-2 ring-violet-100">
            <img
              src={user?.profileImageUrl || '/default-avatar.svg'}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </div>
    </header>
  );
};

export default Navbar;