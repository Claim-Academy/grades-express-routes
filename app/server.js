import cors from "cors";
import express from "express";
import config from "./config.js";
import decodeUser from "./middleware/decode-user.js";
import studentRoutes from "./student/routes.js";
import userRoutes from "./user/routes.js";

export default () => {
  const app = express();

  // * Middleware order matters!
  app.use(express.json());
  app.use(decodeUser);

  // TODO: Configure CORS to only allow requests from localhost:5173
  app.use(cors());
  app.use("/api/users/", userRoutes);
  app.use("/api/students/", studentRoutes);

  app.use((_, res) => {
    res.status(404).json({ message: "Not found" });
  });

  app.listen(config.port, () => {
    console.info(`Server running on: http://localhost:${config.port}`);
  });
};
