import { useEffect } from "react";
import Document from "./components/document/Document";
import { useDocumentStore } from "./store/document";

export default function App() {
  const setContent = useDocumentStore((state) => state.setContent);

  useEffect(() => {
    setContent([
      {
        id: "id-1",
        type: "paragraph",
        text: "Hello",
      },
      {
        id: "id-2",
        type: "paragraph",
        text: "Second Paragraph",
      },
      {
        id: "id-3",
        type: "paragraph",
        text: "Third Value",
      },
      {
        id: "id-4",
        type: "paragraph",
        text: "Lorem",
      },
      {
        id: "id-5",
        type: "paragraph-2",
        text: "Ipsum",
      },
      {
        id: "id-6",
        type: "paragraph-2",
        text: "Dolor",
      },
      {
        id: "id-7",
        type: "paragraph-2",
        text: "Sit",
      },
      {
        id: "id-8",
        type: "paragraph-2",
        text: "Amet",
      },
    ]);
  }, []);

  return <Document />;
}
