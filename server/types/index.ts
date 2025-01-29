import { Request } from 'express';

interface IGetUserAuthInfoRequest extends Request {
  user: RequestUser;
}

type RequestUser = {
  email: string;
  id: string;
};

type Token = {
  id: string;
  jti: string;
};

type UpdatedUserData = {
  passwordsModuleOn: boolean;
  documentsModuleOn: boolean;
  password?: string;
};

export { RequestUser, Token, IGetUserAuthInfoRequest, UpdatedUserData };
