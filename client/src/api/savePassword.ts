import sendRequest from 'utils/fetchHelper';

const savePassword = (username: string, name: string, password: string) =>
  sendRequest({
    method: 'POST',
    endpoint: 'passwords',
    body: { username, name, password },
    contentType: 'application/json',
  });

export default savePassword;
