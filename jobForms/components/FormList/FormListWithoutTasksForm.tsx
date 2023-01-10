import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {FormsComponentProps} from './types';

export function FormListWithoutTasksForm(props: FormsComponentProps) {
  const {values, scrollViewRef, renderFormField, FormListHeader, style} = props;

  return (
    <KeyboardAwareScrollView
      automaticallyAdjustContentInsets={false}
      keyboardShouldPersistTaps="handled"
      enableResetScrollToCoords={false}
      enableOnAndroid
      style={style}
      innerRef={ref => {
        // @ts-expect-error this is the recommended way
        scrollViewRef.current = ref;
      }}
      showsVerticalScrollIndicator={false}>
      {FormListHeader}

      {values.map(renderFormField)}
    </KeyboardAwareScrollView>
  );
}
