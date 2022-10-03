import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { CARD_LEARN_CSS_VAR } from "../../constants";
import Card from "../Card";
import LoadingIcon from "../LoadingIcon";
import Markdown from "../Markdown";
const run = (callback) => callback();

const publicHeightCard = run(() => {
  let prev = null;
  return (height) => {
    if (!height) return;
    if (height > prev || prev === null) {
      document.body.style.setProperty(CARD_LEARN_CSS_VAR, `${height}px`);
    }
    prev = height;
  };
});
export default function CardBase({
  image,
  children,
  title,
  width,
  height,
  ...props
}) {
  const ref = useRef();
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
      className="min-w-[90vw] md:min-w-[600px]  w-[min-content] mx-auto"
      data-index={Math.random().toString(32).slice(2, 7)}
    >
      <Card className="min-h-[350px]">
        {title}
        {image && (
          <div className="relative min-h-[250px] overflow-hidden mb-4">
            <div
              className="absolute inset-0 w-full h-full z-0"
              style={{
                background: `url(${image}) center center / cover no-repeat`,
                filter: "blur(20px)",
              }}
            ></div>
            <Image
              src={image}
              alt=""
              className="absolute top-0 bottom-0 h-full left-1/2 translate-x-[-50%] z-10"
              style={{ aspectRatio: `${width}/${height}` }}
            />
          </div>
        )}
        <div className={`${image ? "pt-0" : ""} p-6`}>
          <Markdown>{children}</Markdown>
        </div>
      </Card>
    </div>
  );
}

const Image = ({ ...props }) => {
  const [loaded, loadedSet] = useState(false);
  return (
    <>
      <div
        style={{
          transition: loaded
            ? "opacity 0s 0s linear"
            : "opacity 0.3s 0.2s linear",
          opacity: loaded ? 0 : 1,
        }}
        className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
      >
        <LoadingIcon className="animate-spin text-sky-400 text-2xl "></LoadingIcon>
      </div>
      <img
        style={{ opacity: loaded ? 1 : 0 }}
        onLoad={() => loadedSet(true)}
        {...props}
      />
    </>
  );
};
