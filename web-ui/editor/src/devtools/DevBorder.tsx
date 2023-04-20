import classNames from "classnames";

export interface DevBorderProps {
  title: string;
  color: string;
  extra?: { [x: string]: any };
  className?: string;
  children: React.ReactNode;
}

export default function DevBorder(props: DevBorderProps) {
  return (
    <div
      className={classNames(props.className, "bg-white border-8 border-t-2")}
      style={{
        borderColor: props.color,
      }}
      {...props.extra}
    >
      <div
        className="w-full"
        style={{
          backgroundColor: props.color,
        }}
      >
        <span className="font-mono">{props.title}</span>
      </div>
      {props.children}
    </div>
  );
}
