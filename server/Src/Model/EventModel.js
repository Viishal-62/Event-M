import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  bannerUrl: { type: String },
  subtitle: { type: String },
  location: {
    address: String,
    pincode: String,
    city: String,
 
  },
  eventType: { type: String },
  interests: [String],
 
  timetable: [{
    time: { type: String },
    event: { type: String },
  }],
  
 
  speakers: [{
    name: { type: String },
    title: { type: String },
    imgSrc: { type: String },
  }],


    startTime: { type: Date },
  endTime: { type: Date, },

   

  creator: { type: mongoose.Schema.Types.ObjectId, ref: "Creator", required: true },

}, {
  timestamps: true
});

export const eventModel = mongoose.model("Event", eventSchema);
