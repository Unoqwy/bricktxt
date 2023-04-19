import classNames from "classnames";
import { useEffect } from "react";
import { useActiveViewOverlay } from "~/hooks/useActiveView";

import styles from "./SlashActions.module.css";

export interface SlashActionsProps {
  posX: number;
  posY: number;
}

export default function SlashActions(props: SlashActionsProps) {
  const options = [
    {
      name: "Paragraph",
    },
    {
      name: "Heading 1",
    },
    {
      name: "Heading 2",
    },
    {
      name: "Heading 3",
    },
  ];

  const overlay = useActiveViewOverlay();

  useEffect(() => {
    var divergeScore = 0;

    function handleInput(event: InputEvent) {
      var eventScore = 0;
      if (event.inputType === "insertText") {
        eventScore = event.data?.length ?? 0;
      } else if (event.inputType === "deleteContentBackward") {
        eventScore = -1;
      } else {
        overlay.setFloatingNode(undefined);
        return;
      }
      if (eventScore !== 0) {
        divergeScore += eventScore;
        if (divergeScore <= 0 || divergeScore > 3) {
          overlay.setFloatingNode(undefined);
        }
      }
    }

    // typescript doing some weird things with type definitions here
    document.addEventListener("input", handleInput as (event: Event) => void);
    return () => {
      document.removeEventListener(
        "input",
        handleInput as (event: Event) => void
      );
    };
  }, []);

  return (
    <div
      className={classNames(
        styles.overlay,
        "absolute bg-white rounded-sm p-1 flex flex-col min-w-[200px] items-start"
      )}
      style={{
        top: props.posY,
        left: props.posX,
      }}
    >
      <span className="text-sm text-slate-500 w-full text-center">
        Common blocks
      </span>
      {options.map((option) => (
        <button
          key={option.name}
          className="hover:bg-slate-100 rounded-sm px-2 py-1 w-full outline-none text-left"
        >
          {option.name}
        </button>
      ))}
    </div>
  );
}
