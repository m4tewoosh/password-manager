import { model, Schema } from 'mongoose';

interface IDocument {
  userId: Schema.Types.ObjectId;
  fileName: string;
  uniqueFilename: string;
}

const documentSchema = new Schema<IDocument>({
  userId: { type: String, required: true },
  fileName: { type: String, required: true },
  uniqueFilename: { type: String, required: true },
});

const DocumentModel = model('Document', documentSchema);

export default DocumentModel;
