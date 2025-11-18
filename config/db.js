import mongoose from "mongoose";
import "../config/env.js";
export const connectDB=async()=>{
try {
    await mongoose.connect(process.env.MONGO_URL)
console.log(`MONGO DB IS CONNECTED..!`);
} catch (error) {
    console.log(`ERROR OCCURING IN DB CONNECTION ${error}`);
    
}

}