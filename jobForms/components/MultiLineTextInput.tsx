import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import TextArea from '../../../components/TextArea';
import {FormFieldComponentProps} from '../../../types/jobForm';

const styles = StyleSheet.create({
  bottomMargin10: {marginBottom: 10},
});

export default function MultiLineTextInput(props: FormFieldComponentProps) {
  const {formField, setField, readonly} = props;

  const {value: originalText} = formField;
  const [value, setValue] = useState(
    JSON.parse(originalText || JSON.stringify({text: ''})).text,
  );

  function onEndEditing() {
    const formatted = {text: value};
    setField(formField.type, formField.title, JSON.stringify(formatted));
  }

  return (
    <TextArea
      editable={!readonly}
      value={value}
      onChangeText={v => {
        setValue(v);
        onEndEditing();
      }}
      style={styles.bottomMargin10}
      placeholder={'Anything else you’d like to note?'}
      returnKeyType={'next'}
      onBlur={onEndEditing}
      onEndEditing={onEndEditing}
    />
  );
}
