import React, { useState, useRef, useEffect } from "react";
import { PlusIcon } from "./icons"; // Make sure you have a SendIcon
import { XIcon, SendIcon } from "lucide-react";
import { toast } from "react-toastify";
import { useEventStore } from "../Apicalls/eventAPIs";

const CreateEventPage = ({ setCurrentPage }) => {
  const [mediaFile, setMediaFile] = useState(null); // only one image
  const [prompt, setPrompt] = useState("");

  const textareaRef = useRef(null);
  const { createEvent } = useEventStore();
  const [loading, setLoading] = useState(false);
  // Auto-resize textarea with max height of 150px
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 150);
      textarea.style.height = newHeight + "px";

      // Add scrollbar when max height is reached
      if (newHeight >= 150) {
        textarea.style.overflowY = "auto";
      } else {
        textarea.style.overflowY = "hidden";
      }
    }
  }, [prompt]);

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];
    if (file) setMediaFile(file); // replace any existing file
  };

  const removeMedia = () => {
    setMediaFile(null);
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!prompt || !mediaFile) {
        toast.error("One banner image and prompt is required!");
        return;
      }

      const formData = new FormData();
      formData.append("banner", mediaFile);
      formData.append("prompt", prompt);
      setLoading(true);
      let res = await createEvent(formData);

      if (res.success) {
        toast.success(res.message);
        setCurrentPage("events");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      console.log("something went wrong in handle submit", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0C0C0C] text-gray-200 relative">
      {/* Title */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Create New Event</h1>
        <p className="text-gray-400 text-sm">
          Upload an image and write event details below.
        </p>
      </div>

      {/* Center space */}
      <div className="flex-1 overflow-y-auto px-6 py-4"></div>

      {/* Input area */}
      <div className="px-6 pb-6">
        {/* Media preview */}
        {mediaFile && (
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-700">
              <img
                src={URL.createObjectURL(mediaFile)}
                alt={mediaFile.name}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={removeMedia}
                className="absolute top-1 right-1 bg-black/60 rounded-full p-0.5 hover:bg-red-600 transition"
              >
                <XIcon className="h-3 w-3 text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Input container - Clean design like the image */}
        <form
          onSubmit={handleSubmit}
          className="flex items-end gap-2 bg-[#1A1A1A] rounded-2xl p-3 border border-gray-700"
        >
          {/* Image upload button - Plus icon only */}
          <label className="flex-shrink-0 p-2 bg-gray-800 rounded-xl hover:bg-gray-700 cursor-pointer transition">
            <PlusIcon className="h-5 w-5 text-white" />
            <input
              type="file"
              accept="image/*"
              disabled={loading}
              className="hidden"
              onChange={handleMediaUpload}
            />
          </label>

          {/* Textarea - Clean and simple */}
          <textarea
            ref={textareaRef}
            placeholder="Write event details..."
            disabled={loading}
            rows={1}
            className="flex-1 resize-none bg-transparent text-white placeholder-gray-500 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-0 border-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            style={{ minHeight: "40px", maxHeight: "150px" }}
          />

          {/* Send button - Icon only */}
          <button
            type="submit"
            disabled={loading || (!prompt.trim() && !mediaFile)}
            className="flex-shrink-0 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:opacity-50 rounded-xl text-white transition disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <SendIcon className="h-5 w-5 text-white" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;
