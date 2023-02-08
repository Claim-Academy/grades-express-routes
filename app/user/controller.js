import User from "./User.js";

const userController = {
  create(username, password) {
    // Does the user already exist?
    const existingUser = User.findOne({ username });

    if (existingUser) {
      return Promise.reject(new Error("User already exists"));
    }

    return User.create({ username, password });
  },

  async login(username, password) {
    const loggedInUser = await User.login(username, password);
    return loggedInUser;
  },
};

export default userController;
