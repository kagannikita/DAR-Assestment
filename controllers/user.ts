import { NextFunction, Request, Response } from 'express';
import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/user';
import signJWT from '../functions/signJWT';

const register = (req: Request, res: Response, next: NextFunction) => {
  const { username, password, password2 } = req.body;
  if (password !== password2) {
    return res.status(400).json({
      message: 'Passwords are not equal',
    });
  }
  bcryptjs.hash(password, 10, (hashError, hash) => {
    if (hashError) {
      return res.status(401).json({
        message: hashError.message,
        error: hashError,
      });
    }

    const _user = new User({
      _id: new mongoose.Types.ObjectId(),
      username,
      password: hash,
    });

    return _user
      .save()
      .then((user) => res.status(201).json({
        user,
      }))
      .catch((error) => res.status(500).json({
        message: error.message,
        error,
      }));
  });
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401)
        .json({
          message: 'Unauthorized',
        });
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401)
        .json({
          message: 'Password Mismatch',
        });
    }
    signJWT(user, (_error, token) => {
      if (_error) {
        return res.status(500)
          .json({
            message: _error.message,
            error: _error,
          });
      }
      if (token) {
        return res.status(200)
          .json({
            message: 'Auth successful',
            token,
            user,
          });
      }
    });
  } catch (err) {
    res.status(500)
      .json({
        error: err,
      });
  }
};

const logout = (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;
  if (token === req.cookies.token) {
    res.cookie('token', null);
    return res.status(200).json({ message: 'Logout completed' });
  }
  return res.status(400).json({ message: 'Error' });
};

export default { register, login, logout };
