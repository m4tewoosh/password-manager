import sendRequest from 'utils/fetchHelper';

const getUser = () =>
  sendRequest({
    method: 'GET',
    endpoint: 'user',
  });

export default getUser;
