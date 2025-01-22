import sendRequest from 'utils/fetchHelper';

const deletePassword = (id: string) =>
  sendRequest({
    method: 'DELETE',
    endpoint: `passwords/${id}`,
  });

export default deletePassword;
