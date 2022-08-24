import { useEffect, useLayoutEffect, useRef } from "react";
import { CARD_LEARN_CSS_VAR } from "../../constants";
import Card from "../Card";

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
export default function CardBase({ image, children, title, ...props }) {
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
      className="min-w-[600px]  w-[min-content] mx-auto"
      data-index={Math.random().toString(32).slice(2, 7)}
    >
      <Card className="min-h-[450px]">
        {title}
        {image && <img src={image} alt="" className="mb-4" />}
        <div className={`${image ? "pt-0" : ""} p-6`}>{children}</div>
      </Card>
    </div>
  );
}
