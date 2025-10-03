import { useState } from "react";
import CreateEventPage from "./CreateEventPage";
import DashboardPage from "./DashboardPage";
import EventsPage from "./EventsPage";
import Sidebar from "../Components/Sidebar";
import { MenuIcon } from "lucide-react";
import { useAuthStore } from "../Apicalls/authApi";

export default function MainPage() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const { user } = useAuthStore();

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "events":
        return <EventsPage setCurrentPage={setCurrentPage} />;
      case "create-event":
        return <CreateEventPage setCurrentPage={setCurrentPage} />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-[#171717] text-gray-200 font-sans flex">
      {/* Sidebar stays fixed */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isSidebarOpen={isSidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main content scrolls */}
      <main className="flex-1 min-w-0 overflow-y-auto h-screen">
        {/* Mobile top bar */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800 md:hidden">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-white"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-white"></div>
        </div>

        {/* Desktop top bar */}
        <div className="hidden md:flex justify-end p-4 border-b border-gray-800">
          <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-white">
            {user ? user?.name?.charAt(0).toUpperCase() : "U"}
          </div>
        </div>

        {/* Page content */}
        {renderPage()}
      </main>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-10 md:hidden"
        ></div>
      )}
    </div>
  );
}
