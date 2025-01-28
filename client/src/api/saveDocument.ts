import sendRequest from 'utils/fetchHelper';

const saveDocument = (file: FormData) => {
  return sendRequest({
    method: 'POST',
    endpoint: 'documents',
    body: file,
  });
};

export default saveDocument;
