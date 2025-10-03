import { Creator } from "../Model/CreatorModel.js";  
 import { createToken } from "../Utils/Tokens.js";
import { hashPassword , comparePassword } from "../Utils/Password.js";

/**
 * @description Signup new user
 * @route POST /api/auth/signup
 */
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log(name , email , password);

    // 1. Check if user exists
    const existingUser = await Creator.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

 

    // 3. Create user
    const user = await Creator.create({
      name,
      email,
       password : await hashPassword(password),
      organization : "event-M",
    });


    console.log(user)
    // 4. Create token + set cookie
    createToken(user._id, res);

    return res.status(201).json({
      message: "Signup successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("❌ Signup error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @description Login user
 * @route POST /api/auth/login
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await Creator.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2. Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3. Create token + set cookie
    let token = createToken(user._id, res);
    console.log(token);

    return res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * @description Logout user
 * @route POST /api/auth/logout
 */
export const logout = async (req, res) => {
  try {
    // clear cookie
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("❌ Logout error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


/**
 * @description check authentication
 * @route GET /api/auth/check-auth
 */

export const checkAuth = async (req,res) =>{
    try {
         if(!req.user){
             return res.status(401).json({ message: "Unauthorized: User not logged in" });
         }

         return res.status(200).json({ message: "Authorized: User logged in" , user: req.user });
    } catch (error) {
        console.log("something went wrong in check auth function" , error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
