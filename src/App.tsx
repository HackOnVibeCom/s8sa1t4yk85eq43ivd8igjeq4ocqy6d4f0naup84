import React, { useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { AIProvider } from './contexts/AIContext';
import { GlobalNavbar } from './components/navigation/GlobalNavbar';
import { GlobalCanigoAgent } from './components/assistant/GlobalCanigoAgent';
import { Compass, Map, Plus, MessageSquare, User } from 'lucide-react';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { VenueDetailsPage } from './pages/VenueDetailsPage';
import { ContributePage } from './pages/ContributePage';
import { CommunityPage } from './pages/CommunityPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminWorkspacePage } from './pages/AdminWorkspacePage';
import { ReportPage } from './pages/ReportPage';
import { SavedPlacesPage } from './pages/SavedPlacesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ExpandedAssistantPage } from './pages/ExpandedAssistantPage';
import { AccessibilityMapPage } from './pages/AccessibilityMapPage';
import { PhotoEvidencePage } from './pages/PhotoEvidencePage';
import { AboutPage } from './pages/AboutPage';
import { SignInPage } from './pages/SignInPage';

// Router content component
const AppRouter: React.FC = () => {
  const { currentRoute, navigateTo, authRole, authLoading, dataError } = useApp();
  const footerLinks = authRole === 'admin' ? [] : [
      { label: 'About', route: '/about' },
      { label: 'Explore', route: '/explore' },
      { label: 'Map', route: '/map' },
      { label: 'Community', route: '/community' },
    ];
  const isAdminRoute = currentRoute === '/admin' || currentRoute.startsWith('/admin/');
  const isCitizenRoute = [
    '/contribute',
    '/community',
    '/profile',
    '/saved',
    '/notifications',
    '/assistant',
    '/map',
  ].includes(currentRoute) || currentRoute.startsWith('/report/') || currentRoute.startsWith('/evidence/');
  const accessDenied = !authLoading
    && ((isAdminRoute && authRole !== 'admin') || (isCitizenRoute && authRole !== 'citizen'));

  useEffect(() => {
    if (accessDenied) {
      navigateTo('/signin');
    }
  }, [accessDenied, currentRoute, authLoading]);

  const renderCurrentPage = () => {
    if (authLoading && (isAdminRoute || isCitizenRoute)) {
      return <div className="flex min-h-[50vh] items-center justify-center text-sm text-[#74817B]" role="status">Checking your sign-in...</div>;
    }
    if (accessDenied || currentRoute === '/signin') return <SignInPage />;
    if (currentRoute === '/') return <HomePage />;
    if (currentRoute === '/explore') return <ExplorePage />;
    if (currentRoute.startsWith('/venues/')) return <VenueDetailsPage />;
    if (currentRoute === '/contribute') return <ContributePage />;
    if (currentRoute === '/community') return <CommunityPage />;
    if (currentRoute === '/profile') return <ProfilePage />;
    if (isAdminRoute) return <AdminWorkspacePage />;
    if (currentRoute.startsWith('/report/')) return <ReportPage />;
    if (currentRoute === '/saved') return <SavedPlacesPage />;
    if (currentRoute === '/notifications') return <NotificationsPage />;
    if (currentRoute === '/assistant') return <ExpandedAssistantPage />;
    if (currentRoute === '/map') return <AccessibilityMapPage />;
    if (currentRoute.startsWith('/evidence/')) return <PhotoEvidencePage />;
    if (currentRoute === '/about') return <AboutPage />;

    // Default fallback
    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-charcoal font-sans antialiased">
      {/* Universal Top Navigation Bar */}
      <GlobalNavbar />

      {dataError && (
        <div className="mx-auto mt-3 w-full max-w-7xl px-4" role="alert">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            Supabase data error: {dataError}
          </div>
        </div>
      )}

      {/* Main Page Content */}
      <main className="flex-1 pb-24 md:pb-8">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E5DC] py-6 sm:py-8 text-xs text-[#74817B] mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="font-extrabold text-forest text-sm">CANIGO</span>
            <span>—</span>
            <span>Accessible Places for Everyone. Built with community love in Chennai.</span>
          </div>

          {footerLinks.length > 0 && <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-semibold">
            {footerLinks.map((link) => (
              <button key={link.route} onClick={() => navigateTo(link.route)} className="hover:text-forest">
                {link.label}
              </button>
            ))}
          </div>}
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Hidden on desktop & admin) */}
      {authRole !== 'admin' && (
        <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E5E5DC] px-2 py-1 flex items-center justify-around shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
          <button
            onClick={() => navigateTo('/explore')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              currentRoute === '/' || currentRoute === '/explore' || currentRoute.startsWith('/venues/')
                ? 'text-forest font-bold'
                : 'text-[#74817B] hover:text-[#263C3A]'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Explore</span>
          </button>

          <button
            onClick={() => navigateTo('/map')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              currentRoute === '/map'
                ? 'text-forest font-bold'
                : 'text-[#74817B] hover:text-[#263C3A]'
            }`}
          >
            <Map className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Map</span>
          </button>

          <button
            onClick={() => navigateTo('/contribute')}
            className="flex flex-col items-center -translate-y-3 group focus:outline-none"
            aria-label="Contribute accessibility details"
          >
            <div className="w-11 h-11 rounded-full bg-forest text-white flex items-center justify-center shadow-lg ring-4 ring-[#F7F6F0] group-hover:bg-forest-hover transition-transform active:scale-95">
              <Plus className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold text-forest mt-0.5">Post</span>
          </button>

          <button
            onClick={() => navigateTo('/community')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              currentRoute === '/community'
                ? 'text-forest font-bold'
                : 'text-[#74817B] hover:text-[#263C3A]'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Community</span>
          </button>

          <button
            onClick={() => navigateTo(authRole ? '/profile' : '/signin')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
              currentRoute === '/profile' || currentRoute === '/saved'
                ? 'text-forest font-bold'
                : 'text-[#74817B] hover:text-[#263C3A]'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Profile</span>
          </button>
        </nav>
      )}

      {/* Persistent Global Floating CANIGO AI Agent */}
      {authRole !== 'admin' && <GlobalCanigoAgent />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AIProvider>
        <AppRouter />
      </AIProvider>
    </AppProvider>
  );
};

export default App;
