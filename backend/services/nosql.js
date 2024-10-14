import mongoose from "mongoose";

const connect = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || "mongodb+srv://Fyshi:pMtDYCe3ZMoUXEyd@dbi-cluster0.xykqz.mongodb.net/?retryWrites=true&w=majority&appName=DBI-Cluster0"
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export { connect };
