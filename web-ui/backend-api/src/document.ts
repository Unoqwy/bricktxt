export interface Document {
  id: string;
  title: string;
  content: Block[];
}

export interface Block {
  id: string;
  type: string;
  text: string;
}
