import { model, Schema } from 'mongoose';

interface IPassword {
  username: string;
  name: string;
  password: string;
  userId: Schema.Types.ObjectId;
}

const passwordSchema = new Schema<IPassword>({
  username: {
    type: String,
    required: true,
  },
  name: { type: String, required: true },
  password: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
});

const PasswordModel = model('Password', passwordSchema);

export default PasswordModel;
