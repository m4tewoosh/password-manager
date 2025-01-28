import { model, Schema, Types } from 'mongoose';

interface IUser {
  email: string;
  documentsModuleOn: boolean;
  password: string;
  passwordsModuleOn: boolean;
  salt: string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  documentsModuleOn: { type: Boolean, required: true },
  password: { type: String, required: true },
  passwordsModuleOn: { type: Boolean, required: true },
  salt: { type: String, required: true },
});

const UserModel = model('User', userSchema);

export default UserModel;
