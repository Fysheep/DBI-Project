import mongoose from "mongoose";



const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    country: { type: String, required: true },
    comp_points: { type: Number },
  },
  { timestamps: true }
);

const RefUser = mongoose.model("RefUser", userSchema);
export default RefUser;
