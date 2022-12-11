'use client';

import TooltipShortCutItem from './TooltipShortCutItem';
import { clsx } from 'clsx';
import { IReactProps } from '@/interfaces/common';

interface ITooltipShortCutProps {
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  x: number;
  y: number;
  left: number;
  keyName: string;
  specialKey: string | undefined;
  onActive: (s: boolean) => void;
  active: boolean;
}
const TooltipShortCut: IReactProps<ITooltipShortCutProps> = ({
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
      className={clsx('absolute transition-all', {
        'opacity-10': !active,
        'opacity-100': active,
      })}
      style={{
        top: `${y}px`,
        left: `${x}px`,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 z-[-1] bg-sky-400 opacity-50 hover:opacity-80"
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
