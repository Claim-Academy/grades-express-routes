import User from "./User.js";

const userController = {
  create(username, password) {
    return User.create({ username, password });
  },

  async login(username, password) {
    const loggedInUser = await User.login(username, password);
    return loggedInUser;
  },
};

export default userController;
