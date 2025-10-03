import { configDotenv } from "dotenv";
configDotenv();


let Required_Keys = ["JWT_SECRET_KEY" , "PORT" , "MONGODB_URL" , "CLOUDINARY_CLOUD_NAME" , "CLOUDINARY_API_KEY" , "CLOUDINARY_API_SECRET" , "GEMINI_API_KEY"];

for(let keys of Required_Keys){
    if(!process.env[keys]){
        console.log(`Please set ${keys} in .env file`);
        process.exit(1);
    }
}


export const secretKeys = {
    PORT : process.env.PORT,
    JWT_SECRET_KEY : process.env.JWT_SECRET_KEY,
    MONGODB_URL : process.env.MONGODB_URL,

    cloudinary : {
        cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
        api_key : process.env.CLOUDINARY_API_KEY,
        api_secret : process.env.CLOUDINARY_API_SECRET
    },

    GEMINI_API_KEY : process.env.GEMINI_API_KEY,

    NODE_ENV : process.env.NODE_ENV
}