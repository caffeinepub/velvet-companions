import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

// Layout
import SiteHeader from './components/layout/SiteHeader';
import SiteFooter from './components/layout/SiteFooter';

// Guards
import RequireAgeGate from './components/guards/RequireAgeGate';
import RequireAuth from './components/guards/RequireAuth';
import RequireAdmin from './components/guards/RequireAdmin';

// Pages
import LandingPage from './pages/LandingPage';
import BrowseCompanionsPage from './pages/BrowseCompanionsPage';
import CompanionProfilePage from './pages/CompanionProfilePage';
import TermsDisclaimerPage from './pages/TermsDisclaimerPage';
import PrivacyPage from './pages/PrivacyPage';
import AdminProfilesPage from './pages/admin/AdminProfilesPage';
import AdminProfileEditorPage from './pages/admin/AdminProfileEditorPage';
import AdminBookingsPage from './pages/admin/AdminBookingsPage';
import AdminBookingDetailPage from './pages/admin/AdminBookingDetailPage';

// Auth
import ProfileSetupModal from './components/auth/ProfileSetupModal';

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <ProfileSetupModal />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const browseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/browse',
  component: () => (
    <RequireAgeGate>
      <BrowseCompanionsPage />
    </RequireAgeGate>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/$profileId',
  component: () => (
    <RequireAgeGate>
      <CompanionProfilePage />
    </RequireAgeGate>
  ),
});

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/terms',
  component: TermsDisclaimerPage,
});

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/privacy',
  component: PrivacyPage,
});

const adminProfilesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/profiles',
  component: () => (
    <RequireAdmin>
      <AdminProfilesPage />
    </RequireAdmin>
  ),
});

const adminProfileEditorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/profiles/edit/$profileId',
  component: () => (
    <RequireAdmin>
      <AdminProfileEditorPage />
    </RequireAdmin>
  ),
});

const adminProfileCreateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/profiles/create',
  component: () => (
    <RequireAdmin>
      <AdminProfileEditorPage />
    </RequireAdmin>
  ),
});

const adminBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/bookings',
  component: () => (
    <RequireAdmin>
      <AdminBookingsPage />
    </RequireAdmin>
  ),
});

const adminBookingDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/bookings/$bookingId',
  component: () => (
    <RequireAdmin>
      <AdminBookingDetailPage />
    </RequireAdmin>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  browseRoute,
  profileRoute,
  termsRoute,
  privacyRoute,
  adminProfilesRoute,
  adminProfileEditorRoute,
  adminProfileCreateRoute,
  adminBookingsRoute,
  adminBookingDetailRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
