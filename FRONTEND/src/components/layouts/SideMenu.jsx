import React, { useContext, useState } from 'react';
import { createPortal } from 'react-dom';
import { SideMenuData } from '../../utils/data';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { LuPencil, LuUpload, LuX } from 'react-icons/lu';

const SideMenu = ({ activeMenu, onMenuClick, className = '' }) => {
  const { user, clearUser, updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileData, setProfileData] = useState({ fullName: '', email: '', phone: '' });
  const [profileImage, setProfileImage] = useState(null);

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

  const openProfileEditor = () => {
    setProfileData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setProfileImage(null);
    setProfileError('');
    setIsProfileEditorOpen(true);
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setProfileError('');

    if (profileImage && profileImage.size > 5 * 1024 * 1024) {
      setProfileError('Choose a profile photo that is 5 MB or smaller.');
      return;
    }

    setIsSavingProfile(true);
    try {
      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, profileData);
      let updatedUser = response.data.user;
      updateUser(updatedUser);

      if (profileImage) {
        const formData = new FormData();
        formData.append('image', profileImage);
        try {
          const imageResponse = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 60000,
          });
          updatedUser = imageResponse.data.user || {
            ...updatedUser,
            profileImageUrl: imageResponse.data.imageUrl,
          };
          updateUser(updatedUser);
        } catch (imageError) {
          console.error('Profile details were saved but profile photo upload failed:', imageError);
          const message = imageError.response?.data?.message
            || (imageError.code === 'ECONNABORTED'
              ? 'The profile photo upload timed out. Try a smaller image or try again.'
              : 'The profile photo could not be uploaded. Check your connection and try again.');
          setProfileError(`Your details were saved, but ${message.charAt(0).toLowerCase()}${message.slice(1)}`);
          return;
        }
      }

      setIsProfileEditorOpen(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setProfileError(error.response?.data?.message || 'Could not save your profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const profileImageSrc = user?.profileImageUrl || '/default-avatar.svg';

  return (
    <div className={`flex h-full w-64 flex-col border-r border-slate-200/70 bg-white p-4 ${className}`}>
      <div className="mb-7 px-1 pt-1">
        <button
          type="button"
          onClick={openProfileEditor}
          className="group flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-left transition hover:border-violet-200 hover:bg-violet-50/60 focus-visible:outline-violet-500"
          aria-label="Edit profile and account settings"
        >
          <img
            src={profileImageSrc}
            alt=""
            className="h-10 w-10 shrink-0 rounded-full bg-white object-cover ring-2 ring-white"
          />
          <span className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">Personal account</p>
            <span className="block truncate text-sm font-semibold leading-5 text-slate-900">{user?.fullName || 'Your account'}</span>
            <span className="block truncate text-xs text-slate-500">{user?.email || 'Add an email address'}</span>
          </span>
          <LuPencil className="shrink-0 text-sm text-slate-400 transition group-hover:text-violet-600" aria-hidden="true" />
        </button>
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

      {isProfileEditorOpen && createPortal(
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isSavingProfile) setIsProfileEditorOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-editor-title"
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <p className="page-eyebrow">Account settings</p>
                <h2 id="profile-editor-title" className="text-xl font-semibold tracking-tight text-slate-950">Edit your profile</h2>
                <p className="mt-1 text-sm text-slate-500">Update your contact details and profile photo.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileEditorOpen(false)}
                disabled={isSavingProfile}
                aria-label="Close profile settings"
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <LuX />
              </button>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4 p-6">
              <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                <img
                  src={profileImageSrc}
                  alt=""
                  className="h-14 w-14 rounded-full bg-white object-cover ring-2 ring-white"
                />
                <label className="min-w-0 flex-1 text-sm font-medium text-slate-700">
                  Profile photo
                  <span className="mt-1 block text-xs font-normal text-slate-500">JPEG or PNG, up to 5 MB.</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={(event) => setProfileImage(event.target.files?.[0] || null)}
                    className="mt-2 block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-100 file:px-3 file:py-2 file:font-semibold file:text-violet-700 hover:file:bg-violet-200"
                  />
                </label>
                <LuUpload className="hidden shrink-0 text-violet-600 sm:block" aria-hidden="true" />
              </div>

              <label className="block text-sm font-medium text-slate-700">
                Full name
                <input
                  required
                  maxLength="100"
                  autoComplete="name"
                  value={profileData.fullName}
                  onChange={(event) => setProfileData((current) => ({ ...current, fullName: event.target.value }))}
                  className="field-control"
                />
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Email address
                <input
                  required
                  type="email"
                  maxLength="254"
                  autoComplete="email"
                  value={profileData.email}
                  onChange={(event) => setProfileData((current) => ({ ...current, email: event.target.value }))}
                  className="field-control"
                />
                <span className="mt-1 block text-xs font-normal text-slate-500">Used for account communication and sign-in.</span>
              </label>

              <label className="block text-sm font-medium text-slate-700">
                Phone number <span className="font-normal text-slate-400">(optional)</span>
                <input
                  type="tel"
                  maxLength="25"
                  autoComplete="tel"
                  value={profileData.phone}
                  onChange={(event) => setProfileData((current) => ({ ...current, phone: event.target.value }))}
                  placeholder="+1 555 123 4567"
                  className="field-control"
                />
              </label>

              {profileError && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{profileError}</p>}

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsProfileEditorOpen(false)}
                  disabled={isSavingProfile}
                  className="card-btn justify-center"
                >
                  Cancel
                </button>
                <button type="submit" disabled={isSavingProfile} className="button-primary">
                  {isSavingProfile ? 'Saving profile…' : 'Save changes'}
                </button>
              </div>
            </form>
          </section>
        </div>,
        document.body
      )}
    </div>
  );
};

export default SideMenu;
