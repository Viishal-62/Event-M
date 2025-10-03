import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useEventStore } from "../Apicalls/eventAPIs.js";
import { Loader, User, Mail, Briefcase, Star, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { format } from "date-fns";

// --- Helper Components ---
const FormIcon = ({ children }) => (
  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
    {children}
  </span>
);

const InterestCheckbox = ({ id, label, value, checked, onChange }) => (
  <div key={id}>
    <input
      type="checkbox"
      id={id}
      value={value}
      className="hidden peer"
      checked={checked}
      onChange={onChange}
    />
    <label
      htmlFor={id}
      className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer text-sm font-medium
                 text-gray-600 dark:text-gray-300
                 peer-checked:border-teal-500 dark:peer-checked:border-teal-400 peer-checked:bg-teal-50 dark:peer-checked:bg-teal-900/40 peer-checked:text-teal-600 dark:peer-checked:text-teal-300
                 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700/60 transform hover:scale-105"
    >
      {value}
    </label>
  </div>
);

const SpeakerCard = ({ name, title, imgSrc, delay }) => (
  <div
    className={`bg-white/50 dark:bg-gray-800/50 p-6 rounded-2xl shadow-lg hover:shadow-xl dark:hover:shadow-teal-500/10 backdrop-blur-lg transition-all duration-300 transform hover:-translate-y-2 group`}
    style={{ transitionDelay: delay }}
  >
    <img
      className="w-24 h-24 rounded-full mx-auto shadow-md border-4 border-white dark:border-gray-700 group-hover:scale-105 transition-transform duration-300"
      src={imgSrc}
      alt={name}
    />
    <h3 className="text-xl font-bold mt-4 text-center text-gray-900 dark:text-white">
      {name}
    </h3>
    <p className="text-center text-teal-600 dark:text-teal-400 font-medium text-sm">
      {title}
    </p>
  </div>
);

// --- Main Component ---
export default function ShowEvent() {
  const { events, getEvents, registerForEvent } = useEventStore();
  const { Id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    experienceLevel: "", // empty string, must select
    organization: "",
    interests: {},
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isDarkMode] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const event = events.find((event) => event._id === Id);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (e) => {
    const { id, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      interests: {
        ...prev.interests,
        [id]: checked,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Transform interests object to array of strings
    const selectedInterests = Object.entries(formData.interests)
      .filter(([key, value]) => value)
      .map(([key]) => {
        const index = key.split("-")[1];
        return event.interests[index];
      });

    if (
      !formData.name ||
      !formData.email ||
      !formData.experienceLevel ||
      !formData.organization ||
      selectedInterests.length === 0
    ) {
      setError("Please fill out all fields and select at least one interest.");
      return;
    }

    try {
      let res = await registerForEvent(Id, {
        ...formData,
        knowledgeLevel: formData.experienceLevel,
        interests: selectedInterests,
      });

      if (res.success) {
        setSubmitted(true);
        toast.success("Registration Successful!", { position: "top-center" });
      } else {
        toast.error(res.message, { position: "top-center" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Registration Failed!", { position: "top-center" });
    }
  };

  if (!events.length) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-gray-200 font-sans antialiased transition-colors duration-300 overflow-x-hidden relative">
        <Loader className="w-5 h-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-gray-200 font-sans antialiased transition-colors duration-300 overflow-x-hidden relative">
        {/* Animated backgrounds */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-green-50 via-gray-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-gray-900"
          style={{ zIndex: 0 }}
        ></div>
        <div
          className="absolute top-1/4 -left-32 w-96 h-96 bg-green-500/20 dark:bg-teal-600/30 rounded-full filter blur-3xl animate-pulse opacity-40 dark:opacity-50"
          style={{ zIndex: 1 }}
        ></div>
        <div
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-teal-500/20 dark:bg-green-600/30 rounded-full filter blur-3xl animate-pulse opacity-40 dark:opacity-50"
          style={{ zIndex: 1 }}
        ></div>

        <div className="relative container mx-auto px-4 py-8 md:py-12 z-10">
          <main
            className={`transition-all duration-700 ease-out ${
              isMounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Header */}
            <header className="text-center max-w-3xl mx-auto">
              <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                {event?.subtitle}
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mt-2 leading-tight bg-clip-text bg-gradient-to-r from-teal-500 to-green-500 dark:from-teal-400 dark:to-green-400">
                {event?.title}
              </h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                {event?.description}
              </p>
            </header>

            {/* Banner */}
            <div
              className={`max-w-4xl mx-auto h-48 md:h-64 bg-cover bg-center rounded-2xl shadow-lg mt-10 border-4 border-white/50 dark:border-gray-700/50 transition-all duration-500 ease-out delay-100 ${
                isMounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
              style={{ backgroundImage: `url(${event.bannerUrl})` }}
              role="img"
              aria-label="Event banner"
            >
              <div className="w-full h-full bg-black/30 rounded-2xl"></div>
            </div>

            {/* Speakers */}
            <section
              className={`mt-16 max-w-4xl mx-auto transition-all duration-500 ease-out delay-200 ${
                isMounted ? "opacity-100" : "opacity-0"
              }`}
            >
              {event?.speakers?.length > 0 && (
                <>
                  <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
                    Featured Speakers
                  </h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    {event.speakers.map((speaker, i) => (
                      <SpeakerCard
                        key={speaker.name}
                        {...speaker}
                        delay={`${i * 100}ms`}
                      />
                    ))}
                  </div>
                </>
              )}
            </section>

            {/* Event Info & Form */}
            <div
              className={`max-w-4xl mx-auto mt-16 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-2xl dark:shadow-teal-500/10 overflow-hidden transition-all duration-500 ease-out delay-300 ${
                isMounted ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="p-8 md:p-10">
                {/* Event Timetable */}
                {event?.timetable?.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      Event Timetable
                    </h2>
                    <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                      {event.timetable.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center  hover:bg-gray-100/50 dark:hover:bg-gray-700/50 p-2 rounded-md transition-colors duration-200"
                        >
                          <div className="flex gap-5">
                            <span className="font-semibold text-teal-600 dark:text-teal-400 ">
                              {format(
                                new Date(item.time),
                                "do MMM, yyyy hh:mm a"
                              )}
                            </span>
                            <span>{item.event}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Registration Form */}
                <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
                  {submitted ? (
                    <div className="w-full text-center py-8">
                      <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
                        Registration Successful!
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mt-2">
                        Thank you, {formData.name}. A confirmation has been
                        sent.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                        Secure Your Spot
                      </h2>
                      {error && (
                        <p className="text-red-500 dark:text-red-400 text-sm mb-4 bg-red-100 dark:bg-red-900/40 p-3 rounded-lg text-center">
                          {error}
                        </p>
                      )}
                      <form
                        onSubmit={handleSubmit}
                        className="max-w-xl mx-auto space-y-5"
                      >
                        <div className="grid md:grid-cols-2 gap-5">
                          <div className="relative">
                            <FormIcon>
                              <User className="w-5 h-5 text-gray-400" />
                            </FormIcon>
                            <input
                              type="text"
                              name="name"
                              placeholder="Full Name"
                              value={formData.name}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent dark:focus:border-transparent outline-none transition duration-200"
                            />
                          </div>
                          <div className="relative">
                            <FormIcon>
                              <Mail className="w-5 h-5 text-gray-400" />
                            </FormIcon>
                            <input
                              type="email"
                              name="email"
                              placeholder="Email Address"
                              value={formData.email}
                              onChange={handleInputChange}
                              className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent dark:focus:border-transparent outline-none transition duration-200"
                            />
                          </div>
                        </div>

                        <div className="relative">
                          <FormIcon>
                            <Star className="w-5 h-5 text-gray-400" />
                          </FormIcon>
                          <select
                            name="experienceLevel"
                            value={formData.experienceLevel}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent dark:focus:border-transparent outline-none transition duration-200 appearance-none"
                          >
                            <option value="" disabled>
                              Select Experience Level
                            </option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>

                        <div className="relative">
                          <FormIcon>
                            <Briefcase className="w-5 h-5 text-gray-400" />
                          </FormIcon>
                          <input
                            type="text"
                            name="organization"
                            placeholder="Company / University"
                            value={formData.organization}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent dark:focus:border-transparent outline-none transition duration-200"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2 text-center text-gray-700 dark:text-gray-300">
                            Areas of Interest
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {event.interests?.map((interest, index) => (
                              <InterestCheckbox
                                key={index}
                                id={`interest-${index}`}
                                label={interest}
                                value={interest}
                                checked={
                                  formData.interests[`interest-${index}`]
                                }
                                onChange={handleInterestChange}
                              />
                            ))}
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-teal-500 to-green-500 dark:from-teal-500 dark:to-green-600 text-white font-bold py-4 px-4 rounded-lg hover:shadow-xl hover:shadow-teal-500/40 focus:outline-none focus:ring-4 focus:ring-teal-500 dark:focus:ring-teal-400 focus:ring-opacity-50 transform transition-all duration-300 hover:scale-105"
                        >
                          Register Now
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
