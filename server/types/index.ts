import { JwtPayload } from 'jsonwebtoken';

type RequestUser = {
  email: string;
  id: string;
};

interface Token extends JwtPayload {
  id: string;
  jti: string;
}

type UpdatedUserData = {
  passwordsModuleOn: boolean;
  documentsModuleOn: boolean;
  passwordHash?: string;
  encryptedMasterKey?: string;
  iv?: string;
  tag?: string;
};

export { RequestUser, Token, UpdatedUserData };
