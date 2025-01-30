import { model, Schema } from 'mongoose';

interface IPassword {
  username: string;
  name: string;
  encryptedPassword: string;
  userId: Schema.Types.ObjectId;
  faviconUrl?: string;
  iv: string;
  tag: string;
}

const passwordSchema = new Schema<IPassword>({
  username: {
    type: String,
    required: true,
  },
  name: { type: String, required: true },
  encryptedPassword: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
  faviconUrl: { type: String, required: false },
  iv: { type: String, required: true },
  tag: { type: String, required: true },
});

const PasswordModel = model('Password', passwordSchema);

export default PasswordModel;
