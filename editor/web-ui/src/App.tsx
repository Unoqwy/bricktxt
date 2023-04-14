import { useEffect } from "react";
import Document from "./components/document/Document";
import { useDocumentStore } from "./store/document";

import { get_content } from "bricktxt-web-wasm";

export default function App() {
  const setContent = useDocumentStore((state) => state.setContent);

  useEffect(() => {
    setContent(get_content());
  }, []);

  return <Document />;
}
