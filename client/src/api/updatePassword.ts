import sendRequest from 'utils/fetchHelper';

const updatePassword = (
  id: string,
  username: string,
  name: string,
  password: string
) =>
  sendRequest({
    method: 'PATCH',
    endpoint: `passwords/${id}`,
    body: { username, name, password },
  });

export default updatePassword;
