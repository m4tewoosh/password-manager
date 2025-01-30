import {
  FileOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
  FileMarkdownOutlined,
  FilePptOutlined,
  FileTextOutlined,
  FileWordOutlined,
} from '@ant-design/icons';

export const getDocumentIcon = (filename: string) => {
  const fileExtension = filename.split('.').pop();

  switch (fileExtension) {
    case 'pdf':
      return FilePdfOutlined;
    case 'doc':
    case 'docx':
    case 'odt':
    case 'rtf':
      return FileWordOutlined;
    case 'txt':
      return FileTextOutlined;
    case 'xls':
    case 'xlsx':
    case 'csv':
      return FileExcelOutlined;
    case 'ppt':
    case 'pptx':
    case 'odp':
      return FilePptOutlined;
    case 'md':
      return FileMarkdownOutlined;
    case 'xml':
    case 'json':
      return FileTextOutlined;
    default:
      return FileOutlined;
  }
};
