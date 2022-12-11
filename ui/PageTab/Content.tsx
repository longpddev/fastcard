'use client';

import { IReactProps } from '@/interfaces/common';
import { useContext } from './context';

const Content: IReactProps<{
  tabKey: string;
}> = ({ tabKey, children }) => {
  const { tabActive, typeStep, handle, onSubmit } = useContext();
  const isActive = tabKey.toString() === tabActive;

  return isActive ? (
    <>
      {children}

      {typeStep && (
        <div className="mt-6 flex justify-between">
          {handle.current.isPrev() ? (
            <button
              className="button text-amber-400"
              onClick={() => handle.current.prev()}
            >
              prev
            </button>
          ) : (
            <span></span>
          )}
          {handle.current.isNext() ? (
            <button
              className="button text-green-400"
              onClick={() => handle.current.next()}
            >
              next
            </button>
          ) : (
            <button
              className="button text-green-400"
              onClick={() => onSubmit && onSubmit()}
            >
              {' '}
              Submit{' '}
            </button>
          )}
        </div>
      )}
    </>
  ) : null;
};

export default Content;
