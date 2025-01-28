import sendRequest from 'utils/fetchHelper';

const registerUser = (email: string, password: string) =>
  sendRequest({
    method: 'POST',
    endpoint: 'register',
    body: { email, password },
    contentType: 'application/json',
  });

export default registerUser;
