import { useEffect, useState } from "react";
import { BackendView, BackendWrapper } from "bricktxt-core";
import DocumentWrapper from "./DocumentWrapper";

export interface DocumentViewProps {
  documentId: string;
}

export default function DocumentView(props: DocumentViewProps) {
  const [backendView, setBackendView] = useState<BackendView>();

  useEffect(() => {
    const view = BackendWrapper.get.createView(props.documentId);
    setBackendView(view);
    return () => {
      view.free();
      setBackendView(undefined);
    };
  }, [props.documentId]);

  if (backendView === undefined) {
    return null;
  }
  return <DocumentWrapper backendView={backendView} />;
}
