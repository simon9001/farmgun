import { useEffect, useCallback, memo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, User, LayoutDashboard, Sprout, Mail, X, Home,
  LogIn, LogOut, Award, FileText, Leaf, Briefcase, CalendarCheck
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser, logout } from '../features/Slice/AuthSlice';
import { apiSlice } from '../features/Api/apiSlice';
import { useLogoutMutation } from '../features/Api/authApi';
import { SITE } from '../config/site';

const panelTransition = { type: "tween", ease: [0.22, 0.61, 0.36, 1], duration: 0.28 };

const SideNav = memo(({ open, onClose }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const panelRef = useRef(null);
  const [logoutMutation] = useLogoutMutation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      dispatch(logout());
      dispatch(apiSlice.util.resetApiState());
      onClose();
    }
  }, [dispatch, logoutMutation, onClose]);

  // Close on Escape, lock the page behind the panel, and move focus in.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKeyDown);

    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPad = document.body.style.paddingRight;
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPad;
    };
  }, [open, onClose]);

  const links = [
    { to: "/", icon: Home, text: "Home" },
    { to: "/services", icon: Briefcase, text: "Services" },
    { to: "/crops", icon: Sprout, text: "Crops" },
    { to: "/projects", icon: Leaf, text: "Field work" },
    { to: "/blogs", icon: FileText, text: "Guides" },
    { to: "/partners", icon: Award, text: "Partners" },
    { to: "/about", icon: User, text: "About" },
    { to: "/contact", icon: Mail, text: "Contact" },
    ...(isAuthenticated
      ? [user?.role === 'admin'
        ? { to: "/admin", icon: ShieldCheck, text: "Admin panel" }
        : { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" }]
      : []),
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-ink/45 z-50 lg:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.nav
            ref={panelRef}
            tabIndex={-1}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={panelTransition}
            className="fixed top-0 right-0 w-[86vw] max-w-[330px] h-[100dvh] bg-white z-50 flex flex-col border-l border-rule lg:hidden outline-none"
            aria-label="Main navigation"
          >
            <div className="flex items-center justify-between px-5 h-[4.5rem] border-b border-rule shrink-0">
              <span className="flex items-center gap-2.5 min-w-0">
                <img src={SITE.logo} alt="" width="32" height="32" className="w-8 h-8 shrink-0" />
                <span className="font-display text-lg font-semibold text-field truncate">{SITE.name}</span>
              </span>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-2 -mr-2 text-quiet hover:text-ink transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <ul className="flex-1 overflow-y-auto no-scrollbar py-2">
              {links.map(({ to, icon: Icon, text }) => {
                const isActive = location.pathname === to;
                return (
                  <li key={to}>
                    <Link
                      to={to}
                      onClick={onClose}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex items-center gap-3.5 px-5 py-3 transition-colors
                        ${isActive
                          ? "text-ink font-medium bg-husk border-l-2 border-bulb pl-[1.125rem]"
                          : "text-quiet hover:text-field hover:bg-husk"}`}
                    >
                      <Icon className="w-[1.125rem] h-[1.125rem] shrink-0" />
                      <span>{text}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-rule p-5 shrink-0 space-y-3">
              <Link to="/booking" onClick={onClose} className="btn btn-primary btn-block">
                <CalendarCheck className="w-4 h-4" />
                Book a consultation
              </Link>

              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="w-9 h-9 rounded-full bg-field-tint flex items-center justify-center text-field font-semibold text-sm shrink-0">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{user?.name}</p>
                      <p className="text-xs text-quiet truncate">{user?.email}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout} className="btn btn-outline btn-block text-bulb">
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={onClose} className="btn btn-outline btn-block">
                  <LogIn className="w-4 h-4" />
                  Sign in
                </Link>
              )}
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
});

SideNav.displayName = "SideNav";

export default SideNav;
