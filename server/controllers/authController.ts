import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import User from '../models/user';
import ValidRefreshToken from '../models/validRefreshToken';
const {
  comparePasswords,
  generateUserSalt,
  hashPassword,
  accessTokenCookieMaxAge,
  refreshTokenCookieMaxAge,
} = require('../utils/password');
const jwt = require('jsonwebtoken');

import { RequestUser, Token, IGetUserAuthInfoRequest } from '../types';

const generateAccessToken = (id: string) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '5m',
  });
};

const generateRefreshToken = async (id: string) => {
  try {
    const jti = randomUUID();
    const payload = { id, jti };

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });

    await ValidRefreshToken.create({ userId: id, jti });

    return refreshToken;
  } catch (error) {
    throw new Error(`Error creating refresh token`);
  }
};

const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        // 400: Bad request
        error: "Field 'email' is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        // 400: Bad request
        error: "Field 'password' is required",
      });
    }

    // commented for testing purposes
    // if (password.length < 10) {
    //   return res.status(400).json({
    //     // 400: Bad request
    //     error: "Field 'password' must be have at least 10 characters",
    //   });
    // }

    const isEmailTaken = await User.findOne({ email });

    if (isEmailTaken) {
      return res.status(409).json({
        // 409: Conflict
        error: 'Email is already taken',
      });
    }

    const hashedPassword = await hashPassword(password);
    const userSalt = generateUserSalt();

    const user = await User.create({
      email,
      password: hashedPassword,
      passwordsModuleOn: true,
      documentsModuleOn: true,
      salt: userSalt,
    });

    const accessToken = generateAccessToken(String(user._id));
    const refreshToken = await generateRefreshToken(String(user._id));

    res
      .status(201) // 201: Created
      .cookie('accessToken', accessToken, {
        maxAge: accessTokenCookieMaxAge,
        httpOnly: true,
        // secure: // add for prod environment
        // sameSite: // to check
      })
      .cookie('refreshToken', refreshToken, {
        maxAge: refreshTokenCookieMaxAge,
        httpOnly: true,
        // secure: // add for prod environment
        // sameSite: // to check
      })
      .json({ id: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    // add checking for random user password to prevent timing attacks

    if (!user) {
      return res.status(401).json({
        // 401: Unauthorized
        error: 'Bad credentials',
      });
    }

    const isPasswordCorrect = await comparePasswords(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        // 401: Unauthorized
        error: 'Bad credentials',
      });
    }

    const accessToken = generateAccessToken(String(user._id));
    const refreshToken = await generateRefreshToken(String(user._id));

    res
      .cookie('accessToken', accessToken, {
        maxAge: accessTokenCookieMaxAge,
        httpOnly: true,
        // secure: // add for prod environment
        // sameSite: // to check
      })
      .cookie('refreshToken', refreshToken, {
        maxAge: refreshTokenCookieMaxAge,
        httpOnly: true,
        // secure: // add for prod environment
        // sameSite: // to check
      })
      .json({ id: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const logoutUser = async (req: IGetUserAuthInfoRequest, res: Response) => {
  const { id } = req.user;

  await ValidRefreshToken.deleteMany({ userId: id });

  res.clearCookie('accessToken').clearCookie('refreshToken').sendStatus(204); // 204: No Content
};

const authenticateToken = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res.status(401).json({ error: 'No access token provided' }); // 401: Unauthorized
  }

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    {},
    (error: Error, user: RequestUser) => {
      if (error) {
        return res
          .status(401)
          .clearCookie('accessToken')
          .json({ error: 'Access token is invalid or expired' }); // 401: Unathorized
      }

      req.user = user;

      next();
    }
  );
};

const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({ error: 'No refresh token provided' }); // 401: Unauthorized - shouldnt be 403?
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    {},
    async (error: Error, token: Token) => {
      if (error) {
        return res
          .status(403)
          .clearCookie('refreshToken')
          .json({ error: 'Refresh token is invalid or expired' }); // 403: Forbidden
      }

      const isRefreshTokenWhitelisted = await ValidRefreshToken.findOne({
        jti: token.jti,
      });

      if (!isRefreshTokenWhitelisted) {
        return res
          .status(403)
          .clearCookie('refreshToken')
          .json({ error: 'Refresh token is invalid or expired' }); // 403: Forbidden
      }

      await ValidRefreshToken.deleteOne({ jti: token.jti });

      const newAccessToken = generateAccessToken(token.id);
      const newRefreshToken = await generateRefreshToken(token.id);

      res
        .status(200)
        .cookie('accessToken', newAccessToken, {
          maxAge: accessTokenCookieMaxAge,
          httpOnly: true,
          // secure: // add for prod environment
          // sameSite: // to check
        })
        .cookie('refreshToken', newRefreshToken, {
          maxAge: refreshTokenCookieMaxAge,
          httpOnly: true,
          // secure: // add for prod environment
          // sameSite: // to check
        })
        .json({ message: 'Access token refreshed' });
    }
  );
};

const authorizeUser = (_req: IGetUserAuthInfoRequest, res: Response) => {
  return res.status(200).json({ message: 'User authorized' });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authenticateToken,
  refreshToken,
  authorizeUser,
};
