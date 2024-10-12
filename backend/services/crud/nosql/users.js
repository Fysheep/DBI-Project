import mongoose from "mongoose";

const replaySchema = new mongoose.Schema(
  {
    record: { type: Number, required: true },
    map: { type: mongoose.Schema.Types.ObjectId, ref: "Map", required: true },
    skin: { type: mongoose.Schema.Types.ObjectId, ref: "Skin", required: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    country: { type: String, required: true },
    skins: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skin" }],
    replays: [replaySchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
