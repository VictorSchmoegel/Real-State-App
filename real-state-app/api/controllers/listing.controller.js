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

export const deleteList = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, 'Listing not found'));
  }

  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'Not authorized to delete this listing'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted');
  } catch (error) {
    next(error);
  }
};
