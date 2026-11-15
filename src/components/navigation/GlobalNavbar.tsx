import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { WheelchairIcon } from '../common/AccessibilityIcon';
import { 
  Bell, 
  User, 
  Bookmark, 
  FileText, 
  MessageSquare, 
  Shield, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  CheckCircle2,
  Plus
} from 'lucide-react';

export const GlobalNavbar: React.FC = () => {
  const { 
    currentRoute, 
    navigateTo, 
    unreadNotificationCount, 
    userProfile, 
    notifications,
    markNotificationAsRead,
    authRole,
    signOut,
  } = useApp();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const citizenLinks = [
    { label: 'Explore', path: '/explore' },
    { label: 'Community', path: '/community' },
    { label: 'About', path: '/about' },
  ];
  const navLinks = authRole === 'admin'
    ? [
      { label: 'Overview', path: '/admin' },
      { label: 'Reviews', path: '/admin/reviews' },
      { label: 'Contributors', path: '/admin/contributors' },
      { label: 'Places', path: '/admin/places' },
      { label: 'Posts', path: '/admin/community' },
      { label: 'Reports', path: '/admin/reports' },
    ]
    : authRole === 'citizen'
      ? citizenLinks
      : [{ label: 'Explore', path: '/explore' }, { label: 'About', path: '/about' }];

  const isLinkActive = (path: string) => {
    if (path.startsWith('/admin/')) return currentRoute === path;
    if (path === '/explore') {
      return currentRoute === '/' || currentRoute === '/explore' || currentRoute.startsWith('/venues/') || currentRoute === '/map';
    }
    return currentRoute === path;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F6F0]/95 backdrop-blur-md border-b border-[#E5E5DC] transition-all">
      <div className={`max-w-7xl mx-auto ${authRole === 'admin' ? 'px-3 sm:px-4 lg:px-6' : 'px-4 sm:px-6 lg:px-16'}`}>
        <div className="flex items-center justify-between h-12 sm:h-16">
          
          {/* Left: CANIGO Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigateTo(authRole === 'admin' ? '/admin' : '/')}
              className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-lg"
              aria-label={authRole === 'admin' ? 'CANIGO Admin overview' : 'CANIGO Home'}
            >
              <div className="text-forest group-hover:scale-105 transition-transform">
                <WheelchairIcon className="w-6 h-6 text-forest" size={24} />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-forest font-sans">
                CANIGO
              </span>
            </button>
          </div>

          {/* Center: Main Navigation */}
          <nav className={`hidden ${authRole === 'admin' ? 'lg:flex items-center space-x-0.5' : 'md:flex items-center space-x-1 lg:space-x-3 lg:translate-x-32'}`}>
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => navigateTo(link.path)}
                  aria-current={active ? 'page' : undefined}
                  className={`${authRole === 'admin' ? 'px-2.5 py-1.5 text-xs' : 'px-4 py-1.5 text-[14px]'} whitespace-nowrap rounded-full font-semibold transition-all duration-150 ${
                    active
                      ? 'bg-[#DDEBE1] text-[#155E4B] shadow-xs'
                      : 'text-[#263C3A] hover:text-forest hover:bg-black/5'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Notifications and account controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">

            {authRole !== 'admin' && (
              <button
                onClick={() => navigateTo(authRole === 'citizen' ? '/contribute' : '/signin')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 sm:px-4 ${
                  currentRoute === '/contribute'
                    ? 'bg-[#124B3D] text-white'
                    : 'bg-forest text-white hover:bg-forest-hover'
                }`}
                aria-label="Post a place or accessibility update"
                title="Post a place or accessibility update"
              >
                <Plus className="h-4 w-4" />
                <span>Post</span>
              </button>
            )}
            
            {/* Notification Bell */}
            {authRole === 'citizen' && <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setIsNotificationsOpen(!isNotificationsOpen);
                  setIsProfileOpen(false);
                }}
                className="relative p-2 text-[#263C3A] hover:text-forest hover:bg-[#DDEBE1]/50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-forest"
                aria-label={`Notifications, ${unreadNotificationCount} unread`}
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-forest text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#F7F6F0]">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-sm sm:w-96 bg-white rounded-2xl shadow-popover border border-[#E5E5DC] py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 pb-2 border-b border-[#E5E5DC] flex items-center justify-between">
                    <span className="font-bold text-sm text-[#263C3A]">Notifications</span>
                    <button 
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        navigateTo('/notifications');
                      }}
                      className="text-xs text-forest font-semibold hover:underline"
                    >
                      View All
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {notifications.slice(0, 4).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          setIsNotificationsOpen(false);
                          if (notif.linkUrl) navigateTo(notif.linkUrl);
                        }}
                        className={`p-3.5 hover:bg-[#F7F6F0] cursor-pointer transition-colors flex gap-3 ${
                          !notif.read ? 'bg-[#EDF4EA]/40' : ''
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-forest" style={{ opacity: notif.read ? 0 : 1 }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#263C3A] truncate">{notif.title}</p>
                          <p className="text-xs text-[#74817B] line-clamp-2 mt-0.5">{notif.description}</p>
                          <span className="text-[10px] text-gray-400 mt-1 block">{notif.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-3 pt-2 border-t border-[#E5E5DC] text-center">
                    <button
                      onClick={() => {
                        setIsNotificationsOpen(false);
                        navigateTo('/notifications');
                      }}
                      className="text-xs font-semibold text-forest hover:text-forest-hover py-1 block w-full"
                    >
                      See All Activity & Preferences
                    </button>
                  </div>
                </div>
              )}
            </div>}

            {authRole ? <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-forest rounded-full p-0.5"
                aria-label={`${authRole === 'admin' ? 'Admin' : 'Citizen'} account menu`}
              >
                {authRole === 'admin' ? (
                  <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#155E4B] text-white flex items-center justify-center text-xs font-bold border-2 border-white shadow-xs">AD</span>
                ) : (
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.name}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-xs"
                  />
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-xs sm:w-64 bg-white rounded-2xl shadow-popover border border-[#E5E5DC] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 border-b border-[#E5E5DC]">
                    <p className="text-sm font-bold text-[#263C3A] leading-tight">{authRole === 'admin' ? 'CANIGO Admin' : userProfile.name}</p>
                    <p className="text-xs text-[#74817B] mt-0.5">{authRole === 'admin' ? 'Administrator workspace' : userProfile.location}</p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EDF4EA] text-forest text-[11px] font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-forest" />
                      {authRole === 'admin' ? 'Administrator' : userProfile.badge}
                    </div>
                  </div>

                  <div className="py-1">
                    {authRole === 'admin' ? <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigateTo('/admin');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#263C3A] hover:bg-[#F7F6F0] flex items-center gap-2.5"
                    >
                      <Shield className="w-4 h-4 text-forest" />
                      Admin Overview
                    </button> : <>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigateTo('/profile');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#263C3A] hover:bg-[#F7F6F0] flex items-center gap-2.5"
                    >
                      <User className="w-4 h-4 text-[#74817B]" />
                      My Profile
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigateTo('/profile');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#263C3A] hover:bg-[#F7F6F0] flex items-center gap-2.5"
                    >
                      <FileText className="w-4 h-4 text-[#74817B]" />
                      My Contributions
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigateTo('/saved');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#263C3A] hover:bg-[#F7F6F0] flex items-center gap-2.5"
                    >
                      <Bookmark className="w-4 h-4 text-[#74817B]" />
                      Saved Places & Lists
                    </button>
                    </>}
                  </div>

                  <div className="border-t border-[#E5E5DC] pt-1">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        signOut();
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-terracotta hover:bg-[#FCEBE7]/50 flex items-center gap-2.5"
                    >
                      <LogOut className="w-4 h-4 text-terracotta" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div> : <button
              onClick={() => navigateTo('/signin')}
              className="rounded-full bg-forest px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-forest-hover"
            >
              Sign in
            </button>}

            {/* Mobile Hamburger Toggle */}
            <div className={authRole === 'admin' ? 'lg:hidden' : 'md:hidden'}>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-[#263C3A] hover:bg-[#DDEBE1]/50 rounded-lg"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className={`${authRole === 'admin' ? 'lg:hidden' : 'md:hidden'} bg-white border-b border-[#E5E5DC] px-4 pt-2 pb-4 space-y-1 shadow-lg`}>
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo(link.path);
              }}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold ${
                isLinkActive(link.path)
                  ? 'bg-[#DDEBE1] text-[#155E4B]'
                  : 'text-[#263C3A] hover:bg-gray-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-[#E5E5DC]">
            {authRole === 'citizen' && <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('/map');
              }}
              className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-[#263C3A] hover:bg-gray-50"
            >
              Accessibility Map
            </button>}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                authRole ? signOut() : navigateTo('/signin');
              }}
              className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-forest hover:bg-[#EDF4EA]"
            >
              {authRole ? 'Sign out' : 'Sign in'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
