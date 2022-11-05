import { createPortal } from "react-dom";

const OutsideTheApp = ({ children }) => createPortal(children, document.body);

export default OutsideTheApp;
