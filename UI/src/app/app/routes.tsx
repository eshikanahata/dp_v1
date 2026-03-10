import { createBrowserRouter } from 'react-router';
import { LoginPage } from './pages/login';
import { DashboardPage } from './pages/dashboard';
import { LiveShiftPage } from './pages/live-shift';
import { DebriefPage } from './pages/debrief';
import { AnalyticsPage } from './pages/analytics';
import { SettingsPage } from './pages/settings';
import { FeedbackPage } from './pages/feedback';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LoginPage,
  },
  {
    path: '/dashboard',
    Component: DashboardPage,
  },
  {
    path: '/live-shift',
    Component: LiveShiftPage,
  },
  {
    path: '/debrief',
    Component: DebriefPage,
  },
  {
    path: '/analytics',
    Component: AnalyticsPage,
  },
  {
    path: '/settings',
    Component: SettingsPage,
  },
  {
    path: '/feedback',
    Component: FeedbackPage,
  },
]);