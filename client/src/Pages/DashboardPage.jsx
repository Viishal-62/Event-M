import React, { useState, useEffect, useMemo } from "react";
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from "./icons.jsx";
import { useEventStore } from "../Apicalls/eventAPIs.js";

const DashboardPage = () => {
  const {
    events,
    getEvents,
    registrationsCountByEvent,
    getAllRegisteredEvents,
  } = useEventStore();

  const [selectedEventId, setSelectedEventId] = useState("");
  const [attendees, setAttendees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const attendeesPerPage = 10;

  // Fetch all events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      const res = await getEvents();
      if (res.success && res.data?.length > 0) {
        setSelectedEventId(res.data[0]._id); // select first event by default
      }
    };
    fetchEvents();
  }, [getEvents]);

  // Fetch registrations whenever selectedEventId changes
  useEffect(() => {
    if (!selectedEventId) return;
    
    const fetchRegistrations = async () => {
      const res = await getAllRegisteredEvents(selectedEventId); // pass eventId
      const regs = res.data?.[selectedEventId]?.registrations || [];
      setAttendees(regs);
      setCurrentPage(1);
    };
    fetchRegistrations();
  }, [selectedEventId, getAllRegisteredEvents]);

  const handleEventChange = (e) => {
    setSelectedEventId(e.target.value);
  };

  console.log(events)

  const filteredAttendees = useMemo(() => {
    return (attendees || []).filter((attendee) => {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        attendee.name?.toLowerCase().includes(lowerSearch) ||
        attendee.email?.toLowerCase().includes(lowerSearch) ||
        String(attendee._id)?.includes(lowerSearch)
      );
    });
  }, [attendees, searchTerm]);

  const totalPages = Math.ceil(filteredAttendees.length / attendeesPerPage);
  const paginatedAttendees = filteredAttendees.slice(
    (currentPage - 1) * attendeesPerPage,
    currentPage * attendeesPerPage
  );

  const stats = useMemo(() => {
    const registered = attendees?.length || 0;
    const cancelled = "N/A";
    const checkedIn = "N/A";
    return { registered, cancelled, checkedIn };
  }, [attendees]);

  const FilterPill = ({ label, count }) => (
    <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm bg-gray-700 text-white">
      <span>{label}</span>
      <span className="bg-gray-900 text-gray-300 text-xs font-mono px-1.5 py-0.5 rounded-sm">
        {count}
      </span>
    </button>
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="relative mt-4 max-w-xs">
          <select
            value={selectedEventId}
            onChange={handleEventChange}
            className="w-full appearance-none bg-gray-800 border border-gray-700 text-white py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-gray-700 focus:border-blue-500 transition duration-200"
          >
            {events?.length === 0 && <option value="">No events found</option>}
            {events?.map((event) => (
              <option key={event._id} value={event._id}>
                {event.title}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Attendees */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Attendees</h2>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <FilterPill label="Registered" count={stats.registered} />
            <FilterPill label="Cancelled" count={stats.cancelled} />
            <FilterPill label="Check-in" count={stats.checkedIn} />
          </div>
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="h-5 w-5 text-gray-500" />
            </span>
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-gray-200 placeholder-gray-500 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Registered</th>
                <th className="px-6 py-3">Cancelled</th>
                <th className="px-6 py-3">Check-in</th>
                <th className="px-6 py-3">Level</th>
                <th className="px-6 py-3">Area of Interests</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAttendees.map((attendee) => (
                <tr
                  key={attendee._id}
                  className="border-b border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="px-6 py-4 font-medium text-white">
                    {attendee.name}
                  </td>
                  <td className="px-6 py-4 text-gray-400">{attendee.email}</td>
                  <td className="px-6 py-4 text-gray-400">Yes</td>
                  <td className="px-6 py-4 text-gray-400">N/A</td>
                  <td className="px-6 py-4 text-gray-400">N/A</td>
                  <td className="px-6 py-4 text-gray-400">
                    {attendee.knowledgeLevel || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {attendee.interests?.join(", ") || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {paginatedAttendees.length === 0 && (
            <p className="text-center py-8 text-gray-400">
              No attendees found.
            </p>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-end p-4">
            <div className="inline-flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 text-gray-400 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              {[...Array(totalPages).keys()].map((num) => (
                <button
                  key={num + 1}
                  onClick={() => setCurrentPage(num + 1)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === num + 1
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  {num + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-2 py-1 text-gray-400 rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
