import express from "express";

const router = express.Router();
import {authMiddleware} from "../Middleware/AuthMiddleware.js"
import { allRegisteredEvent, createEvent  , deleteEvent, editEvent, getEvent, getEvents, registerForEvent} from "../Controllers/Events.js";
import { upload , uploadFields } from "../Config/FilesUpload.js";


router.post("/create-event" ,authMiddleware , uploadFields ,createEvent )
router.get("/get-events" , authMiddleware , getEvents);
router.get("/get-event/:eventId"  , getEvent);
router.put("/edit-event/:eventId" , authMiddleware , uploadFields , editEvent);
router.delete("/delete-event/:eventId" , authMiddleware ,deleteEvent);
router.post("/register-event/:eventId" , registerForEvent )
router.get("/all-registered-event/:evendId" , authMiddleware , allRegisteredEvent);
export default router;