import { model, Schema } from 'mongoose';

interface IUser {
  email: string;
  passwordHash: string;
  encryptedMasterKey: string;
  salt: string;
  iv: string;
  tag: string;
  passwordsModuleOn: boolean;
  documentsModuleOn: boolean;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  passwordHash: { type: String, required: true },
  encryptedMasterKey: { type: String, required: true },
  salt: { type: String, required: true },
  iv: { type: String, required: true },
  tag: { type: String, required: true },
  passwordsModuleOn: { type: Boolean, required: true },
  documentsModuleOn: { type: Boolean, required: true },
});

const UserModel = model('User', userSchema);

export default UserModel;
