import type { HTMLAttributes } from 'react';

export interface IReactProps<T extends {} | null = null, H = HTMLElement>
  extends React.FC<
    T extends null
      ? HTMLAttributes<H>
      : T & Omit<HTMLAttributes<H>, keyof (T extends null ? {} : T)>
  > {}

export type IReactChainComponentProps<
  T extends {} = {},
  H = HTMLElement,
  CE extends Record<
    Exclude<
      string,
      'propTypes' | 'contextTypes' | 'defaultProps' | 'displayName'
    >,
    unknown
  > = {},
> = CE & IReactProps<T, H>;
export interface IReactSetState<T>
  extends React.Dispatch<React.SetStateAction<T>> {}

export interface IBlobImage {
  file: Blob;
  width: number;
  height: number;
}

export interface ICroppedImage extends IBlobImage {
  fileName: string;
  extension: 'png';
}

export type Valueof<T> = T[keyof T];

export type PropsType<T extends (props: any) => any> = T extends (
  props: infer R,
) => any
  ? R
  : never;

type test = IReactProps<{ long: string }>;

type result = test extends IReactProps<{}> ? 'true' : 'false';
