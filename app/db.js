import mongoose from "mongoose";
import config from "./config.js";

export default () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(config.dbConn)
    .then(() => {
      console.info("Connected to the database");
    })
    .catch((err) => {
      console.error("Error connecting to the database", err);
    });
};
