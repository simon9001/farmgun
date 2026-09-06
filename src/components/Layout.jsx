import React from 'react';
import Header from "./Header";
import SideNav from "./SideNav";
import Footer from "./Footer";

const Layout = ({ children, sideNavOpen, setSideNavOpen }) => {
  return (
    <div className="min-h-screen flex flex-col bg-husk text-ink overflow-x-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-white focus:text-field focus:px-4 focus:py-2 focus:rounded-md focus:shadow-lg"
      >
        Skip to content
      </a>

      <Header onHamburgerClick={() => setSideNavOpen(true)} />
      <SideNav open={sideNavOpen} onClose={() => setSideNavOpen(false)} />

      <main id="main" className="flex-grow outline-none" tabIndex={-1}>
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default React.memo(Layout);
