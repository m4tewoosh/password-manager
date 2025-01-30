import { NextFunction, Request, Response } from 'express';
import jwt, { VerifyErrors } from 'jsonwebtoken';

import {
  generateMasterKey,
  generateSalt,
  hashMainPassword,
  verifyMainPassword,
  deriveKEK,
  encryptMasterKey,
  decryptMasterKey,
} from '../utils/crypto';
import {
  generateAccessToken,
  generateRefreshToken,
  ACCESS_TOKEN_COOKIE_MAX_AGE,
  REFRESH_TOKEN_COOKIE_MAX_AGE,
} from '../utils/token';

import { User, ValidRefreshToken } from '../models';

const registerUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Field 'email' is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        error: "Field 'password' is required",
      });
    }

    if (password.length < 10) {
      return res.status(400).json({
        error: "Field 'password' must  have at least 10 characters",
      });
    }

    const isEmailTaken = await User.findOne({ email });

    if (isEmailTaken) {
      return res.status(409).json({
        error: 'Email is already taken',
      });
    }

    const masterKey = generateMasterKey();
    const salt = generateSalt();
    const passwordHash = await hashMainPassword(password);
    const kek = deriveKEK(password, salt);
    const { encryptedMasterKey, iv, tag } = encryptMasterKey(masterKey, kek);

    const user = await User.create({
      email,
      passwordHash,
      encryptedMasterKey,
      salt,
      iv,
      tag,
      passwordsModuleOn: true,
      documentsModuleOn: true,
    });

    return res.status(201).json({ id: user._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred' });
  }
};

const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    // add checking for random user password to prevent timing attacks

    if (!user) {
      return res.status(401).json({
        error: 'Bad credentials',
      });
    }

    const isPasswordCorrect = await verifyMainPassword(
      password,
      user.passwordHash
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        error: 'Bad credentials',
      });
    }

    const kek = deriveKEK(password, user.salt);
    const masterKey = decryptMasterKey(
      user.encryptedMasterKey,
      kek,
      user.iv,
      user.tag
    );

    req.session.masterKey = masterKey.toString('base64');

    const accessToken = generateAccessToken(String(user._id));
    const refreshToken = await generateRefreshToken(String(user._id));

    return res
      .cookie('accessToken', accessToken, {
        maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
        httpOnly: true,
        // secure: // add for prod environment
        // sameSite: // to check
      })
      .cookie('refreshToken', refreshToken, {
        maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
        httpOnly: true,
        // secure: // add for prod environment
        // sameSite: // to check
      })
      .json({ id: user._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred' });
  }
};

const logoutUser = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.user;

  await ValidRefreshToken.deleteMany({ userId: id });

  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ message: 'Error logging out' });
    }

    res.clearCookie('sid');
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res
      .status(200)
      .json({ message: 'Successfully logged out', redirectUrl: '/login' });
  });
};

const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { accessToken } = req.cookies;

    if (!accessToken) {
      res.status(401).json({ error: 'No access token provided' });
      return;
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

    if (!accessTokenSecret) {
      throw new Error(
        'ACCESS_TOKEN_SECRET is not defined in the environment variables'
      );
    }

    jwt.verify(
      accessToken,
      accessTokenSecret,
      {},
      (error: VerifyErrors | null, user: any) => {
        if (error) {
          res
            .status(401)
            .clearCookie('accessToken')
            .json({ error: 'Access token is invalid or expired' });
          return;
        }

        req.user = user;
        next();
      }
    );
  } catch (error) {
    console.error('Error in authenticateToken:', error);
    res
      .status(500)
      .json({ error: 'An unexpected error occurred during authentication' });
  }
};

const refreshToken = async (req: Request, res: Response): Promise<any> => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ error: 'No refresh token provided' });
    }

    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

    if (!refreshTokenSecret) {
      throw new Error(
        'ACCESS_TOKEN_SECRET is not defined in the environment variables'
      );
    }
    jwt.verify(
      refreshToken,
      refreshTokenSecret,
      {},
      async (error: VerifyErrors | null, token: any) => {
        if (error) {
          return res
            .status(403)
            .clearCookie('refreshToken')
            .json({ error: 'Refresh token is invalid or expired' });
        }

        const isRefreshTokenWhitelisted = await ValidRefreshToken.findOne({
          jti: token?.jti,
        });

        if (!isRefreshTokenWhitelisted) {
          return res
            .status(403)
            .clearCookie('refreshToken')
            .json({ error: 'Refresh token is invalid or expired' });
        }

        await ValidRefreshToken.deleteOne({ jti: token.jti });

        const newAccessToken = generateAccessToken(token.id);
        const newRefreshToken = await generateRefreshToken(token.id);

        return res
          .status(200)
          .cookie('accessToken', newAccessToken, {
            maxAge: ACCESS_TOKEN_COOKIE_MAX_AGE,
            httpOnly: true,
            // secure: // add for prod environment
            // sameSite: // to check
          })
          .cookie('refreshToken', newRefreshToken, {
            maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
            httpOnly: true,
            // secure: // add for prod environment
            // sameSite: // to check
          })
          .json({ message: 'Access token refreshed' });
      }
    );
  } catch (error) {
    console.error('Error in refreshToken:', error);
    return res
      .status(500)
      .json({ error: 'An unexpected error occurred during token refresh' });
  }
};

const authorizeUser = (_req: Request, res: Response): any => {
  return res.status(200).json({ message: 'User authorized' });
};

export {
  registerUser,
  loginUser,
  logoutUser,
  authenticateToken,
  refreshToken,
  authorizeUser,
};
