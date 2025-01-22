import sendRequest from 'utils/fetchHelper';

const getPasswords = () =>
  sendRequest({
    method: 'GET',
    endpoint: 'passwords',
  });

export default getPasswords;
