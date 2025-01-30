const jwt = require('jsonwebtoken');
import { randomUUID } from 'crypto';
import ValidRefreshToken from '../models/validRefreshToken';

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

module.exports = {
  generateAccessToken,
  generateRefreshToken,
};
