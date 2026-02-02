import React, { memo, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Menu, LogOut, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser, logout } from '../features/Slice/AuthSlice';

const headerVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

const Header = memo(({ toggleTheme, currentTheme, onHamburgerClick }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  const handleThemeToggle = useCallback((e) => {
    toggleTheme();
    e.currentTarget.blur();
  }, [toggleTheme]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const ThemeIcon = useMemo(() => (currentTheme === "light" ? Moon : Sun), [currentTheme]);

  const navLinks = useMemo(() => [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    ...(isAuthenticated ? [
      { to: "/dashboard", label: "Dashboard" },
      { to: "/services", label: "Services" }
    ] : [])
  ], [isAuthenticated]);

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 sm:px-8 py-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-green-100 dark:border-green-900"
    >
      <Link to="/" className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-500 tracking-tight hover:opacity-80 transition">
        Farm with Irene
      </Link>

      <nav className="hidden md:flex gap-6 items-center">
        {navLinks.map(link => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150
                ${isActive
                  ? "text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-900/30"
                  : "text-gray-600 dark:text-gray-300 hover:text-green-600 hover:bg-green-50/50"}`}
            >
              {link.label}
            </Link>
          );
        })}

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

        <button
          onClick={handleThemeToggle}
          className="p-2 rounded-full text-gray-500 hover:text-green-600 transition-colors"
          aria-label="Toggle theme"
        >
          <ThemeIcon className="w-5 h-5" />
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-3 ml-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 hidden lg:inline-block">
              {user?.name || 'User'}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden lg:inline">Logout</span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="ml-2 px-4 py-2 rounded-full bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors shadow-sm"
          >
            Sign In
          </Link>
        )}
      </nav>

      <div className="flex md:hidden items-center gap-2">
        <button
          onClick={handleThemeToggle}
          className="p-2 text-gray-500"
        >
          <ThemeIcon className="w-5 h-5" />
        </button>
        <button
          onClick={onHamburgerClick}
          className="p-2 text-gray-600 hover:text-green-600"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </motion.header>
  );
});

Header.displayName = "Header";

export default Header;