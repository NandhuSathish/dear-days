import { Routes, Route } from 'react-router';
import MainLayout from '@/layouts/MainLayout';
import HomePage from '@/pages/HomePage';
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
        <Route index element={<HomePage />} />
        <Route path="journals" element={<JournalsPage />} />
        <Route path="journals/:id" element={<EditorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
