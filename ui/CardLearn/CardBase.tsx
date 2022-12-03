'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { CARD_LEARN_CSS_VAR } from '@/constants/index';
import Card from '../Card';
import LoadingIcon from '../LoadingIcon';
import Markdown from '../Markdown';
import { IReactProps } from '@/interfaces/common';

const publicHeightCard = (() => {
  let prev: number | null = null;
  return (height: number) => {
    if (!height) return;
    if (height !== prev || prev === null) {
      document.body.style.setProperty(CARD_LEARN_CSS_VAR, `${height}px`);
    }
    prev = height;
  };
})();

export interface ICardBaseProps {
  image?: string;
  title: JSX.Element;
  width?: number;
  height?: number;
}
const CardBase: IReactProps<ICardBaseProps> = ({
  image,
  children,
  title,
  width,
  height,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver(() => {
      const height = element.offsetHeight;
      publicHeightCard(height);
    });
    resizeObserver.observe(element);

    return () => {
      resizeObserver.unobserve(element);
    };
  }, [ref.current]);

  return (
    <div
      ref={ref}
      className="mx-auto w-[min-content]  min-w-[90vw] md:min-w-[600px]"
      data-index={Math.random().toString(32).slice(2, 7)}
    >
      <Card className="min-h-[350px]">
        {title}
        {image && (
          <div className="relative mb-4 min-h-[250px] overflow-hidden">
            <div
              className="absolute inset-0 z-0 h-full w-full"
              style={{
                background: `url(${image}) center center / cover no-repeat`,
                filter: 'blur(20px)',
              }}
            ></div>
            <Image
              src={image}
              alt=""
              className="absolute top-0 bottom-0 left-1/2 z-10 h-full translate-x-[-50%]"
              style={{ aspectRatio: `${width}/${height}` }}
            />
          </div>
        )}
        <div className={`${image ? 'pt-0' : ''} p-6`}>
          <Markdown>{children}</Markdown>
        </div>
      </Card>
    </div>
  );
};

const Image: IReactProps<{
  src: string;
  alt: string;
}> = ({ ...props }) => {
  const [loaded, loadedSet] = useState(false);
  return (
    <>
      <div
        style={{
          transition: loaded
            ? 'opacity 0s 0s linear'
            : 'opacity 0.3s 0.2s linear',
          opacity: loaded ? 0 : 1,
        }}
        className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
      >
        <LoadingIcon className="animate-spin text-2xl text-sky-400 "></LoadingIcon>
      </div>
      <img
        style={{ opacity: loaded ? 1 : 0 }}
        onLoad={() => loadedSet(true)}
        {...props}
      />
    </>
  );
};

export default CardBase;
