import React, { useState, useRef, useEffect } from "react";
import { Loader, PlusIcon, TrashIcon, Upload, Clock } from "lucide-react";
import { useParams } from "react-router-dom";
import { useEventStore } from "../Apicalls/eventAPIs";

const EventEditForm = ({ initialData = {}, edit, Id }) => {
  const [event, setEvent] = useState({
    title: initialData.title ?? "",
    description: initialData.description ?? "",
    bannerUrl: initialData.bannerUrl ?? "",
    subtitle: initialData.subtitle ?? "",
    location: {
      address: initialData.location?.address ?? "",
      pincode: initialData.location?.pincode ?? "",
      city: initialData.location?.city ?? "",
    },
    eventType: initialData.eventType ?? "",
    interests: initialData.interests ?? [],
    timetable: initialData.timetable ?? [],
    speakers: initialData.speakers ?? [],
    startTime: initialData.startTime
      ? new Date(initialData.startTime).toISOString().slice(0, 16)
      : "",
    endTime: initialData.endTime
      ? new Date(initialData.endTime).toISOString().slice(0, 16)
      : "",
  });

  const [newInterest, setNewInterest] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const bannerFileRef = useRef(null);
  const speakerFileRefs = useRef([]);
  const [bannerFile, setBannerFile] = useState(null);
  const [speakerFiles, setSpeakerFiles] = useState({});

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  };

  const handleBannerFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvent((prev) => ({ ...prev, bannerUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSpeakerFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      setSpeakerFiles((prev) => ({ ...prev, [index]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedSpeakers = [...event.speakers];
        updatedSpeakers[index].imgSrc = reader.result;
        setEvent((prev) => ({ ...prev, speakers: updatedSpeakers }));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Interests ---
  const handleAddInterest = () => {
    if (newInterest.trim() && !event.interests.includes(newInterest.trim())) {
      setEvent((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }));
      setNewInterest("");
    }
  };

  const handleRemoveInterest = (indexToRemove) => {
    setEvent((prev) => ({
      ...prev,
      interests: prev.interests.filter((_, index) => index !== indexToRemove),
    }));
  };

  // --- Timetable ---
  const handleAddTimetable = () => {
    setEvent((prev) => ({
      ...prev,
      timetable: [...prev.timetable, { time: "", event: "" }],
    }));
  };

  const handleRemoveTimetable = (indexToRemove) => {
    setEvent((prev) => ({
      ...prev,
      timetable: prev.timetable.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleTimetableChange = (e, index) => {
    const { name, value } = e.target;
    const updatedTimetable = [...event.timetable];
    updatedTimetable[index][name] = value;
    setEvent((prev) => ({ ...prev, timetable: updatedTimetable }));
  };

  // --- Speakers ---
  const handleAddSpeaker = () => {
    setEvent((prev) => ({
      ...prev,
      speakers: [...prev.speakers, { name: "", title: "", imgSrc: "" }],
    }));
  };

  const handleRemoveSpeaker = (indexToRemove) => {
    setEvent((prev) => ({
      ...prev,
      speakers: prev.speakers.filter((_, index) => index !== indexToRemove),
    }));
    setSpeakerFiles((prev) => {
      const updated = { ...prev };
      delete updated[indexToRemove];
      return updated;
    });
  };

  const handleSpeakerChange = (e, index) => {
    const { name, value } = e.target;
    const updatedSpeakers = [...event.speakers];
    updatedSpeakers[index][name] = value;
    setEvent((prev) => ({ ...prev, speakers: updatedSpeakers }));
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", event.title);
      formData.append("description", event.description);
      formData.append("subtitle", event.subtitle);
      formData.append("eventType", event.eventType);
      formData.append("startTime", event.startTime);
      formData.append("endTime", event.endTime);
      formData.append("location", JSON.stringify(event.location));
      formData.append("interests", JSON.stringify(event.interests));
      formData.append("timetable", JSON.stringify(event.timetable));
      formData.append("speakers", JSON.stringify(event.speakers));

      if (bannerFile) formData.append("banner", bannerFile);

      Object.keys(speakerFiles).forEach((index) => {
        formData.append("speakerImages", speakerFiles[index]);
      });

      await edit(Id, formData);
      setSubmitted(true);
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black text-gray-200 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-800">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
            Edit Event
          </h1>
          <p className="text-gray-400">
            Update the details for your event below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* --- Main Details Section --- */}
          <div className="p-6 bg-gray-900/80 rounded-xl border border-gray-800 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-800 pb-4">
              Main Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={event.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                  placeholder="e.g., Annual Tech Summit"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="subtitle"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  id="subtitle"
                  value={event.subtitle}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                  placeholder="A short, catchy phrase about the event"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={event.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500 resize-vertical"
                  placeholder="Describe what the event is about..."
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Banner Image
                </label>
                <div className="flex items-center gap-4 p-4 bg-gray-800/60 rounded-lg border border-gray-700">
                  <img
                    src={
                      event.bannerUrl ||
                      "https://placehold.co/200x100/111827/374151?text=No+Banner"
                    }
                    alt="Banner preview"
                    className="h-16 w-32 rounded-md object-cover bg-gray-700 flex-shrink-0 border border-gray-600"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://placehold.co/200x100/111827/374151?text=Invalid+URL";
                    }}
                  />
                  <div className="flex-grow">
                    <input
                      type="file"
                      ref={bannerFileRef}
                      onChange={handleBannerFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() => bannerFileRef.current.click()}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-all duration-200 text-sm font-medium flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload Image
                    </button>
                    <p className="text-xs text-gray-500 mt-2">
                      Recommended size: 1200x600 pixels
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="eventType"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Event Type
                </label>
                <input
                  type="text"
                  name="eventType"
                  id="eventType"
                  value={event.eventType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                  placeholder="e.g., Conference, Workshop, Meetup"
                />
              </div>
            </div>
          </div>

          {/* --- Date & Time Section --- */}
          <div className="p-6 bg-gray-900/80 rounded-xl border border-gray-800 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-800 pb-4">
              Date & Time
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="startTime"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Start Time
                </label>
                <input
                  type="datetime-local"
                  name="startTime"
                  id="startTime"
                  value={event.startTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div>
                <label
                  htmlFor="endTime"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  End Time
                </label>
                <input
                  type="datetime-local"
                  name="endTime"
                  id="endTime"
                  value={event.endTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* --- Location Section --- */}
          <div className="p-6 bg-gray-900/80 rounded-xl border border-gray-800 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-800 pb-4">
              Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={event.location.address}
                  onChange={handleLocationChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                  placeholder="123 Main Street"
                />
              </div>
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  value={event.location.city}
                  onChange={handleLocationChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                  placeholder="Techville"
                />
              </div>
              <div>
                <label
                  htmlFor="pincode"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  id="pincode"
                  value={event.location.pincode}
                  onChange={handleLocationChange}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                  placeholder="12345"
                />
              </div>
            </div>
          </div>

          {/* --- Interests Section --- */}
          <div className="p-6 bg-gray-900/80 rounded-xl border border-gray-800 shadow-lg">
            <h2 className="text-xl font-semibold text-white mb-6 border-b border-gray-800 pb-4">
              Interests
            </h2>
            <div className="flex items-center gap-4 mb-4">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                className="flex-grow px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                placeholder="Add an interest tag (e.g., AI, Web3)"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-all duration-200 font-medium flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {event.interests.map((interest, index) => (
                <span
                  key={index}
                  className="flex items-center gap-2 bg-blue-500/20 text-blue-300 text-sm font-medium px-3 py-1 rounded-full border border-blue-500/30"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(index)}
                    className="text-blue-200 hover:text-white transition-colors duration-200"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* --- Timetable Section --- */}
          <div className="p-6 bg-gray-900/80 rounded-xl border border-gray-800 shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                Timetable / Schedule
              </h2>
              <button
                type="button"
                onClick={handleAddTimetable}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-all duration-200 font-medium flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" /> Add Item
              </button>
            </div>
            <div className="space-y-3">
              {event.timetable.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-gray-800/60 p-4 rounded-lg border border-gray-700"
                >
                  <div className="md:col-span-5">
                    <label className="block text-xs font-medium text-gray-400 mb-1 flex items-center gap-2">
                      <Clock className="w-3 h-3 text-blue-400" />
                      Time
                    </label>
                    <input
                      type="text"
                      name="time"
                      value={item.time}
                      onChange={(e) => handleTimetableChange(e, index)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm pl-9"
                      placeholder="e.g., 09:00 AM"
                    />
                  </div>
                  <div className="md:col-span-6">
                    <label className="block text-xs font-medium text-gray-400 mb-1">
                      Event
                    </label>
                    <input
                      type="text"
                      name="event"
                      value={item.event}
                      onChange={(e) => handleTimetableChange(e, index)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="e.g., Registration"
                    />
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRemoveTimetable(index)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all duration-200"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {event.timetable.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No schedule items added yet</p>
                  <p className="text-sm">
                    Click "Add Item" to create your event timetable
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* --- Speakers Section --- */}
          <div className="p-6 bg-gray-900/80 rounded-xl border border-gray-800 shadow-lg">
            <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-4">
              <h2 className="text-xl font-semibold text-white">Speakers</h2>
              <button
                type="button"
                onClick={handleAddSpeaker}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg transition-all duration-200 font-medium flex items-center gap-2"
              >
                <PlusIcon className="w-4 h-4" /> Add Speaker
              </button>
            </div>
            <div className="space-y-4">
              {event.speakers.map((speaker, index) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row gap-4 bg-gray-800/60 p-4 rounded-lg border border-gray-700"
                >
                  {/* Image Preview and Upload */}
                  <div className="flex-shrink-0 text-center">
                    <img
                      src={
                        speaker.imgSrc ||
                        "https://placehold.co/100x100/111827/374151?text=Photo"
                      }
                      alt="Speaker"
                      className="h-20 w-20 rounded-full object-cover bg-gray-700 mx-auto border border-gray-600"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://placehold.co/100x100/111827/374151?text=Error";
                      }}
                    />
                    <input
                      type="file"
                      ref={(el) => (speakerFileRefs.current[index] = el)}
                      onChange={(e) => handleSpeakerFileChange(e, index)}
                      className="hidden"
                      accept="image/*"
                    />
                    <button
                      type="button"
                      onClick={() => speakerFileRefs.current[index].click()}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-md text-xs font-medium mt-2 transition-all duration-200 flex items-center gap-1 mx-auto"
                    >
                      <Upload className="w-3 h-3" />
                      Upload
                    </button>
                  </div>

                  <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={speaker.name}
                        onChange={(e) => handleSpeakerChange(e, index)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Speaker Name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={speaker.title}
                        onChange={(e) => handleSpeakerChange(e, index)}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Speaker Title / Role"
                      />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveSpeaker(index)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all duration-200"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- Submit Button --- */}
          <div className="flex justify-end items-center pt-6 gap-4 border-t border-gray-800">
            {submitted && (
              <p className="text-green-400 text-sm animate-pulse">
                ✓ Event updated successfully!
              </p>
            )}
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Edit() {
  const { Id } = useParams();
  const { events, getEvents, editEvent } = useEventStore();

  useEffect(() => {
    getEvents();
  }, []);

  if (!events.length) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex items-center gap-3 text-gray-300">
          <Loader className="animate-spin w-5 h-5" />
          <span>Loading events...</span>
        </div>
      </div>
    );
  }

  const event = events.find((event) => event._id === Id);
  if (!event)
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-gray-300 text-xl">Event not found</div>
      </div>
    );

  return <EventEditForm initialData={event} edit={editEvent} Id={Id} />;
}
