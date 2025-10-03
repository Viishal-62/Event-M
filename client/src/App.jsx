import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Auth from "./Pages/Auth";
import NotFound from "./Pages/Nofound";
import MainPage from "./Pages/MainPage";
import ShowEvent from "./Pages/ShowEvent";
import Edit from "./Components/EditForm";
import { ToastContainer } from "react-toastify";
import { useAuthStore } from "./Apicalls/authApi";
import { Loader } from "lucide-react";

export const App = () => {
  const { user, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuth = async () => {
      await checkAuth();
      setLoading(false); // done checking
    };
    fetchAuth();
  }, []);

  if (loading) {
    // show loader until auth is checked
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="animate-spin w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white bg-dots">
      <Routes>
        {/* Auth page */}
        <Route
          path="/auth"
          element={!user ? <Auth /> : <Navigate to="/features" replace />}
        />

        {/* Protected pages */}
        <Route
          path="/features"
          element={user ? <MainPage /> : <Navigate to="/auth" replace />}
        />
        <Route path="/event/:Id" element={<ShowEvent />} />
        <Route
          path="/edit-event/:Id"
          element={user ? <Edit /> : <Navigate to="/auth" replace />}
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer />
    </div>
  );
};
