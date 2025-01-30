import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import ValidRefreshToken from '../models/validRefreshToken';

const ACCESS_TOKEN_COOKIE_MAX_AGE = 6 * 60 * 1000; // max age set to 6 minutes (minutes * seconds * milliseconds)
const REFRESH_TOKEN_COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // max age set to 24 hours ( hours * minutes * seconds * milliseconds)

const generateAccessToken = (id: string) => {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    return null;
  }

  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '5m',
  });
};

const generateRefreshToken = async (id: string) => {
  try {
    const jti = randomUUID();
    const payload = { id, jti };

    if (!process.env.REFRESH_TOKEN_SECRET) {
      return null;
    }

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });

    await ValidRefreshToken.create({ userId: id, jti });

    return refreshToken;
  } catch (error) {
    throw new Error(`Error creating refresh token`);
  }
};

export {
  ACCESS_TOKEN_COOKIE_MAX_AGE,
  REFRESH_TOKEN_COOKIE_MAX_AGE,
  generateAccessToken,
  generateRefreshToken,
};
