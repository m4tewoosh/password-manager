import { Request, Response } from 'express';
import { extractFaviconURL } from './faviconController';
import { logoutUser } from './authController';
import { encryptPassword, decryptPassword } from '../utils/crypto';
import { isValidUrl } from '../utils/url';

import { Password, User } from '../models';

const savePassword = async (req: Request, res: Response) => {
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

    res.status(201).json(newPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const updatePassword = async (req: Request, res: Response) => {
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
      return res.status(404).json({ error: 'Document not found' });
    }

    res.status(200).json(updatedPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const deletePassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: req.user.id });

    await Password.findByIdAndDelete(id);

    res.status(200).json({ message: 'Successfully deleted password' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const getAllPasswords = async (req: Request, res: Response) => {
  try {
    const { id } = req.user;

    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(400).json({
        error: 'Bad request',
      });
    }

    const passwords = await Password.find({ userId: id });

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

    res.status(200).json(decryptedPasswords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

export { savePassword, updatePassword, deletePassword, getAllPasswords };
