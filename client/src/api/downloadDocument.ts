import sendRequest from 'utils/fetchHelper';

const downloadDocument = (id: string) =>
  sendRequest({
    method: 'GET',
    endpoint: `documents/${id}`,
  });

export default downloadDocument;
