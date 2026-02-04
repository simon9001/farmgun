import { useEffect, useCallback, memo, useMemo } from "react";
import { motion } from "framer-motion";
import {
  User,
  LayoutDashboard,
  Sprout,
  Mail,
  X,
  Home,
  LogIn,
  LogOut
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser, logout } from '../features/Slice/AuthSlice';

// Animation variants
const navVariants = {
  closed: {
    x: "100%",
    opacity: 0.5,
    transition: {
      type: "spring",
      stiffness: 250,
      damping: 30,
      mass: 0.8,
      when: "afterChildren",
    },
  },
  open: {
    x: "0%",
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 250,
      damping: 30,
      mass: 0.8,
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  closed: { y: 20, opacity: 0 },
  open: { y: 0, opacity: 1 },
};

const overlayVariants = {
  hidden: { opacity: 0, pointerEvents: "none" },
  visible: { opacity: 0.4, pointerEvents: "auto" },
};

// Memoized nav item component
const NavItem = memo(({ link, onNavClick, isActive }) => {
  const Icon = link.icon;
  return (
    <motion.li variants={itemVariants} className="w-full">
      <Link
        to={link.to}
        onClick={onNavClick}
        className={`flex flex-row items-center justify-start gap-4 text-lg font-medium transition-colors duration-200 py-2 w-full
          ${isActive ? "text-green-600 bg-green-50 dark:bg-green-900/20" : "text-gray-700 dark:text-gray-300 hover:text-green-600"}
        `}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="leading-none">{link.text}</span>
      </Link>
    </motion.li>
  );
});
NavItem.displayName = "NavItem";

const SideNav = memo(({ open, onClose }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    onClose();
  }, [dispatch, onClose]);

  // Memoize event handlers
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  const handleClickOutside = useCallback((e) => {
    if (!e.target.closest(".side-nav-panel") && !e.target.closest(".hamburger")) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown, handleClickOutside]);

  // Dynamic nav links
  const navItems = useMemo(() => {
    const links = [
      { to: "/", icon: Home, text: "Home" },
      { to: "/about", icon: User, text: "About" },
      { to: "/contact", icon: Mail, text: "Contact" },
      ...(isAuthenticated ? [
        { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
        { to: "/services", icon: Sprout, text: "Services" }
      ] : [])
    ];

    return links.map((link) => (
      <NavItem
        key={link.to}
        link={link}
        onNavClick={onClose}
        isActive={location.pathname === link.to}
      />
    ));
  }, [onClose, location.pathname, isAuthenticated]);

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={false}
        animate={open ? "visible" : "hidden"}
        variants={overlayVariants}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Navigation Panel */}
      <motion.nav
        initial={false}
        animate={open ? "open" : "closed"}
        variants={navVariants}
        className="side-nav-panel fixed top-0 right-0 w-[85vw] max-w-[300px] h-screen bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col p-6 pt-8 border-l border-green-100 dark:border-green-900 overflow-y-auto"
        aria-label="Main Navigation"
      >
        {/* Close Button */}
        <motion.button
          variants={itemVariants}
          className="self-end text-gray-500 hover:text-green-600 transition-all duration-300 hover:rotate-90 cursor-pointer p-2 -mr-2 mb-8"
          aria-label="Close Menu"
          type="button"
          onClick={onClose}
        >
          <X className="w-7 h-7" />
        </motion.button>

        {/* Navigation Links */}
        <ul className="flex-1 space-y-6">
          {navItems}
        </ul>

        {/* Auth Buttons Footer */}
        <motion.div variants={itemVariants} className="mt-auto border-t border-gray-100 dark:border-gray-800 pt-6">
          {isAuthenticated ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-700 font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-white">{user?.name}</span>
                  <span className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg border border-green-200 text-green-700 font-medium hover:bg-green-50 transition-colors dark:border-green-800 dark:text-green-400"
              >
                Create Account
              </Link>
            </div>
          )}
        </motion.div>
      </motion.nav>
    </>
  );
});

SideNav.displayName = "SideNav";

export default SideNav;