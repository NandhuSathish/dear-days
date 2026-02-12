import { Routes, Route } from 'react-router';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import JournalsPage from '@/pages/JournalsPage';
import EditorPage from '@/pages/EditorPage';
import NotFoundPage from '@/pages/NotFoundPage';

/**
 * Root application component defining the route structure.
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="journals" element={<JournalsPage />} />
          <Route path="journals/:id" element={<EditorPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
