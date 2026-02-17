import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Home from '../pages/Home';
import About from '../pages/About/About';
import Works from '../pages/Works/Works';
import Blog from '../pages/Blog/Blog';
import Contact from '../pages/Contact/Contact';

// Admin imports
import AdminLayout from '../pages/Admin/AdminLayout';
import Login from '../pages/Admin/Login';
import Register from '../pages/Admin/Register';
import ProtectedRoute from '../components/ProtectedRoute';
import Dashboard from '../pages/Admin/Dashboard';
import SkillsAdmin from '../pages/Admin/SkillsAdmin';
import EducationAdmin from '../pages/Admin/EducationAdmin';
import ExperienceAdmin from '../pages/Admin/ExperienceAdmin';
import PortfoliosAdmin from '../pages/Admin/PortfoliosAdmin';
import ProductsAdmin from '../pages/Admin/ProductsAdmin';
import BlogPostsAdmin from '../pages/Admin/BlogPostsAdmin';
import ContactMessagesAdmin from '../pages/Admin/ContactMessagesAdmin';

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* === PUBLIC PAGES – with Navbar + Footer === */}
        <Route
          element={
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Outlet />
              </main>
              <Footer />
            </div>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/works" element={<Works />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          {/* Add later: <Route path="/blog/:slug" element={<BlogDetail />} /> */}
        </Route>

        {/* === ADMIN LOGIN / REGISTER – NO navbar/footer === */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/register" element={<Register />} />

        {/* === PROTECTED ADMIN AREA – only AdminLayout (custom top bar + sidebar) === */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} /> {/* /admin → dashboard */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="skills" element={<SkillsAdmin />} />
          <Route path="education" element={<EducationAdmin />} />
          <Route path="experience" element={<ExperienceAdmin />} />
          <Route path="portfolios" element={<PortfoliosAdmin />} />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="blog-posts" element={<BlogPostsAdmin />} />
          <Route path="contact-messages" element={<ContactMessagesAdmin />} />
        </Route>

        {/* 404 fallback (optional) */}
        <Route path="*" element={<div className="p-10 text-center">404 - Page Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default AppRouter;