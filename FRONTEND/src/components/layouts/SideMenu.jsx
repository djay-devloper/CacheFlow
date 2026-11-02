import React, { useContext, useRef, useState } from 'react';
import { SideMenuData } from '../../utils/data';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuCircleDollarSign, LuUpload } from 'react-icons/lu';

const SideMenu = ({ activeMenu, onMenuClick, className = '' }) => {
  const { user, clearUser, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleClick = (route) => {
    if (route === "/logout") {
      handleLogout();
      return;
    }
    navigate(route);
    if (onMenuClick) {
      onMenuClick();
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  const handleProfileImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setIsUploading(true);
      const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedImageUrl = response?.data?.imageUrl;
      if (uploadedImageUrl) {
        updateUser({ ...user, profileImageUrl: uploadedImageUrl });
      }
    } catch (error) {
      console.error('Failed to upload profile image:', error);
      alert('Profile image upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const profileImageSrc = user?.profileImageUrl || '/default-avatar.svg';

  return (
    <div className={`flex h-full w-64 flex-col border-r border-slate-200/70 bg-white p-4 ${className}`}>
      <div className="mb-7 flex items-center gap-3 px-2 pt-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-md shadow-violet-600/20">
          <LuCircleDollarSign className="text-2xl" />
        </div>
        <div className="relative">
          <img
            src={profileImageSrc}
            alt="Profile Image"
            className="h-10 w-10 rounded-full bg-slate-100 object-cover ring-2 ring-slate-100"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-white bg-violet-600 text-white shadow-sm transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
            aria-label="Upload profile picture"
            disabled={isUploading}
          >
            {isUploading ? <span className="text-[9px] font-bold">...</span> : <LuUpload className="text-[10px]" />}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfileImageUpload}
          />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">CacheFlow</p>
          <h5 className="truncate text-sm font-semibold leading-5 text-slate-900">{user?.fullName || 'Personal account'}</h5>
        </div>
      </div>

      <div className="flex flex-col">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Workspace</p>
        {SideMenuData.filter((item) => item.path !== '/logout').map((item) => (
          <button
            key={item.id}
            aria-current={activeMenu === item.label ? 'page' : undefined}
            className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors duration-200 ${
              activeMenu === item.label
                ? "bg-violet-50 text-violet-700 ring-1 ring-violet-100"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
            }`}
            onClick={() => handleClick(item.path)}
          >
            {item.icon && <item.icon className={`text-lg ${activeMenu === item.label ? 'text-violet-600' : 'text-slate-400'}`} />}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-auto border-t border-slate-100 pt-4">
        {SideMenuData.filter((item) => item.path === '/logout').map((item) => (
          <button
            key={item.id}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
            onClick={() => handleClick(item.path)}
          >
            {item.icon && <item.icon className="text-lg" />}
            <span>{item.label}</span>
          </button>
        ))}
        <p className="px-3 pt-3 text-[11px] text-slate-400">A clearer view of your money.</p>
      </div>
    </div>
  );
};

export default SideMenu;
