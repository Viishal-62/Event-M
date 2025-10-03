import {GoogleGenAI} from "@google/genai";
import { secretKeys } from "./SecretKeys.js";
 
const genai = new GoogleGenAI({
    apiKey : secretKeys.GEMINI_API_KEY,
   
})
 



export const generateEvent = async (promptText) => {
  try {
    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [promptText],
      config: {
        systemInstruction: `
          You're a very helpful assistant for creating events for creators.
          Always reply strictly in valid JSON following this schema:

          {
            "title": "string (required)",
            "description": "string",
            "subtitle: { type: String },
            "location": {
              "address": "string",
              "pincode": "string",
              "city": "string",
            
            },

            
    startTime: { type: Date },
  endTime: { type: Date, },

  
            "eventType": "string",
            "interests": ["string", "string"]
          }

            timetable: [{
    time: { type: String },
    event: { type: String },
  }],

          Rules:
          - If pincode is missing, generate a realistic one.
          - If lat/lng are missing, generate approximate coordinates.
          - Always return valid JSON only, no \`\`\` fences, no explanations.
          - if user doesn't provide an address just set to virtual 
            -if provide just stick with that address.
          - if start and end time are missing, default to 2 hours to the today's date.
          -never miss description
          -subtitle should be short and catchy
          - create time table according to the given time and duration in time date format

          timeZone : "Asia/Kolkata"
          currentTime : ${new Date().toISOString()}
        `,
      },
    });

    if (!response || !response.text) {
      throw new Error("No response from AI model");
    }

    // 🔥 Remove markdown fences and trim
    let cleanText = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let data;
    try {
      data = JSON.parse(cleanText);
    } catch (err) {
      console.error("Failed to parse JSON:", err.message, "\nRaw:", cleanText);
      throw new Error("Invalid JSON response from model");
    }

    // Minimal validation + fallbacks
    if (!data.title) {
      data.title = "Untitled Event";
    }
    if (!data.location) {
      data.location = {
        address: "Unknown",
        pincode: "000000",
        city: "Unknown",
        lat: 0,
        lng: 0,
      };
    }

 
    return data;

  } catch (error) {
    console.error("Error in generateDetails:", error.message);
    return {
      title: "Error Event",
      description: "Failed to generate details",
      bannerUrl: "",
      location: {
        address: "N/A",
        pincode: "000000",
        city: "N/A",
        lat: 0,
        lng: 0,
      },
      eventType: "N/A",
      knowledgeLevel: "beginner",
      interests: [],
    };
  }
};



 
