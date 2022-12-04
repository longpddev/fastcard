'use client';

import MarkDownField from './MarkDownField';
import NumberField from './NumberField';
import SelectField from './SelectField';
import StringField from './StringField';
import TextareaField from './TextareaField';
import { IReactProps } from '@/interfaces/common';

const FIELD_TYPE = {
  number: 'number',
  string: 'text',
  text: 'textarea',
  markdown: 'markdown',
  select: 'select',
};
const Field: IReactProps<{
  type: keyof typeof FIELD_TYPE;
  label: string;
  onChange: (v: string) => void;
  value: string;
  options: Array<[string, string]>;
}> = ({ type, options, ...props }) => {
  if (!(type in FIELD_TYPE)) throw new Error(`Type ${type} doesn't exist!`);

  const caseOb = {
    [FIELD_TYPE.number]: () => <NumberField {...props} />,
    [FIELD_TYPE.string]: () => <StringField {...props} />,
    [FIELD_TYPE.text]: () => <TextareaField {...props} />,
    [FIELD_TYPE.markdown]: () => <MarkDownField {...props} />,
    [FIELD_TYPE.select]: () => <SelectField {...props} options={options} />,
  };

  return caseOb[type]();
};

export default Field;
