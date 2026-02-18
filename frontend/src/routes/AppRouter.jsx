import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import Home from '../pages/Home';
import About from '../pages/About/About';
import Works from '../pages/Works/Works';
import Blog from '../pages/Blog/Blog';
import Contact from '../pages/Contact/Contact';

function AppRouter() {
  return (
    <Router>
      <Routes>
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
        </Route>

        <Route
          path="*"
          element={<div className="p-10 text-center">404 - Page Not Found</div>}
        />
      </Routes>
    </Router>
  );
}

export default AppRouter;
