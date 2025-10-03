import axios from "axios";

let baseUrl = (window.location.hostname === "localhost") ? "http://localhost:3000" : "https://event-m.onrender.com";

export const axiosInstance = axios.create({
    baseURL : baseUrl,
    headers : {
        "Content-Type" : "application/json"
    },
    

    withCredentials : true
})