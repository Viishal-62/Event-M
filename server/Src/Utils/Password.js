import bcrypt from "bcryptjs";

export const hashPassword = async(password) => await bcrypt.hash(password , 10);


export const comparePassword = async(password , hashedPassword) => await bcrypt.compare(password , hashedPassword);

