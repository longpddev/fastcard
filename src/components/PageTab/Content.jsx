import { useContext } from "./context";

const Content = ({ tabKey, children }) => {
  const { tabActive, typeStep, handle } = useContext();
  const isActive = tabKey === tabActive;

  return isActive ? (
    <>
      {children}

      {typeStep && (
        <div className="flex justify-between mt-6">
          {handle.current.isPrev() ? (
            <button
              className="text-amber-400 button"
              onClick={() => handle.current.prev()}
            >
              prev
            </button>
          ) : (
            <span></span>
          )}
          {handle.current.isNext() ? (
            <button
              className="text-green-400 button"
              onClick={() => handle.current.next()}
            >
              next
            </button>
          ) : (
            <span></span>
          )}
        </div>
      )}
    </>
  ) : null;
};

export default Content;
