'use client';

import React from 'react';
import { IReactProps, PropsType } from '@/interfaces/common';

type Chidlren = PropsType<IReactProps>['children'];
const When = <Tn,>({
  component,
  if: condition,
  children,
  render,
  props,
}: {
  component?: Tn;
  render?: () => any;
  children?: (() => Chidlren) | Chidlren;
  if: boolean;
  props?: Tn extends (props: any) => any
    ? Omit<PropsType<Tn>, 'children'>
    : never;
}): ReturnType<IReactProps> => {
  if (!condition) return null;
  const childrenIdFn = typeof children === 'function';

  const Component = component as unknown as IReactProps;
  if (Component) {
    return (
      <Component {...props}>{childrenIdFn ? children() : children}</Component>
    );
  } else {
    return (
      <React.Fragment>{childrenIdFn ? children() : children}</React.Fragment>
    );
  }
};

export default When;
