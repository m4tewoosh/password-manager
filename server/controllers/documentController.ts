import { Request, Response } from 'express';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
import { randomUUID } from 'crypto';
import Document from '../models/document';
import User from '../models/user';
import path from 'path';
import sanitize from 'sanitize-filename';

type RequestUser = {
  email: string;
  id: string;
};

interface IGetUserAuthInfoRequest extends Request {
  user: RequestUser;
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

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

const saveDocument = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const {
      file,
      user: { id },
    } = req;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (!acceptedFileTypes.includes(fileExtension)) {
      return res.status(400).json({ error: 'File type not supported' });
    }

    //sanitize originalname with @sanitize-filename
    const sanitizedFilename = sanitize(file.originalname);

    const filenameWithNonASCIICharacters = Buffer.from(
      sanitizedFilename,
      'latin1'
    ).toString('utf8');

    const uniqueFilename = `${randomUUID()}-${sanitizedFilename}`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uniqueFilename,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);

    const newDocument = await Document.create({
      userId: id,
      fileName: sanitizedFilename,
      readableFilename: filenameWithNonASCIICharacters,
      uniqueFilename,
    });

    return res.status(201).json(newDocument);
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'An error occurred.' });
  }
};

const getAllDocuments = async (req: IGetUserAuthInfoRequest, res: Response) => {
  try {
    const { id } = req.user;

    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({
        // 404: Bad request
        error: 'Bad request',
      });
    }

    const documents = await Document.find(
      { userId: id },
      { readableFilename: 1, id: 1 }
    );

    res.status(200).json(documents); // 200: OK
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const downloadDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const document = await Document.findOne({ _id: id });

    if (!document) {
      return res.status(404).json({
        // 404: Bad request
        error: 'Document not found',
      });
    }

    const { uniqueFilename } = document;

    const downloadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uniqueFilename,
      ResponseContentDisposition: `attachment; filename="${document.fileName}"`,
    };

    const command = new GetObjectCommand(downloadParams);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 10 });

    res.status(200).json({ url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const document = await Document.findOne({ _id: id });

    if (!document) {
      return res.status(404).json({
        // 404: Bad request
        error: 'Document not found',
      });
    }

    const { uniqueFilename } = document;

    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: uniqueFilename,
    };

    const command = new DeleteObjectCommand(deleteParams);
    await s3Client.send(command);

    await Document.findByIdAndDelete(id);

    res.status(200).json({ message: 'Successfully deleted document' }); // 200: OK
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

module.exports = {
  saveDocument,
  getAllDocuments,
  downloadDocument,
  deleteDocument,
};
