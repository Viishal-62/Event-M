
import jwt from "jsonwebtoken";
import {secretKeys} from "../Config/SecretKeys.js"


export const createToken = (id, res) => {
  try {
 
    const token = jwt.sign({ id }, secretKeys.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
 
    res.cookie("token", token, {
      httpOnly: true,         
      secure: true,  
      sameSite: "strict",        
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    return token;
  } catch (error) {
    console.error("❌ Error in createToken:", error);
    throw new Error("Failed to create token");
  }
};

export const decodeToken = (token) =>{
   try {
     return jwt.verify(token , secretKeys.JWT_SECRET_KEY);
   } catch (error) {
     console.log("something went wrong in decode token function" , error)
   }
}

