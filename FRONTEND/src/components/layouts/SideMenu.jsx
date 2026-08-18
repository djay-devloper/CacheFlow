import React, { useContext, useRef, useState } from 'react';
import { SideMenuData } from '../../utils/data';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuUpload } from 'react-icons/lu';

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
    <div className={`flex h-full w-64 flex-col bg-white border-r border-gray-200/50 p-5 shadow-sm lg:shadow-none ${className}`}>
      <div className="mb-8 flex flex-col items-center justify-center pt-10">
        <div className="relative">
          <img
            src={profileImageSrc}
            alt="Profile Image"
            className="h-24 w-24 rounded-full bg-slate-400 object-cover sm:h-28 sm:w-28"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-white bg-[#875cf5] text-white shadow-md transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
            aria-label="Upload profile picture"
            disabled={isUploading}
          >
            {isUploading ? <span className="text-xs font-bold">...</span> : <LuUpload className="text-sm" />}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfileImageUpload}
          />
        </div>
        <h5 className="mt-2 text-center text-gray-950 font-medium leading-6">
          {user?.fullName || ""}
        </h5>
      </div>

      <div className="flex flex-col">
        {SideMenuData && SideMenuData.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`mb-2 flex w-full items-center gap-4 rounded-lg px-6 py-3 text-[15px] transition-colors duration-200 ${
              activeMenu === item.label ? "bg-[#875cf5] text-white" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => handleClick(item.path)}
          >
            {item.icon && <item.icon className="text-xl" />}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
