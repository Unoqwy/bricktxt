import DocumentView from "~/components/document/DocumentView";
import DevBorder from "./devtools/DevBorder";
import DevTools from "./devtools/DevTools";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <DevBorder
        color="#f1f5f9"
        title="Editor"
        className="grow"
        extra={{
          ["data-select-root"]: true,
        }}
      >
        <div className="w-full h-full bg-white py-4 px-12">
          <DocumentView documentId="test-doc" />
        </div>
      </DevBorder>
      <DevTools />
    </div>
  );
}
