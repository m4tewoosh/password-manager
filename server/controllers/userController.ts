import { Request, Response } from 'express';
import User from '../models/user';

interface IGetUserAuthInfoRequest extends Request {
  user: { email: string; id: string }; // or any other type
}

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
      passwordModuleOn: user.passwordModuleOn,
      filesModuleOn: user.filesModuleOn,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

module.exports = {
  getUser,
};
