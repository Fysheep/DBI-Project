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

const defaultMaps = [
  {
    title: "Loopy Loops",
    author_medal: 52.96,
    gold_medal: 55,
    silver_medal: 60,
    bronze_medal: 65,
    creator: "Fyshi",
  },
  {
    title: "Mountain Run",
    author_medal: 58.47,
    gold_medal: 60,
    silver_medal: 65,
    bronze_medal: 70,
    creator: "Hunter1o1",
  },
  {
    title: "Sky High",
    author_medal: 61.32,
    gold_medal: 63,
    silver_medal: 68,
    bronze_medal: 73,
    creator: "FastJack",
  },
  {
    title: "Downhill Dash",
    author_medal: 54.22,
    gold_medal: 56,
    silver_medal: 61,
    bronze_medal: 66,
    creator: "SpeedDemon",
  },
  {
    title: "City Lights",
    author_medal: 57.13,
    gold_medal: 59,
    silver_medal: 64,
    bronze_medal: 69,
    creator: "NitroBlaze",
  },
  {
    title: "Desert Storm",
    author_medal: 59.99,
    gold_medal: 61,
    silver_medal: 66,
    bronze_medal: 71,
    creator: "SkyRunner",
  },
  {
    title: "Forest Sprint",
    author_medal: 51.88,
    gold_medal: 53,
    silver_medal: 58,
    bronze_medal: 63,
    creator: "DriftKing",
  },
  {
    title: "Ocean Breeze",
    author_medal: 53.47,
    gold_medal: 55,
    silver_medal: 60,
    bronze_medal: 65,
    creator: "TurboTornado",
  },
  {
    title: "Canyon Rush",
    author_medal: 60.21,
    gold_medal: 62,
    silver_medal: 67,
    bronze_medal: 72,
    creator: "Overdrive",
  },
  {
    title: "Frozen Circuit",
    author_medal: 50.72,
    gold_medal: 52,
    silver_medal: 57,
    bronze_medal: 62,
    creator: "StormChaser",
  },
  {
    title: "Highway Havoc",
    author_medal: 62.33,
    gold_medal: 64,
    silver_medal: 69,
    bronze_medal: 74,
    creator: "ShadowRacer",
  },
  {
    title: "Sunset Speedway",
    author_medal: 56.84,
    gold_medal: 58,
    silver_medal: 63,
    bronze_medal: 68,
    creator: "Blitz",
  },
  {
    title: "Turbo Tunnel",
    author_medal: 55.76,
    gold_medal: 57,
    silver_medal: 62,
    bronze_medal: 67,
    creator: "RacingAce",
  },
  {
    title: "Gravel Pit",
    author_medal: 54.91,
    gold_medal: 56,
    silver_medal: 61,
    bronze_medal: 66,
    creator: "TrackMaster",
  },
  {
    title: "Lava Lanes",
    author_medal: 60.05,
    gold_medal: 62,
    silver_medal: 67,
    bronze_medal: 72,
    creator: "RocketMan",
  },
];

const Map = mongoose.model("Map", mapSchema);
export default Map;
export { defaultMaps };
