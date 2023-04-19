import DevBorder from "./DevBorder";
import { useDevTools } from "./useDevTools";

export default function DevTools() {
  const { set: setFlags, ...flags } = useDevTools();

  return (
    <DevBorder color="#ffedd5" title="DevTools">
      <div className="p-2">
        <button
          className="bg-orange-50 rounded px-2 py-1"
          onClick={() => setFlags({ highlightBlocks: !flags.highlightBlocks })}
        >
          Highlight Blocks: {flags.highlightBlocks ? "Yes" : "No"}
        </button>
      </div>
    </DevBorder>
  );
}
