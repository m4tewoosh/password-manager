import sendRequest from 'utils/fetchHelper';

const authorizeUser = () =>
  sendRequest({
    method: 'POST',
    endpoint: `auth`,
  });

export default authorizeUser;
