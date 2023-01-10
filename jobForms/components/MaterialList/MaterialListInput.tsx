import React, {useEffect, useState} from 'react';
import QuoteAndMaterialTable from './QuoteAndMaterialTable';
import {FormFieldComponentProps, FormQuote} from '../../../../types/jobForm';

export default function MaterialListInput(props: FormFieldComponentProps) {
  const {formField, isInvalid, setField, readonly} = props;

  const [quote, setQuote] = useState<FormQuote>();

  useEffect(() => {
    try {
      setQuote(
        JSON.parse(
          formField.value ||
            JSON.stringify([{name: 'Labor in Total', value: 0}]),
        ),
      );
    } catch (e) {
      console.log(e);
    }
  }, [formField.value]);

  if (quote) {
    return (
      <QuoteAndMaterialTable
        items={quote || []}
        error={isInvalid}
        setField={setField}
        formField={formField}
        readonly={readonly}
      />
    );
  }
  return null;
}
