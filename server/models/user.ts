import { model, Schema, Types } from 'mongoose';

interface IUser {
  email: string;
  filesModuleOn: boolean;
  password: string;
  passwordModuleOn: boolean;
  salt: string;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  filesModuleOn: { type: Boolean, required: true },
  password: { type: String, required: true },
  passwordModuleOn: { type: Boolean, required: true },
  salt: { type: String, required: true },
});

const UserModel = model('User', userSchema);

export default UserModel;
