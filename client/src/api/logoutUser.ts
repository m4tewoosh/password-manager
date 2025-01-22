import sendRequest from 'utils/fetchHelper';

const logoutUser = () => sendRequest({ method: 'POST', endpoint: 'logout' });

export default logoutUser;
