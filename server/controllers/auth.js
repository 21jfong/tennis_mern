import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(404).json({ message: "User doesn't exist." });

    if (!existingUser.password)
      return res.status(400).json({
        message: "This account uses Google Sign-In. Please log in with Google.",
      });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "test",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong during login." });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;
  let name = `${firstName} ${lastName}`.trim();

  try {
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "User already exists." });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match." });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      name,
    });
    const token = jwt.sign({ email: result.email, id: result._id }, "test", {
      expiresIn: "1h",
    });

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong during signup." });
  }
};

export const googlesignin = async (req, res) => {
  const { email, name, googleId, imageURL } = req.body;
  const newName = name.trim();

  try {
    let user = await User.findOne({ email });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      user = await User.create({ email, name: newName, googleId, imageURL });
    }

    // (Optional) Issue a token if you want automatic login
    const token = jwt.sign({ email: user.email, id: user._id }, "test", {
      expiresIn: "1h",
    });

    res.status(200).json({ result: user, token });
  } catch (error) {
    res.status(500).json({
      message: `Something went wrong during Google Sign In. ${error}`,
    });
  }
};

export const checkHealth = async (req, res) => {
  res.status(200).json({ result: "OK" });
};
