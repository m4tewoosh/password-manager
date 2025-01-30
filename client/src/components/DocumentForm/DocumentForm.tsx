import { useState } from 'react';
import { message, Upload } from 'antd';
import type { UploadProps } from 'antd';
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
    multiple: false,
    customRequest: ({ file }) => {
      handleUpload(file as Blob);
    },
    showUploadList: false,
    disabled: isLoading,
    beforeUpload: (file) => {
      const isSizeValid = file.size / 1024 / 1024 < 10; // 10MB limit
      if (!isSizeValid) {
        message.error(`${file.name} exceeds the size limit of 5MB.`);
        return Upload.LIST_IGNORE;
      }

      return true;
    },
    accept: acceptedFileTypes.join(','),
  };

  const handleUpload = async (file: Blob) => {
    const formData = new FormData();

    formData.append('file', file);

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
          Support for a single upload.
          <br />
          Strictly prohibited from uploading company data or other banned files.
        </p>
      </Dragger>
    </S.Wrapper>
  );
};

export default DocumentForm;
