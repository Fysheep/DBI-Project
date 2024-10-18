import mongoose from "mongoose";

const skinSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    name: { type: String, required: true },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const RefSkin = mongoose.model("RefSkin", skinSchema);
export default RefSkin;
