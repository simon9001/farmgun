import React, { memo, useCallback, useMemo, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, LogOut, User, ChevronDown, Settings, LayoutDashboard } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser, logout } from '../features/Slice/AuthSlice';
import { apiSlice } from '../features/Api/apiSlice';
import { useLogoutMutation } from '../features/Api/authApi';

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const [logoutMutation] = useLogoutMutation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleThemeToggle = useCallback((e) => {
    toggleTheme();
    e.currentTarget.blur();
  }, [toggleTheme]);

  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation().unwrap();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      dispatch(logout());
      dispatch(apiSlice.util.resetApiState());
      setIsDropdownOpen(false);
      navigate('/login');
    }
  }, [dispatch, logoutMutation, navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const ThemeIcon = useMemo(() => (currentTheme === "light" ? Moon : Sun), [currentTheme]);

  const navLinks = useMemo(() => [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/partners", label: "Partners" },
    { to: "/crops", label: "Crops" },
    { to: "/blogs", label: "Blogs" },
    { to: "/contact", label: "Contact" },

    ...(isAuthenticated ? [
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
          <div className="relative ml-2" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            >
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-700 dark:text-green-400 overflow-hidden shadow-inner font-bold">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name?.[0]?.toUpperCase() || <User size={18} />
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-[60]"
                >
                  <div className="px-4 py-3 bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user?.email}</p>
                    {user?.role === 'admin' && (
                      <span className="mt-1.5 inline-block px-1.5 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold rounded uppercase tracking-wider">
                        Administrator
                      </span>
                    )}
                  </div>

                  <div className="p-1.5">
                    <Link
                      to={user?.role === 'admin' ? "/admin" : "/dashboard"}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 rounded-xl transition-colors group"
                    >
                      <LayoutDashboard className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors" />
                      {user?.role === 'admin' ? 'Admin Panel' : 'My Dashboard'}
                    </Link>

                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400 rounded-xl transition-colors group"
                    >
                      <User size={16} className="text-gray-400 group-hover:text-green-600 transition-colors" />
                      Profile Settings
                    </Link>
                  </div>

                  <div className="p-1.5 border-t border-gray-100 dark:border-gray-800">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors group"
                    >
                      <LogOut size={16} className="text-red-400 group-hover:text-red-600 transition-colors" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
