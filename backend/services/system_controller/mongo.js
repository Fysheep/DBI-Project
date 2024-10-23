import mongoose from "mongoose";
import cs from "../tools/log.js";

const connect = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI ||
        "mongodb+srv://Fyshi:pMtDYCe3ZMoUXEyd@dbi-cluster0.xykqz.mongodb.net/?retryWrites=true&w=majority&appName=DBI-Cluster0"
    );
    cs.log(
      ["magenta", "(MONGODB)"],
      ["white", "    => "],
      ["green", `Connected`]
    );
  } catch (error) {
    cs.log(
      ["magenta", "(MONGODB)"],
      ["white", "    => "],
      [("red", "Could not Connect")]
    );
  }
};

export { connect };
