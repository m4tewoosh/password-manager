import { model, Schema } from 'mongoose';

const validRefreshTokenSchema = new Schema({
  userId: { type: String, required: true },
  jti: { type: String, required: true, unique: true },
});

const ValidRefreshToken = model('valid_refresh_token', validRefreshTokenSchema);

export default ValidRefreshToken;
