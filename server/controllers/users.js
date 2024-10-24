import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

import User from '../models/user.js';
import Player from '../models/player.js';

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) return res.status(404).json({ message: "User doesn't exist." });

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'test', { expiresIn: "1h" });

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const signup = async (req, res) => {
  const { email, password, confirmPassword, firstName, lastName } = req.body;

  try {

    if (await User.findOne({ email })) return res.status(400).json({ message: "User already exists." });
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords do not match." });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
    await Player.create({ name: `${firstName} ${lastName}`, user_id: result._id });
    const token = jwt.sign({ email: result.email, id: result._id }, 'test', { expiresIn: "1h" });

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong." });
  }
};

export const googlesignin = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 12);

    // check if the google user has a mongo user, if not then create user and player
    if (!existingUser) {
      const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
      await Player.create({ name: `${firstName} ${lastName}`, user_id: result._id });
    } else {
      const existingPlayer = await Player.findOne({ user_id: existingUser._id });

      if (!existingPlayer) {
        await Player.create({ name: `${firstName} ${lastName}`, user_id: existingUser.id });
      }
    }
  } catch (error) {
    console.log(error);
  }
}