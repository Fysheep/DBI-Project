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

const defaultSkins = [
  { code: "FFFFFF-000000-000000-6942ff", creator: 'Fyshi', },
  { code: "000000-000000-000000-000000", creator: 'Hunter1o1', },
  { code: "FF5733-33FF57-3357FF-000000", creator: 'FastJack', },
  { code: "33FF57-FFFFFF-57FF33-5733FF", creator: 'SpeedDemon', },
  { code: "5733FF-33FF57-FFFFFF-3357FF", creator: 'NitroBlaze', },
  { code: "FF3333-57FF57-57FF33-FF5733", creator: 'SkyRunner', },
  { code: "33FF57-FF5733-FF3333-57FF33", creator: 'DriftKing', },
  { code: "FF33FF-5733FF-57FF57-FFFFFF", creator: 'TurboTornado', },
  { code: "33FF57-FF5733-5733FF-FF3333", creator: 'Overdrive', },
  { code: "33FFFF-FF5733-FF33FF-FF33FF", creator: 'StormChaser', },
  { code: "5733FF-33FF33-57FF33-FF33FF", creator: 'ShadowRacer', },
  { code: "000000-FF5733-FFFFFF-57FF57", creator: 'Blitz', },
  { code: "5733FF-000000-57FF33-FFFFFF", creator: 'RacingAce', },
  { code: "FF3333-000000-5733FF-FFFFFF", creator: 'TrackMaster', },
  { code: "33FF33-5733FF-57FF33-FF5733", creator: 'RocketMan', },
  { code: "FF5733-33FF57-5733FF-33FFFF", creator: 'WildWhip', },
  { code: "33FFFF-000000-5733FF-FFFFFF", creator: 'Dragster', },
  { code: "33FF57-FF3333-000000-FF5733", creator: 'HotRod', },
  { code: "FF5733-FF33FF-000000-FFFFFF", creator: 'RazorEdge', },
  { code: "FFFFFF-FF5733-FF3333-33FFFF", creator: 'ZoomZoom', },
  { code: "FF3333-000000-33FFFF-5733FF", creator: 'FastJack' },
  { code: "33FF57-FF5733-57FF33-FF3333", creator: 'SkyRunner' },
  { code: "FF5733-33FF57-5733FF-33FFFF", creator: 'ShadowRacer' },
  { code: "33FFFF-000000-5733FF-FFFFFF", creator: 'RacingAce' },
  { code: "33FF57-FF3333-000000-FF5733", creator: 'ZoomZoom' },
];

const Skin = mongoose.model("Skin", skinSchema);
export default Skin;
export { defaultSkins };
