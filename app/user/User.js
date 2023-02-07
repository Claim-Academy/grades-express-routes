import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Schema, model } from "mongoose";
import config from "../config.js";

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    minLength: [3, "Username must be at least 3 characters long"],
    trim: true,
    validate: {
      validator(username) {
        // Only allow letters and spaces (one space in between words)
        return /[a-zA-Z]+([\s][a-zA-Z]+)*/.test(username);
      },
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [3, "Password must be at least 3 characters long"],
    trim: true,
  },
});

UserSchema.pre("save", async function (next) {
  this.username = this.username.trim().toLowerCase();

  // * Only hash the password if it has been modified (or is new)
  if (this.isModified("password")) {
    const generatedSalt = await bcrypt.genSalt(config.saltRounds);
    this.password = await bcrypt.hash(this.password, generatedSalt);
  }

  next();
});

UserSchema.statics.login = async function (username, password) {
  // * Find the user by username (case insensitive)
  const user = await this.findOne({ username });

  let isMatch = false;
  // * If there is a user, compare the password
  if (user) {
    isMatch = await bcrypt.compare(password, user.password);
  }

  return isMatch
    ? jwt.sign(
        {
          user: {
            id: user._id,
            username: user.username,
          },
        },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      )
    : null;
};

export default model("User", UserSchema);
