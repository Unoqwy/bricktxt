import DocumentView from "~/components/document/DocumentView";
import DevBorder from "./devtools/DevBorder";
import DevTools from "./devtools/DevTools";

export default function App() {
  return (
    <>
      <DevBorder color="#f1f5f9" title="Editor">
        <div className="w-full bg-white py-4 px-12">
          <DocumentView documentId="test-doc" />
        </div>
      </DevBorder>
      <DevTools />
    </>
  );
}
