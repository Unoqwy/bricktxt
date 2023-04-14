interface Document {
  header: DocumentHeader;
}

interface DocumentHeader {
  title: string;
  description: string;
}

export { Document, DocumentHeader };
