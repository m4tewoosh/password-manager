import sendRequest from 'utils/fetchHelper';

const getDocuments = () =>
  sendRequest({
    method: 'GET',
    endpoint: 'documents',
  });

export default getDocuments;
