import classNames from "classnames";

import styles from "./SlashActions.module.css";

export interface SlashActionsProps {
  posX: number;
  posY: number;
}

export default function SlashActions(props: SlashActionsProps) {
  const options = [
    {
      name: "Header",
    },
    {
      name: "Paragraph",
    },
  ];

  return (
    <div
      className={classNames(
        styles.overlay,
        "absolute bg-white rounded-sm p-1 flex flex-col min-w-[100px] items-start"
      )}
      style={{
        top: props.posY,
        left: props.posX,
      }}
    >
      {options.map((option) => (
        <button
          key={option.name}
          className="hover:bg-gray-100 rounded-sm px-2 py-1 w-full outline-none"
        >
          {option.name}
        </button>
      ))}
    </div>
  );
}
