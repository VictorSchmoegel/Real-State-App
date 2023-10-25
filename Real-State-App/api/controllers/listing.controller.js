import User from '../models/User.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import Listing from '../models/listing.model.js';

export const createList = async (req, res, next) => {
  try {
    const list = await Listing.create(req.body);
    return res.status(201).json(list);
  } catch (error) {
    next(error);
  }
};
