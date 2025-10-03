import { secretKeys } from "./Src/Config/SecretKeys.js";
import express from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./Src/Config/DB_Config.js";
import authRoutes from "./Src/Routes/Auth.Routes.js"
import eventRoutes from "./Src/Routes/Events.Routes.js"
import cors from "cors"
 
const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true  , limit : "50mb" }));

app.use(cors({

    origin : "https://event-m-lemon.vercel.app" || "http://localhost:5173",
    credentials : true
}))




app.use("/api/auth", authRoutes);
app.use("/api/event", eventRoutes);

app.get("/" , (req , res) => res.send("Hello World"));

connectDB().then(() => {
    app.listen(secretKeys.PORT , () =>{
        console.log(`Server is running on port ${secretKeys.PORT}`);
    })
}).catch((err) => {
    console.log("❌ Error connecting to MongoDB:", err);
});