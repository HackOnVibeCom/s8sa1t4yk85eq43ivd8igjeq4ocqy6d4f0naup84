import React from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import { AIProvider } from './contexts/AIContext';
import { GlobalNavbar } from './components/navigation/GlobalNavbar';
import { GlobalCanigoAgent } from './components/assistant/GlobalCanigoAgent';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { VenueDetailsPage } from './pages/VenueDetailsPage';
import { ContributePage } from './pages/ContributePage';
import { CommunityPage } from './pages/CommunityPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ReportPage } from './pages/ReportPage';
import { SavedPlacesPage } from './pages/SavedPlacesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ExpandedAssistantPage } from './pages/ExpandedAssistantPage';
import { AccessibilityMapPage } from './pages/AccessibilityMapPage';
import { PhotoEvidencePage } from './pages/PhotoEvidencePage';
import { AboutPage } from './pages/AboutPage';

// Router content component
const AppRouter: React.FC = () => {
  const { currentRoute, navigateTo } = useApp();

  const renderCurrentPage = () => {
    if (currentRoute === '/') return <HomePage />;
    if (currentRoute === '/explore') return <ExplorePage />;
    if (currentRoute.startsWith('/venues/')) return <VenueDetailsPage />;
    if (currentRoute === '/contribute') return <ContributePage />;
    if (currentRoute === '/community') return <CommunityPage />;
    if (currentRoute === '/profile') return <ProfilePage />;
    if (currentRoute === '/admin') return <AdminDashboardPage />;
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

      {/* Main Page Content */}
      <main className="flex-1 pb-16">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E5E5DC] py-8 text-xs text-[#74817B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-forest text-sm">CANIGO</span>
            <span>—</span>
            <span>Accessible Places for Everyone. Built with community love in Chennai.</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button onClick={() => navigateTo('/about')} className="hover:text-forest">About</button>
            <button onClick={() => navigateTo('/explore')} className="hover:text-forest">Explore</button>
            <button onClick={() => navigateTo('/map')} className="hover:text-forest">Map</button>
            <button onClick={() => navigateTo('/community')} className="hover:text-forest">Community</button>
            <button onClick={() => navigateTo('/admin')} className="hover:text-forest">Moderation</button>
          </div>
        </div>
      </footer>

      {/* Persistent Global Floating CANIGO AI Agent */}
      <GlobalCanigoAgent />
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
