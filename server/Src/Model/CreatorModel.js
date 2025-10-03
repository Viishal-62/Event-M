import mongoose from "mongoose";

const creatorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

     organization: { type: String }
},{
    timestamps: true
})

export const Creator = mongoose.model("Creator" , creatorSchema);