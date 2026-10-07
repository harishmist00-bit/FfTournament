import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import Home from './pages/Home';

const page = {
  Tournaments: lazy(() => import('./pages/Tournaments')), TournamentDetail: lazy(() => import('./pages/TournamentDetail')),
  Teams: lazy(() => import('./pages/Teams')), TeamDetail: lazy(() => import('./pages/TeamDetail')),
  Players: lazy(() => import('./pages/Players')), PlayerDetail: lazy(() => import('./pages/PlayerDetail')),
  Matches: lazy(() => import('./pages/Matches')), MatchDetail: lazy(() => import('./pages/MatchDetail')),
  Standings: lazy(() => import('./pages/Standings')), News: lazy(() => import('./pages/News')), NewsDetail: lazy(() => import('./pages/NewsDetail')),
  About: lazy(() => import('./pages/About')), NotFound: lazy(() => import('./pages/NotFound')),
  Login: lazy(() => import('./pages/Auth').then(m => ({ default: m.Login }))), Register: lazy(() => import('./pages/Auth').then(m => ({ default: m.Register }))),
  Profile: lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Profile }))), MyTeam: lazy(() => import('./pages/Dashboard').then(m => ({ default: m.MyTeam }))),
  MyTournaments: lazy(() => import('./pages/Dashboard').then(m => ({ default: m.MyTournaments }))), MyMatches: lazy(() => import('./pages/Dashboard').then(m => ({ default: m.MyMatches }))),
};
const admin = {
  Dashboard: lazy(() => import('./admin/Dashboard')), Tournaments: lazy(() => import('./admin/Tournaments')), TournamentForm: lazy(() => import('./admin/TournamentForm')),
  Teams: lazy(() => import('./admin/Teams')), Players: lazy(() => import('./admin/Players')), Registrations: lazy(() => import('./admin/Registrations')),
  Matches: lazy(() => import('./admin/Matches')), Results: lazy(() => import('./admin/Results')), Standings: lazy(() => import('./admin/Standings')),
  News: lazy(() => import('./admin/News')), Settings: lazy(() => import('./admin/Settings')),
};

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="tournaments" element={<page.Tournaments />} />
        <Route path="tournaments/:slug" element={<page.TournamentDetail />} />
        <Route path="teams" element={<page.Teams />} />
        <Route path="teams/:id" element={<page.TeamDetail />} />
        <Route path="players" element={<page.Players />} />
        <Route path="players/:id" element={<page.PlayerDetail />} />
        <Route path="matches" element={<page.Matches />} />
        <Route path="matches/:id" element={<page.MatchDetail />} />
        <Route path="standings" element={<page.Standings />} />
        <Route path="news" element={<page.News />} />
        <Route path="news/:slug" element={<page.NewsDetail />} />
        <Route path="about" element={<page.About />} />
        <Route path="login" element={<page.Login />} />
        <Route path="register" element={<page.Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<page.Profile />} />
          <Route path="my-team" element={<page.MyTeam />} />
          <Route path="my-tournaments" element={<page.MyTournaments />} />
          <Route path="my-matches" element={<page.MyMatches />} />
        </Route>
        <Route path="*" element={<page.NotFound />} />
      </Route>
      <Route path="admin" element={<ProtectedRoute admin />}>
        <Route element={<AdminLayout />}>
          <Route index element={<admin.Dashboard />} />
          <Route path="tournaments" element={<admin.Tournaments />} />
          <Route path="tournaments/create" element={<admin.TournamentForm />} />
          <Route path="tournaments/:id/edit" element={<admin.TournamentForm />} />
          <Route path="teams" element={<admin.Teams />} />
          <Route path="players" element={<admin.Players />} />
          <Route path="registrations" element={<admin.Registrations />} />
          <Route path="matches" element={<admin.Matches />} />
          <Route path="results" element={<admin.Results />} />
          <Route path="standings" element={<admin.Standings />} />
          <Route path="news" element={<admin.News />} />
          <Route path="settings" element={<admin.Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}
