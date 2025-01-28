import sendRequest from 'utils/fetchHelper';

const saveDocument = (file: FormData) => {
  console.log(file.get('file'));

  return sendRequest({
    method: 'POST',
    endpoint: 'documents',
    body: file,
  });
};

export default saveDocument;
