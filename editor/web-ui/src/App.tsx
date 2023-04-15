import { useEffect } from "react";
import Document from "./components/document/Document";
import { useDocumentStore } from "./store/document";

import backend from "./backend";

export default function App() {
  const setContent = useDocumentStore((state) => state.setContent);

  useEffect(() => {
    setContent(backend().get_content());
  }, []);

  return <Document />;
}
