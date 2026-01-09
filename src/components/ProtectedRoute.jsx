import React, { useEffect, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

// ProtectedRoute prevents logged-in users from accessing signin/signup pages
const ProtectedRoute = ({ children }) => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // If user is already logged in, redirect based on role
  if (session) {
    if (isAdmin) {
      return <Navigate to="/admindashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Not logged in, allow access to signin/signup
  return <>{children}</>;
};

export default ProtectedRoute;
