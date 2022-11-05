import TooltipShortCutItem from "./TooltipShortCutItem";
import { clsx } from "clsx";

const TooltipShortCut = ({
  width,
  height,
  top,
  right,
  bottom,
  x,
  y,
  left,
  keyName,
  specialKey,
  onActive,
  active,
}) => {
  return (
    <div
      className={clsx("absolute transition-all", {
        "opacity-10": !active,
        "opacity-100": active,
      })}
      style={{
        top: `${y}px`,
        left: `${x}px`,
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none z-[-1] bg-sky-400 opacity-50 hover:opacity-80"
        style={{ width: `${width}px`, height: `${height}px` }}
      ></div>
      <TooltipShortCutItem
        specialKey={specialKey}
        anchorWidth={width}
        anchorHeight={height}
        keyName={keyName}
        onActive={onActive}
      />
    </div>
  );
};

export default TooltipShortCut;
