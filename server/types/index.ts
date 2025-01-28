import { Request } from 'express';

type RequestUser = {
  email: string;
  id: string;
};

type Token = {
  id: string;
  jti: string;
};

interface IGetUserAuthInfoRequest extends Request {
  user: RequestUser;
}

export { RequestUser, Token, IGetUserAuthInfoRequest };
