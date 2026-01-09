// src/components/Layout.jsx
import Navbar from "../../common/adminCommon/Navbar";
import Sidebar from "../../common/adminCommon/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const Layout = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setTransitionStage("fadeOut");
      const timer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage("fadeIn");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [location, displayLocation]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      
      {/* Top Navbar */}
      <Navbar />

      {/* Sidebar + Content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className={transitionStage}>
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default Layout;
