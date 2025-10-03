
import mongoose, { Schema } from "mongoose";

const registrationSchema = new mongoose.Schema({
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
 
  name: { type: String, required: true },
  email: { type: String, required: true },
  organization: { type: String },  
 knowledgeLevel: { type: String, enum: ["beginner", "intermediate", "advanced"] ,
  default : "beginner"
 },// from dynamic form
  interests: [String],
  
   
},{
    timestamps : true
});


export const eventRegistration = mongoose.model("Registration" , registrationSchema);