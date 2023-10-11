import User from '../models/User.model.js';
import bcryptjs from 'bcryptjs';

export const singup = async (req, res) => {
  const { username, email, password } = req.body;
  const encryptedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: encryptedPassword });
  try {
    await newUser.save();
    res.status(201).json("user created");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}