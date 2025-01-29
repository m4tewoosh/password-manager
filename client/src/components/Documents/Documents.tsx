import React, { useEffect, useState } from 'react';
import { Typography, Button, Input, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { deleteDocument, getDocuments } from 'api';
import { debounce } from 'utils/debounce';
import DocumentForm from 'components/DocumentForm/DocumentForm';
import Document from 'components/Document/Document';

import { DocumentType } from 'types/document';
import * as S from './Documents.styled';

const { Search } = Input;

const Documents = () => {
  const [isNewDocumentModalOpen, setIsNewDocumentModalOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentType[]>(
    []
  );

  const handleFilterDocuments = (value: string) => {
    const filteredDocuments = documents.filter((document) =>
      document.readableFilename.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredDocuments(filteredDocuments);
  };

  const handleSearch = debounce(handleFilterDocuments, 400);

  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteDocument(id);
      await fetchDocuments();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const documents = await getDocuments();

      setDocuments(documents);
      setFilteredDocuments(documents);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <S.Wrapper>
      <Typography.Title level={2} style={{ marginBottom: '32px' }}>
        Documents
      </Typography.Title>

      <Button
        onClick={() => setIsNewDocumentModalOpen(true)}
        size="large"
        type="primary"
      >
        Add new
        <PlusOutlined />
      </Button>

      <Search
        onSearch={handleSearch}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleSearch(e.target.value)
        }
        placeholder="Find document"
        style={{ width: 200 }}
      />

      <S.DocumentsWrapper>
        {filteredDocuments.map((document, index) => (
          <Document
            key={index}
            document={document}
            handleDelete={handleDeleteDocument}
          />
        ))}
      </S.DocumentsWrapper>

      <Modal
        title="Add New Document"
        open={isNewDocumentModalOpen}
        onCancel={() => setIsNewDocumentModalOpen(false)}
        footer={null}
      >
        <DocumentForm
          handleCancelModal={() => setIsNewDocumentModalOpen(false)}
          fetchDocuments={fetchDocuments}
        />
      </Modal>
    </S.Wrapper>
  );
};

export default Documents;
