import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// ── Public layout ────────────────────────────────────────
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Home from '../pages/Home';
import About from '../pages/About/About';
import Works from '../pages/Works/Works';
import Blog from '../pages/Blog/Blog';
import Contact from '../pages/Contact/Contact';

// ── Admin layout & pages ─────────────────────────────────
import AdminLayout from '../admin/layout/AdminLayout';    
import ProtectedRoute from '../admin/components/ProtectedRoute'; 


// Admin pages (add more later)
import Dashboard from '../admin/pages/Dashboard';
import AdminLogin from '../admin/pages/AdminLogin';
import Profiles from '../admin/pages/core/Profiles'; 
import Skills from '../admin/pages/core/Skills'; 
import Education from '../admin/pages/core/Education'; 
import Experience from '../admin/pages/core/Experience'; 
import Portfolio from '../admin/pages/works/Portfolio'; 
import Product from '../admin/pages/works/Product'; 
import Resume from '../admin/pages/core/Resume'; 
import BlogPosts from '../admin/pages/blog/BlogPosts'; 
import ContactMessages from '../admin/pages/contact/ContactMessages'; 
import AdminRegister from "../admin/pages/AdminRegister";
// You can create a separate AdminRoutes file later if it grows
// For now we keep it simple inside AppRouter

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function AppRouter() {
  return (
    <Router>
      <Routes>

        {/* ── Public section ── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/works" element={<Works />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* ── Admin section ── (no public navbar/footer) */}
        <Route path="/admin">
          <Route path="login" element={<AdminLogin />} />
          <Route path="register" element={<AdminRegister />} />




          {/* <Route path="/admin/login"    element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} /> */}

          {/* All protected admin pages use AdminLayout */}
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="core/profiles" element={<Profiles />} />
            <Route path="core/skills" element={<Skills />} />
            <Route path="core/education" element={<Education />} />
            <Route path="core/experience" element={<Experience />} />
            <Route path="works/portfolio" element={<Portfolio />} />
            <Route path="works/product" element={<Product />} />
            <Route path="core/resume" element={<Resume />} />
            <Route path="blog/posts" element={<BlogPosts />} />
            <Route path="contact/messages" element={<ContactMessages />} />

            {/* Add more admin routes here later, examples: */}
            {/* <Route path="core/profiles" element={<Profiles />} /> */}
            {/* <Route path="works/portfolio" element={<Portfolio />} /> */}
            {/* <Route path="blog/posts" element={<BlogPosts />} /> */}
            {/* <Route path="contact/messages" element={<ContactMessages />} /> */}
          </Route>

          {/* Optional: redirect /admin → /admin/dashboard when logged in */}
          <Route
            path=""
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>} // or redirect
          />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center p-10">
                <h1 className="text-6xl font-bold text-gray-300">404</h1>
                <p className="text-2xl mt-4 text-gray-600">Page Not Found</p>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRouter;