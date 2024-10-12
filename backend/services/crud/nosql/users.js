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

const defaultUsers = [
  { username: "Fyshi", country: "Austria" },
  { username: "Hunter1o1", country: "Austria" },
  { username: "FastJack", country: "USA" },
  { username: "SpeedDemon", country: "Canada" },
  { username: "NitroBlaze", country: "Germany" },
  { username: "SkyRunner", country: "France" },
  { username: "DriftKing", country: "Japan" },
  { username: "TurboTornado", country: "Brazil" },
  { username: "Overdrive", country: "UK" },
  { username: "StormChaser", country: "Australia" },
  { username: "ShadowRacer", country: "Russia" },
  { username: "Blitz", country: "Poland" },
  { username: "RacingAce", country: "Italy" },
  { username: "TrackMaster", country: "Spain" },
  { username: "RocketMan", country: "South Korea" },
  { username: "WildWhip", country: "South Africa" },
  { username: "Dragster", country: "Mexico" },
  { username: "HotRod", country: "New Zealand" },
  { username: "RazorEdge", country: "Netherlands" },
  { username: "ZoomZoom", country: "Sweden" },
];

const User = mongoose.model("User", userSchema);
export default User;
export { defaultUsers };
