import React, { memo, useCallback, useMemo, useState, useRef, useEffect } from "react";
import { Menu, LogOut, User, ChevronDown, LayoutDashboard } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser, logout } from '../features/Slice/AuthSlice';
import { apiSlice } from '../features/Api/apiSlice';
import { useLogoutMutation } from '../features/Api/authApi';
import { SITE } from '../config/site';

// Services is public. A consultancy that hides its service list from visitors
// cannot convert them.
const NAV_LINKS = [
  { to: "/services", label: "Services" },
  { to: "/crops", label: "Crops" },
  { to: "/projects", label: "Field work" },
  { to: "/blogs", label: "Guides" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Header = memo(({ onHamburgerClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const [logoutMutation] = useLogoutMutation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleEsc = (e) => { if (e.key === "Escape") setIsDropdownOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isDropdownOpen]);

  // Close the account menu whenever the route changes
  useEffect(() => { setIsDropdownOpen(false); }, [location.pathname]);

  const homeHref = useMemo(
    () => (user?.role === 'admin' ? '/admin' : '/dashboard'),
    [user?.role]
  );

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-rule">
      <div className="shell flex items-center justify-between h-[4.5rem] gap-6">

        <Link to="/" className="shrink-0 flex items-center gap-2.5" aria-label={`${SITE.name}, home`}>
          <img
            src={SITE.logo}
            alt=""
            width="40"
            height="40"
            className="w-9 h-9 sm:w-10 sm:h-10 shrink-0"
          />
          <span>
            <span className="block font-display text-[1.2rem] sm:text-[1.35rem] leading-none font-semibold text-field tracking-tight">
              {SITE.name}
            </span>
            <span className="hidden sm:block text-[0.6875rem] text-quiet mt-1 leading-none">
              {SITE.tagline}
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
          {NAV_LINKS.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={isActive ? "page" : undefined}
                className={`relative px-3 py-2 text-[0.9375rem] rounded-md transition-colors duration-150
                  ${isActive ? "text-ink font-medium" : "text-quiet hover:text-field"}`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute left-3 right-3 -bottom-px h-0.5 bg-bulb rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <Link to="/booking" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Book a consultation
          </Link>

          {isAuthenticated ? (
            <div className="relative hidden lg:block" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(v => !v)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="menu"
                className="flex items-center gap-1.5 p-1 pr-2 rounded-full border border-transparent hover:border-rule transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-field-tint flex items-center justify-center text-field overflow-hidden font-semibold text-sm">
                  {user?.avatar
                    ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                    : (user?.name?.[0]?.toUpperCase() || <User size={16} />)}
                </span>
                <ChevronDown className={`w-4 h-4 text-quiet transition-transform duration-150 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-60 bg-white rounded-lg border border-rule shadow-lg overflow-hidden z-[60]"
                >
                  <div className="px-4 py-3 border-b border-rule bg-husk">
                    <p className="text-sm font-medium truncate">{user?.name}</p>
                    <p className="text-xs text-quiet truncate mt-0.5">{user?.email}</p>
                  </div>

                  <div className="p-1.5">
                    <Link to={homeHref} role="menuitem" className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-husk transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-quiet" />
                      {user?.role === 'admin' ? 'Admin panel' : 'My dashboard'}
                    </Link>
                    <Link to="/profile" role="menuitem" className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-md hover:bg-husk transition-colors">
                      <User size={16} className="text-quiet" />
                      Profile
                    </Link>
                  </div>

                  <div className="p-1.5 border-t border-rule">
                    <button
                      onClick={handleLogout}
                      role="menuitem"
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-bulb rounded-md hover:bg-bulb-tint transition-colors"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="hidden lg:inline-flex px-3 py-2 text-[0.9375rem] text-quiet hover:text-field transition-colors">
              Sign in
            </Link>
          )}

          <button
            onClick={onHamburgerClick}
            className="lg:hidden p-2 -mr-2 text-ink"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
});

Header.displayName = "Header";

export default Header;
