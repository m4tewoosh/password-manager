import { Response } from 'express';
const { encryptPassword, decryptPassword } = require('../utils/crypto');
const { extractFaviconURL } = require('../controllers/faviconController');
const { logoutUser } = require('./authController');
const { isValidUrl } = require('../utils/url');
import Password from '../models/password';
import User from '../models/user';

import { IGetUserAuthInfoRequest } from '../types';

const savePassword = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const { username, name, password } = req.body;
    const { id } = req.user;

    const { masterKey } = req.session;

    if (!masterKey) {
      return logoutUser(req, res);
    }

    const { encryptedPassword, iv, tag } = encryptPassword(
      password,
      Buffer.from(masterKey, 'base64')
    );

    let faviconUrl;

    if (isValidUrl(name)) {
      faviconUrl = await extractFaviconURL(name);
    }

    const newPassword = await Password.create({
      userId: id,
      username,
      name,
      faviconUrl,
      encryptedPassword,
      iv,
      tag,
    });

    res
      .status(201) // 201: Created
      .json(newPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const updatePassword = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, username, password } = req.body;

    const { masterKey } = req.session;

    if (!masterKey) {
      return logoutUser(req, res);
    }

    const { encryptedPassword, iv, tag } = encryptPassword(
      password,
      Buffer.from(masterKey, 'base64')
    );

    let faviconUrl;

    if (isValidUrl(name)) {
      try {
        faviconUrl = await extractFaviconURL(name);
      } catch (error) {
        console.error(`Error extracting favicon: ${error}`);
        faviconUrl = null;
      }
    }

    const updatedData = {
      username,
      name,
      faviconUrl: isValidUrl(name) ? faviconUrl : null,
      encryptedPassword,
      iv,
      tag,
    };

    const updatedPassword = await Password.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedPassword) {
      // 404: Bad Request
      return res.status(404).json({ error: 'Document not found' });
    }

    res
      .status(200) // 200: OK
      .json(updatedPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const deletePassword = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: req.user.id });

    // why need to check user?
    if (!user) {
      return res.status(400).json({
        // 404: Bad request
        error: 'Bad request',
      });
    }

    await Password.findByIdAndDelete(id);

    res.status(200).json({ message: 'Successfully deleted password' }); // 200: OK
  } catch (error) {
    console.error(error);
    // 500: Internal Server Error
    res.status(500).json({ error: 'An error occurred' });
  }
};

const getAllPasswords = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const { id } = req.user;

    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(400).json({
        // 404: Bad request
        error: 'Bad request',
      });
    }

    const passwords = await Password.find({ userId: id }); // Retrieve all documents in the Password collection

    const { masterKey } = req.session;

    if (!masterKey) {
      return logoutUser(req, res);
    }

    const decryptedPasswords = passwords.map(
      ({ id, username, name, encryptedPassword, faviconUrl, iv, tag }) => {
        const decryptedPassword = decryptPassword(
          encryptedPassword,
          Buffer.from(masterKey, 'base64'),
          iv,
          tag
        );

        return {
          id,
          username,
          name,
          password: decryptedPassword,
          faviconUrl,
        };
      }
    );

    res.status(200).json(decryptedPasswords); // 200: OK
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

module.exports = {
  savePassword,
  updatePassword,
  deletePassword,
  getAllPasswords,
};
