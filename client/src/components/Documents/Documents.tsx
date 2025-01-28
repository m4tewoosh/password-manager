import React, { useEffect, useState } from 'react';
import { Button, Input, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getDocuments } from 'api';
import { debounce } from 'utils/debounce';
import DocumentForm from 'components/DocumentForm/DocumentForm';
// import Password from 'components/Password/Password';

import * as S from './Documents.styled';
import Document from 'components/Document/Document';

const { Search } = Input;

type DocumentType = {
  id: string;
  fileName: string;
};

const Documents = () => {
  const [isNewDocumentModalOpen, setIsNewDocumentModalOpen] = useState(false);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentType[]>(
    []
  );

  const handleFilterDocuments = (value: string) => {
    const filteredDocuments = documents.filter((document) =>
      document.fileName.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredDocuments(filteredDocuments);
  };

  const handleSearch = debounce(handleFilterDocuments, 400);

  //   const handleEditPassword = (id: string) => {
  // const password = passwords.find((password) => password.id === id);

  // if (password) {
  //   setEditedPassword(password);
  //   setIsEditPasswordModalOpen(true);
  // }
  //   };

  const handleDeleteDocument = async (id: string) => {
    console.log(id);
    // await deleteDocument(id);
    await fetchDocuments();
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
      <S.Header>Documents</S.Header>

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
            // handleEdit={handleEditPassword}
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
