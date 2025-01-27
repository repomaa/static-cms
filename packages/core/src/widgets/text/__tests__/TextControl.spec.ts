/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { act, waitFor } from '@testing-library/react';

import { mockTextField } from '@staticcms/test/data/fields.mock';
import { createWidgetControlHarness } from '@staticcms/test/harnesses/widget.harness';
import TextControl from '../TextControl';

describe(TextControl.name, () => {
  const renderControl = createWidgetControlHarness(TextControl, { field: mockTextField });

  it('should render', () => {
    const { getByTestId } = renderControl({ label: 'I am a label' });

    expect(getByTestId('textarea-input')).toBeInTheDocument();

    const label = getByTestId('label');
    expect(label.textContent).toBe('I am a label');
    expect(label).toHaveClass('text-slate-500');

    const field = getByTestId('field');
    expect(field).toHaveClass('group/active');

    const fieldWrapper = getByTestId('field-wrapper');
    expect(fieldWrapper).not.toHaveClass('mr-14');

    // Text Widget uses text cursor
    expect(label).toHaveClass('cursor-text');
    expect(field).toHaveClass('cursor-text');

    // Text Widget uses default label layout, but without bottom padding on field
    expect(label).toHaveClass('px-3', 'pt-3');
    expect(field).not.toHaveClass('pb-3');
  });

  it('should render as single list item', () => {
    const { getByTestId } = renderControl({ label: 'I am a label', forSingleList: true });

    expect(getByTestId('textarea-input')).toBeInTheDocument();

    const fieldWrapper = getByTestId('field-wrapper');
    expect(fieldWrapper).toHaveClass('mr-14');
  });

  it('should only use prop value as initial value', async () => {
    const { rerender, getByTestId } = renderControl({ value: 'i am a value' });

    const inputWrapper = getByTestId('textarea-input');
    const input = inputWrapper.getElementsByTagName('textarea')[0];
    expect(input).toHaveValue('i am a value');

    rerender({ value: 'i am a new value' });
    expect(input).toHaveValue('i am a value');
  });

  it('should use prop value exclusively if field is i18n duplicate', async () => {
    const { rerender, getByTestId } = renderControl({
      field: { ...mockTextField, i18n: 'duplicate' },
      duplicate: true,
      value: 'i am a value',
    });

    const inputWrapper = getByTestId('textarea-input');
    const input = inputWrapper.getElementsByTagName('textarea')[0];
    expect(input).toHaveValue('i am a value');

    rerender({ value: 'i am a new value' });
    expect(input).toHaveValue('i am a new value');
  });

  it('should call onChange when text input changes', async () => {
    const {
      getByTestId,
      props: { onChange },
    } = renderControl();

    const inputWrapper = getByTestId('textarea-input');
    const input = inputWrapper.getElementsByTagName('textarea')[0];

    await act(async () => {
      await userEvent.type(input, 'I am some text');
    });

    expect(onChange).toHaveBeenCalledTimes(0);

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenLastCalledWith('I am some text');
    });
  });

  it('should show error', async () => {
    const { getByTestId } = renderControl({
      errors: [{ type: 'error-type', message: 'i am an error' }],
    });

    const error = getByTestId('error');
    expect(error.textContent).toBe('i am an error');

    const field = getByTestId('field');
    expect(field).not.toHaveClass('group/active');

    const label = getByTestId('label');
    expect(label).toHaveClass('text-red-500');
  });

  it('should focus input on field click', async () => {
    const { getByTestId } = renderControl();

    const inputWrapper = getByTestId('textarea-input');
    const input = inputWrapper.getElementsByTagName('textarea')[0];
    expect(input).not.toHaveFocus();

    await act(async () => {
      const field = getByTestId('field');
      await userEvent.click(field);
    });

    expect(input).toHaveFocus();
  });

  it('should disable input if disabled', async () => {
    const { getByTestId } = renderControl({ disabled: true });

    const inputWrapper = getByTestId('textarea-input');
    const input = inputWrapper.getElementsByTagName('textarea')[0];
    expect(input).toBeDisabled();
  });
});
