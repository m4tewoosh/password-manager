import sendRequest from 'utils/fetchHelper';

const refreshToken = () =>
  sendRequest({
    method: 'POST',
    endpoint: 'refreshToken',
  });

export default refreshToken;
