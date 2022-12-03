import { HTMLAttributes } from 'react';

export interface IReactProps<T extends {} = {}, H = HTMLElement>
  extends React.FC<T & Omit<HTMLAttributes<H>, keyof T>> {}

export interface IReactSetState<T>
  extends React.Dispatch<React.SetStateAction<T>> {}

export interface IBlobImage {
  file: Blob;
  width: number;
  height: number;
}

export type Valueof<T> = T[keyof T];
