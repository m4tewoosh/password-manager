import { Response } from 'express';
import User from '../models/user';

import { IGetUserAuthInfoRequest } from '../types';

const getUser = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const { id } = req.user;

    // if (!id) {
    //  what to do here, is it even possible?
    // }

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
    const { passwordsModuleOn, documentsModuleOn } = req.body;
    const { id } = req.user;

    const updatedData = {
      passwordsModuleOn,
      documentsModuleOn,
    };

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedUser) {
      // 404: Bad Request
      return res.status(404).json({ message: 'User not found' });
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
