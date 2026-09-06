import React, { Suspense, lazy, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Loader2 } from "lucide-react";

import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import UserRoute from './components/auth/UserRoute';
import GuestRoute from './components/auth/GuestRoute';
import AdminRoute from './components/auth/AdminRoute';

// Eager: everything a first-time visitor is likely to see.
import Home from "./pages/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Services from './pages/Services';
import Crops from './pages/Crops';
import Projects from './pages/Projects';
import Testimonials from './pages/Testimonials';
import Partners from './pages/Partners';

// Lazy: signed-in and admin surfaces. Keeping the 2,000-line admin panel out of
// the first-load bundle is the single biggest win for how fast the site feels.
const Blogs = lazy(() => import('./pages/Blogs'));
const Bookings = lazy(() => import('./pages/Bookings'));
const PartnerApply = lazy(() => import('./pages/PartnerApply'));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const PaymentCallback = lazy(() => import("./pages/PaymentCallback"));
const Profile = lazy(() => import("./pages/Profile"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

const RouteFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]" role="status" aria-label="Loading">
    <Loader2 className="w-6 h-6 animate-spin text-field" />
  </div>
);

function App() {
  const [sideNavOpen, setSideNavOpen] = useState(false);

  return (
    <Router>
      <ScrollToTop />
      <Layout sideNavOpen={sideNavOpen} setSideNavOpen={setSideNavOpen}>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/crops" element={<Crops />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/partners/apply" element={<PartnerApply />} />
            <Route path="/blogs" element={<Blogs />} />

            {/* Public on purpose: a visitor can choose a service, pick a date and see
                real availability before being asked to create an account. The sign-in
                prompt happens at submit, with their selection preserved. */}
            <Route path="/booking" element={<Bookings />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/payment-callback" element={<PaymentCallback />} />

            {/* Guest only */}
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

            {/* Signed in */}
            <Route path="/dashboard" element={<UserRoute><Dashboard /></UserRoute>} />
            <Route path="/profile" element={<UserRoute><Profile /></UserRoute>} />

            {/* Admin */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          </Routes>
        </Suspense>
      </Layout>
      <Analytics />
    </Router>
  );
}

export default App;
