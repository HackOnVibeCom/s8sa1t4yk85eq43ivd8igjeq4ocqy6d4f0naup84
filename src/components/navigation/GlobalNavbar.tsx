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
  CheckCircle2
} from 'lucide-react';

export const GlobalNavbar: React.FC = () => {
  const { 
    currentRoute, 
    navigateTo, 
    unreadNotificationCount, 
    userProfile, 
    notifications,
    markNotificationAsRead
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

  const navLinks = [
    { label: 'Explore', path: '/explore' },
    { label: 'Contribute', path: '/contribute' },
    { label: 'Community', path: '/community' },
    { label: 'About', path: '/about' },
  ];

  const isLinkActive = (path: string) => {
    if (path === '/explore') {
      return currentRoute === '/explore' || currentRoute.startsWith('/venues/') || currentRoute === '/map';
    }
    return currentRoute === path;
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F6F0]/95 backdrop-blur-md border-b border-[#E5E5DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: CANIGO Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigateTo('/')}
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-forest rounded-lg"
              aria-label="CANIGO Home"
            >
              <div className="text-forest group-hover:scale-105 transition-transform">
                <WheelchairIcon className="w-7 h-7 text-forest" size={28} />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-forest font-sans">
                CANIGO
              </span>
            </button>
          </div>

          {/* Center: Main Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <button
                  key={link.path}
                  onClick={() => navigateTo(link.path)}
                  className={`px-4 py-1.5 rounded-full text-[15px] font-semibold transition-all duration-150 ${
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

          {/* Right: Notification Bell & Profile Avatar */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
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
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-popover border border-[#E5E5DC] py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
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
            </div>

            {/* User Profile Avatar & Menu */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-forest rounded-full p-0.5"
                aria-label="User profile menu"
              >
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-xs"
                />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-popover border border-[#E5E5DC] py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 border-b border-[#E5E5DC]">
                    <p className="text-sm font-bold text-[#263C3A] leading-tight">{userProfile.name}</p>
                    <p className="text-xs text-[#74817B] mt-0.5">{userProfile.location}</p>
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EDF4EA] text-forest text-[11px] font-semibold">
                      <CheckCircle2 className="w-3 h-3 text-forest" />
                      {userProfile.badge}
                    </div>
                  </div>

                  <div className="py-1">
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
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigateTo('/admin');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-[#155E4B] hover:bg-[#EDF4EA] flex items-center gap-2.5"
                    >
                      <Shield className="w-4 h-4 text-forest" />
                      Admin Moderation
                    </button>
                  </div>

                  <div className="border-t border-[#E5E5DC] pt-1">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigateTo('/');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-terracotta hover:bg-[#FCEBE7]/50 flex items-center gap-2.5"
                    >
                      <LogOut className="w-4 h-4 text-terracotta" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="md:hidden">
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
        <div className="md:hidden bg-white border-b border-[#E5E5DC] px-4 pt-2 pb-4 space-y-1 shadow-lg">
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
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('/map');
              }}
              className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-[#263C3A] hover:bg-gray-50"
            >
              Accessibility Map
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('/admin');
              }}
              className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold text-forest hover:bg-[#EDF4EA]"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
