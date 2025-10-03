import React, { useEffect } from "react";
import { Plus, Share2, Video, Calendar, Edit2 } from "lucide-react";
import { useEventStore } from "../Apicalls/eventAPIs.js";
import { useNavigate } from "react-router-dom";

const handleShare = async (id) => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Check this out!",
        text: "Hey, check this cool thing.",
        url: `http://localhost:5173/event/${id}`,
      });
      console.log("Shared successfully!");
    } catch (err) {
      console.error("Error sharing:", err);
    }
  } else {
    alert("Sharing not supported on this browser/device.");
  }
};

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date
      .toLocaleDateString("en-US", { month: "short" })
      .toUpperCase();
    const day = date.getDate();
    return { month, day };
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    return text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
  };

  const truncateTitle = (title, maxLength = 40) =>
    truncateText(title, maxLength);

  const { month, day } = formatDate(event.startTime);
  const startTimeFormatted = formatTime(event.startTime);
  const endTimeFormatted = formatTime(event.endTime);
  const endDayFormatted = new Date(event.endTime).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-gray-900 border border-gray-700/50 rounded-2xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2 group">
      {/* Banner */}
      <div className="relative">
        <img
          loading="lazy"
          className="w-full h-48 object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-300 rounded-lg"
          src={event.bannerUrl}
          onClick={() => navigate(`/event/${event._id}`)}
          alt={`${event.title} banner`}
        />

        {/* Tooltip */}
        <span className="absolute top-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Tap to view
        </span>
        <div className="absolute top-4 right-4">
          <button className="p-2 bg-gray-800/50 rounded-full text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
            <Share2 size={20} onClick={() => handleShare(event._id)} />
          </button>
        </div>
        <div className="absolute top-4 left-4">
          <button
            className="p-2 bg-gray-800/50 rounded-full text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
            onClick={() => navigate(`/edit-event/${event._id}`)}
          >
            <Edit2 size={20} />
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 -mt-20 relative z-10">
        <div className="flex items-center gap-4 mt-5">
          {/* Date Badge */}
          <div className="flex flex-col items-center justify-center bg-gray-800/80 backdrop-blur-sm border border-gray-600/50 rounded-lg p-3 text-center w-20 h-20">
            <span className="text-red-400 font-bold text-lg">{month}</span>
            <span className="text-white font-extrabold text-3xl">{day}</span>
          </div>

          {/* Title */}
          <div className="flex-1 pt-1">
            <h3 className="font-bold text-lg text-white tracking-tight">
              {truncateTitle(event?.title)}
            </h3>

            <p className="text-gray-400 text-sm flex items-center">
              <Calendar size={14} className="mr-2" />
              {startTimeFormatted} - {endDayFormatted}, {endTimeFormatted}
            </p>

            <div className="space-y-1">
              {event.location && (
                <p className="text-gray-400 text-sm flex items-center">
                  <Video size={14} className="mr-2" />
                  virtual
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Time & Location (moved below title) */}

        {/* About Section */}
        <div className="mt-5">
          <h4 className="font-semibold text-gray-300">About Event</h4>
          <p className="text-gray-400 text-sm mt-1">
            {truncateText(event.description, 150)}
          </p>
        </div>
      </div>
    </div>
  );
};

const EventsPage = ({ setCurrentPage }) => {
  const { events, getEvents } = useEventStore();

  useEffect(() => {
    getEvents();
  }, []);

  console.log(events);

  return (
    <div className="bg-gray-950 min-h-screen text-white">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold tracking-tighter">Events</h1>
          <button
            onClick={() => setCurrentPage("create-event")}
            className="bg-red-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-red-500/20 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
