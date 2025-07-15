import { connect } from "mongoose";
import config from "../config";

async function connectDatabase() {
  connect(config.db_uri)
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.error("Database connection failed", error);
      process.exit(1);
    });
}

export default connectDatabase;
