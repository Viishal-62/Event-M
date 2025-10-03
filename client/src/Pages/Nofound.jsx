import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  const dotStyleDark = {
    backgroundImage:
      "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)",
    backgroundSize: "25px 25px",
  };

  return (
    <div
      className="relative font-sans text-gray-900 bg-gray-100 dark:bg-black min-h-screen flex items-center justify-center p-4 transition-colors duration-300"
      style={dotStyleDark}
    >
      <div className="bg-white/80 dark:bg-black/20 p-10 rounded-2xl shadow-2xl dark:shadow-black/50 max-w-md w-full backdrop-blur-lg border border-white/20 dark:border-white/10 text-center">
        <div className="inline-flex items-center justify-center bg-red-100 dark:bg-red-900/30 rounded-full p-4 mb-6 ring-8 ring-red-100/40 dark:ring-red-900/20">
          <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          404
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Oops! The page you’re looking for doesn’t exist.
        </p>

        <button
          onClick={() => navigate("/features")}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-black focus:ring-cyan-500 transition-all transform hover:scale-105 hover:shadow-cyan-500/50"
        >
          oops but there is no home page
        </button>
      </div>
    </div>
  );
}
