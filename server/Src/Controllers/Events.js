import { uploadToCloudinary } from "../Config/FilesUpload.js";
import { generateEvent } from "../Config/Gemini.js";
import { eventModel } from "../Model/EventModel.js";
import { eventRegistration } from "../Model/RegisterEventModel.js";

export const createEvent = async(req,res) =>{
    try {
        if(!req.user){
            return res.status(401).json({message : "Unauthorized: Please Login!"})
        }


        const {banner} = req.files;

        let bannerurl = null
 

        try {
            let {secure_url} = await uploadToCloudinary(banner[0]);
            bannerurl = secure_url
        } catch (error) {
            console.log("something went wrong in upload to cloudinary" , error)
        }


        console.log("banner url")

        const {prompt} = req.body
   

        let data = await generateEvent(prompt)

        console.log(data)

        const event = await eventModel.create({...data , bannerUrl : bannerurl , creator : req.user._id , knowledgeLevel : "beginner"})
        return res.status(201).json({message : "event created successfully" , event})
  


    } catch (error) {
        console.log("something went wrong in create event function" , error);
        return res.status(500).json({message  : "internal server error"})
    }
}

export const getEvent = async(req,res) =>{
    try {
       

        const {eventId} = req.params;

        console.log(eventId)


        if(!eventId){
            return res.status(400).json({message : "Event ID is required"})
        }

        const event = await eventModel.findById(eventId);
        if(event){
            return res.status(200).json({message : "events fetched successfully" , event})
        }else{
            return res.status(404).json({message : "No events found"})
        }
    } catch (error) {
        console.log("something went wrong in get events function" , error);
        return res.status(500).json({message  : "internal server error"})
    }
}

export const getEvents = async(req,res) =>{
    try {
        if(!req.user){
            return res.status(401).json({message : "Unauthorized: Please Login!"})
        }
        const events = await eventModel.find({creator : req.user._id});
        if(events.length){
            return res.status(200).json({message : "events fetched successfully" , events})
        }else{
            return res.status(404).json({message : "No events found"})
        }
    } catch (error) {
        console.log("something went wrong with get events" , error)
    }
}

export const editEvent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Please Login!" });
    }

    const { eventId } = req.params;
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const event = await eventModel.findOne({ _id: eventId, creator: req.user._id });
    if (!event) {
      return res.status(404).json({ message: "Event not found or not authorized" });
    }

    const { banner, speakerImages } = req.files || {};

    console.log(req.files)

    // ---------- Banner Upload ----------
    if (banner && banner.length > 0) {
      try {
        const { secure_url } = await uploadToCloudinary(banner[0]);
        event.bannerUrl = secure_url;
      } catch (error) {
        console.error("❌ Banner upload failed:", error);
        return res.status(500).json({ message: "Banner upload failed" });
      }
    }

    // ---------- Speaker Images Upload ----------
    if (speakerImages && speakerImages.length > 0) {
      await Promise.all(
        speakerImages.map(async (file, index) => {
          try {
            const { secure_url } = await uploadToCloudinary(file);

            // Attach image to the corresponding speaker
            if (event.speakers[index]) {
              event.speakers[index].imgSrc = secure_url;
            } else {
              event.speakers.push({ imgSrc: secure_url });
            }
          } catch (error) {
            console.error("❌ Speaker image upload failed:", error);
            throw new Error("Speaker upload failed");
          }
        })
      );
    }

    // ---------- Update other fields ----------
    const updatableFields = [
      "title",
      "description",
      "location",
      "eventType",
      "knowledgeLevel",
      "interests",
      "speakers",
      "timetable",
      "startTime",
      "endTime"
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        // For nested objects/arrays sent as JSON string in form-data
        try {
          event[field] = JSON.parse(req.body[field]);
        } catch {
          event[field] = req.body[field]; // fallback for strings/numbers
        }
      }
    });

    await event.save();

    return res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    console.error("❌ Error in editEvent:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




export const deleteEvent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Please Login!" });
    }

    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const event = await eventModel.findOne({ _id: eventId, creator: req.user._id });

    if (!event) {
      return res.status(404).json({ message: "Event not found or you are not authorized to delete this event" });
    }

    await eventModel.deleteOne({ _id: eventId, creator: req.user._id });

    return res.status(200).json({ message: "Event deleted successfully" });

  } catch (error) {
    console.error("❌ Error in deleteEvent:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const registerForEvent = async (req, res) => {
  try {
  

    const { eventId } = req.params;
    const { name, email, organization, knowledgeLevel, interests } = req.body;

    console.log(name)

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

  
    const existingRegistration = await eventRegistration.findOne({
      event: eventId,
      email: email,
    });

 
 
    if (existingRegistration) {
      return res
        .status(400)
        .json({ message: "You have already registered!" });
    }

 
    const registration = await eventRegistration.create({
      event: eventId,
      name,
      email,
      organization,
      knowledgeLevel,
      interests,
    });

 
   
 

    return res.status(200).json({ message: "Registration successful", registration });
  } catch (error) {
    console.error("❌ Error in registerForEvent:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const allRegisteredEvent = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: Please Login!" });
    }

    const { eventId } = req.params; // eventId is optional

    // Step 1: Find all registrations and populate the event
    let query = {};
    if (eventId) {
      query.event = eventId;
    }

    const registrations = await eventRegistration.find(query).populate({
      path: "event",
      select: "title creator",
    });

    // Only include events created by the logged-in user
    const myEventRegistrations = registrations.filter(
      (reg) => reg.event && reg.event.creator.toString() === req.user._id.toString()
    );

    // Group registrations by event
    const registrationsCountByEvent = myEventRegistrations.reduce((acc, reg) => {
      const eId = reg.event._id.toString();
      if (!acc[eId]) {
        acc[eId] = {
          eventTitle: reg.event.title,
          count: 0,
          registrations: [],
        };
      }
      acc[eId].count += 1;
      acc[eId].registrations.push(reg);
      return acc;
    }, {});

    return res.status(200).json({ registrationsCountByEvent });
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


