import sendRequest from 'utils/fetchHelper';

const loginUser = (email: string, password: string) =>
  sendRequest({
    method: 'POST',
    endpoint: 'login',
    body: { email, password },
    contentType: 'application/json',
  });

export default loginUser;
