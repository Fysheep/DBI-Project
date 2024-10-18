import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true, validateBeforeSave: false }
);

const Test = mongoose.model("Test", testSchema);
export default Test;
