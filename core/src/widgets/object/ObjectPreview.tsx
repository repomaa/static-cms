import React from 'react';

import WidgetPreviewContainer from '../../components/UI/WidgetPreviewContainer';

import type { ObjectField, ObjectValue, WidgetPreviewProps } from '../../interface';

function ObjectPreview({ field }: WidgetPreviewProps<ObjectValue, ObjectField>) {
  return <WidgetPreviewContainer>{field.fields ?? null}</WidgetPreviewContainer>;
}

export default ObjectPreview;