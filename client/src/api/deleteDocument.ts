import sendRequest from 'utils/fetchHelper';

const deleteDocument = (id: string) =>
  sendRequest({
    method: 'DELETE',
    endpoint: `documents/${id}`,
  });

export default deleteDocument;
