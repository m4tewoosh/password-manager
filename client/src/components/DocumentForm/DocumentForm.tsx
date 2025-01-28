import { useState } from 'react';
import { message, Upload } from 'antd';
import type { UploadProps, UploadFile } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { saveDocument } from 'api';

import * as S from './DocumentForm.styled';

const { Dragger } = Upload;

type DocumentFormProps = {
  handleCancelModal: () => void;
  fetchDocuments: () => Promise<void>;
};

const acceptedFileTypes = [
  '.pdf',
  '.doc',
  '.docx',
  '.odt',
  '.rtf',
  '.txt',
  '.xls',
  '.xlsx',
  '.csv',
  '.ppt',
  '.pptx',
  '.odp',
  '.md',
  '.xml',
  '.json',
];

const DocumentForm = ({
  handleCancelModal,
  fetchDocuments,
}: DocumentFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const props: UploadProps = {
    name: 'file',
    multiple: false, // Only single file upload
    customRequest: ({ file }) => {
      handleUpload(file as UploadFile);
      // return Promise.resolve(); // Prevent default upload behavior
    },
    showUploadList: false, // Hide default file list
    disabled: isLoading, // Disable Dragger during upload
    beforeUpload: (file) => {
      // const isSupported = [
      //   'application/pdf',
      //   'application/msword',
      //   'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      //   'text/plain',
      // ].includes(file.type);

      // if (!isSupported) {
      //   message.error(`${file.name} is not a supported file type.`);
      //   return Upload.LIST_IGNORE;
      // }

      const isSizeValid = file.size / 1024 / 1024 < 5; // 5MB limit
      if (!isSizeValid) {
        message.error(`${file.name} exceeds the size limit of 5MB.`);
        return Upload.LIST_IGNORE;
      }

      return true; // Allow file upload
    },
    accept: acceptedFileTypes.join(','), // Optional: Restrict file types
  };

  const handleUpload = async (file: UploadFile): Promise<void> => {
    const formData = new FormData();

    // console.log(file.originFileObj);
    formData.append('file', file as Blob); // Using `originFileObj` for raw file object

    setIsLoading(true);

    try {
      await saveDocument(formData);
      await fetchDocuments();
      message.success('File uploaded successfully');
      handleCancelModal();
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Failed to upload the file');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <S.Wrapper>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </Dragger>
    </S.Wrapper>
  );
};

export default DocumentForm;
