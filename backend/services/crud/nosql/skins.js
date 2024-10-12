import mongoose from "mongoose";

const skinSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Skin = mongoose.model("Skin", skinSchema);
export default Skin;
