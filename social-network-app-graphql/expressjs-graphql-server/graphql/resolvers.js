const User = require("../models/user");
const bcrypt = require("bcrypt");
module.exports = {
  createUser: async (args, req) => {
    const email = args.userInput.email;
    const name = args.userInput.name;
    const password = args.userInput.password;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      const error = new Error("User exists already!");
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    let user = new User({
      email: email,
      name: name,
      password: hashedPassword,
    });

    const createdUser = await user.save();
    console.log("user : ", createdUser);
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },
};
