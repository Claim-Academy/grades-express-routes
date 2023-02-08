import { Router } from "express";
import mongoose from "mongoose";
import userController from "./controller.js";

const router = new Router();

router.post("/create", async (req, res) => {
  const { username, password } = req.body;

  userController
    .create(username, password)
    .then(() => {
      userController.login(username, password).catch((err) => {
        res.status(500).json({ message: err.message });
      });
    })
    .then((jwt) => {
      res.json({ token: jwt });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).json({ message: err.message });
      } else if (err.message === "User already exists") {
        res.status(409).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    });
});

router.post("/login", async (req, res) => {
  if (req.user) {
    return res.json({ message: "You are already logged in" });
  }

  const { username, password } = req.body;

  // Will return a JWT token or null
  const jwt = await userController.login(username, password);

  if (jwt) {
    res.json({ token: jwt });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

export default router;
