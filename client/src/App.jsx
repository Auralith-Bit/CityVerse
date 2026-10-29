import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

import Home from './pages/Home';
import Places from './pages/Places';
import PlaceDetail from './pages/PlaceDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Nightlife from './pages/Nightlife';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ManagePlaces from './pages/admin/ManagePlaces';
import PlaceForm from './pages/admin/PlaceForm';
import ManageCategories from './pages/admin/ManageCategories';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="places" element={<Places />} />
        <Route path="places/:slug" element={<PlaceDetail />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="nightlife" element={<Nightlife />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="places" element={<ManagePlaces />} />
          <Route path="places/new" element={<PlaceForm />} />
          <Route path="places/:id/edit" element={<PlaceForm />} />
          <Route path="categories" element={<ManageCategories />} />
        </Route>
      </Route>
    </Routes>
  );
}
