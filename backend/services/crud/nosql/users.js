import mongoose from "mongoose";

const skinSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    country: { type: String, required: true },
    comp_points: { type: Number },
    skins: [skinSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
