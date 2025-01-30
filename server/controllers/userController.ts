import { Response } from 'express';
import User from '../models/user';
const {
  verifyMainPassword,
  hashMainPassword,
  deriveKEK,
  encryptMasterKey,
} = require('../utils/crypto');
const { logoutUser } = require('./authController');

import { IGetUserAuthInfoRequest, UpdatedUserData } from '../types';

const getUser = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const { id } = req.user;

    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' }); // 404: Not found
    }

    res.status(200).json({
      // 200: OK
      email: user.email,
      passwordsModuleOn: user.passwordsModuleOn,
      documentsModuleOn: user.documentsModuleOn,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const updateUser = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const { id } = req.user;
    const {
      passwordsModuleOn,
      documentsModuleOn,
      currentPassword,
      newPassword,
    } = req.body;

    const updatedData: UpdatedUserData = {
      passwordsModuleOn,
      documentsModuleOn,
    };

    if (newPassword) {
      if (newPassword.length < 10) {
        return res.status(400).json({
          // 400: Bad request
          error: "Field 'newPassword' must  have at least 10 characters",
        });
      }

      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const isCurrentPasswordValid = await verifyMainPassword(
        currentPassword,
        user.passwordHash
      );

      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      const { masterKey } = req.session;

      if (!masterKey) {
        return logoutUser(req, res);
      }

      const kek = deriveKEK(newPassword, user.salt);
      const { encryptedMasterKey, iv, tag } = encryptMasterKey(
        Buffer.from(masterKey, 'base64'),
        kek
      );

      updatedData.passwordHash = await hashMainPassword(newPassword);
      updatedData.encryptedMasterKey = encryptedMasterKey;
      updatedData.iv = iv;
      updatedData.tag = tag;
    }

    await User.findByIdAndUpdate(
      id,
      { $set: updatedData },
      {
        new: true,
      }
    );

    if (updatedData.passwordHash) {
      return logoutUser(req, res);
    }

    res
      .status(200) // 200: OK
      .json({ message: 'Successfully updated user' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

module.exports = {
  getUser,
  updateUser,
};
