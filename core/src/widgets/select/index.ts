import controlComponent from './SelectControl';
import previewComponent from './SelectPreview';
import schema from './schema';
import { validateMinMax } from '../../lib/widgets/validations';

import type { SelectField, WidgetParam } from '../../interface';

const SelectWidget = (): WidgetParam<string | number | (string | number)[], SelectField> => {
  return {
    name: 'select',
    controlComponent,
    previewComponent,
    options: {
      validator: ({ field, value, t }) => {
        const min = field.min;
        const max = field.max;

        if (!field.multiple || typeof value === 'string') {
          return false;
        }

        const error = validateMinMax(t, field.label ?? field.name, value, min, max);

        return error ? error : false;
      },
      schema,
    },
  };
};

export default SelectWidget;