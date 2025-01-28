import sendRequest from 'utils/fetchHelper';

const updateUser = (passwordsModuleOn: boolean, documentsModuleOn: boolean) =>
  sendRequest({
    method: 'PATCH',
    endpoint: 'user',
    body: { passwordsModuleOn, documentsModuleOn },
    contentType: 'application/json',
  });

export default updateUser;
