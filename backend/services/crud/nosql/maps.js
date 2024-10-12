import mongoose from "mongoose";

const mapSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author_medal: { type: Number, required: true },
    gold_medal: { type: Number, required: true },
    silver_medal: { type: Number, required: true },
    bronze_medal: { type: Number, required: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Map = mongoose.model("Map", mapSchema);
export default Map;
