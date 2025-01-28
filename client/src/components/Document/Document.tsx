import { message, Tooltip } from 'antd';
import { red, gray } from '@ant-design/colors';
import {
  FilePdfOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { downloadDocument } from 'api';

import { DocumentType } from 'types/document';
import * as S from './Document.styled';

type DocumentProps = {
  document: DocumentType;
  handleDelete: (id: string) => void;
};

const Document = ({ document, handleDelete }: DocumentProps) => {
  const { _id, readableFilename } = document;

  const handleDeleteDocument = async () => {
    handleDelete(_id);
    message.success('Successfully deleted document');
  };

  const handleDownloadDocument = async () => {
    const { url } = await downloadDocument(_id);

    if (url) {
      const link = window.document.createElement('a');
      link.href = url;
      link.download = readableFilename;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  };

  return (
    <S.Wrapper>
      <S.DataWrapper>
        <FilePdfOutlined />
        <Tooltip title={readableFilename}>
          <S.DocumentName>{readableFilename}</S.DocumentName>
        </Tooltip>
      </S.DataWrapper>

      <S.ActionsWrapper>
        <button onClick={handleDownloadDocument}>
          <DownloadOutlined style={{ color: gray[6] }} />
        </button>
        <button onClick={handleDeleteDocument}>
          <DeleteOutlined style={{ color: red[6] }} />
        </button>
      </S.ActionsWrapper>
    </S.Wrapper>
  );
};

export default Document;
