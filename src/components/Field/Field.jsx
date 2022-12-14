import MarkDownField from "./MarkDownField";
import NumberField from "./NumberField";
import StringField from "./StringField";
import TextareaField from "./TextareaField";

const FIELD_TYPE = {
  number: "number",
  string: "text",
  text: "textarea",
  markdown: "markdown",
};
const Field = (props) => {
  if (!(props.type in FIELD_TYPE))
    throw new Error(`Type ${props.type} doesn't exist!`);

  const caseOb = {
    [FIELD_TYPE.number]: () => <NumberField {...props} />,
    [FIELD_TYPE.string]: () => <StringField {...props} />,
    [FIELD_TYPE.text]: () => <TextareaField {...props} />,
    [FIELD_TYPE.markdown]: () => <MarkDownField {...props} />,
  };

  return caseOb[props.type]();
};

export default Field;
