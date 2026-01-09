import { Outlet, useLocation, Navigate } from "react-router-dom";
import UserNavbar from "../../common/useCommon/Navbar";
import Footer from "../../common/useCommon/Footer";
import { useEffect, useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";

export default function UserLayout() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState("fadeIn");
  const { session } = UserAuth();
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!session?.user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (!error && data) {
          setIsAdmin(data.role === "admin");
        }
      } catch (error) {
        console.error("Error checking role:", error);
      } finally {
        setLoading(false);
      }
    };

    checkRole();
  }, [session]);

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

  // If user is admin, redirect to admin dashboard
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (isAdmin) {
    return <Navigate to="/admindashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <UserNavbar />
      <main className="flex-grow">
        <div className={transitionStage}>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
