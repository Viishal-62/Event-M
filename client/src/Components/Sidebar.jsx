import {
  LogoIcon,
  HomeIcon,
  CalendarIcon,
  PlusIcon,
  LogOutIcon,
} from "../Pages/icons";  

import { useAuthStore } from "../Apicalls/authApi";

const Sidebar = ({
  currentPage,
  setCurrentPage,
  isSidebarOpen,
  setSidebarOpen,
 
}) => {
  const { logout } = useAuthStore();
  const NavLink = ({ page, label, icon: Icon }) => (
    <button
      onClick={() => {
        setCurrentPage(page);
        setSidebarOpen(false);
      }}
      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors duration-200 ${
        currentPage === page
          ? "bg-gray-800 text-white"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <aside
      className={`fixed z-20 top-0 left-0 h-screen bg-[#0C0C0C] border-r border-gray-800 w-64 p-6 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:relative md:translate-x-0 md:flex-shrink-0 flex flex-col`}
    >
      {/* Logo */}
      <div className="flex items-center space-x-3 mb-10">
        <LogoIcon className="w-8 h-8 text-white" />
      </div>

      {/* Navigation */}
      <nav className="flex-grow space-y-2">
        <NavLink page="dashboard" label="Dashboard" icon={HomeIcon} />
        <NavLink page="events" label="Events" icon={CalendarIcon} />
        <NavLink page="create-event" label="Create Event" icon={PlusIcon} />
      </nav>

      {/* Logout Button at the bottom */}
      <button
        onClick={logout}
        className="mt-auto w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors duration-200"
      >
        <LogOutIcon className="h-5 w-5" />
        <span className="font-medium text-sm">Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
