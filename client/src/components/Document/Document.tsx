// import { message } from 'antd';
import { red, gray } from '@ant-design/colors';

import {
  FilePdfOutlined,
  DownloadOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import * as S from './Document.styled';
import { downloadDocument } from 'api';

type Document = {
  _id: string;
  fileName: string;
};

type DocumentProps = {
  document: Document;
  handleDelete: (id: string) => void;
};

const Document = ({
  document,
}: // handleDelete
DocumentProps) => {
  const {
    // id,
    fileName,
  } = document;

  const handleDeleteDocument = async () => {
    console.log('Deleting document...');
    //   handleDelete(id);
    //   message.success('Document successfully deleted');
  };

  const handleDownloadDocument = async () => {
    const { url } = await downloadDocument(document._id);

    console.log(fileName);

    if (url) {
      const link = window.document.createElement('a');
      link.href = url;
      link.download = fileName;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }

    //   message.success('Document successfully deleted');
  };

  return (
    <S.Wrapper>
      <S.DataWrapper>
        {/* {faviconUrl ? <S.WebsiteIcon src={faviconUrl} /> : <GlobalOutlined />} */}
        <FilePdfOutlined />
        <S.DocumentName>{fileName}</S.DocumentName>
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
