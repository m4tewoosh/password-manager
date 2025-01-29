import sendRequest from 'utils/fetchHelper';

type UserSettings = {
  passwordsModuleOn: boolean;
  documentsModuleOn: boolean;
  currentPassword?: string;
  newPassword?: string;
};

const updateUser = ({
  passwordsModuleOn,
  documentsModuleOn,
  currentPassword,
  newPassword,
}: UserSettings) =>
  sendRequest({
    method: 'PATCH',
    endpoint: 'user',
    body: {
      passwordsModuleOn,
      documentsModuleOn,
      currentPassword,
      newPassword,
    },
    contentType: 'application/json',
  });

export default updateUser;
