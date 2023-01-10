import React, {MutableRefObject, useState} from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {layoutColors} from '../../../../constants/colors';

const styles = StyleSheet.create({
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: 'Lato-Regular',
    color: layoutColors.black100,
    backgroundColor: layoutColors.white,
  },
  focusedInput: {
    backgroundColor: layoutColors.green10,
  },
});

export type TableInputProps = TextInputProps & {
  style?: StyleProp<ViewStyle> & StyleProp<TextStyle>;
  innerRef?: MutableRefObject<TextInput>;
};

export default function TableInput(props: TableInputProps) {
  const {style, innerRef, onBlur, onFocus, ...restProps} = props;

  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      placeholderTextColor={layoutColors.black70}
      returnKeyType="next"
      autoCapitalize="none"
      onBlur={e => {
        if (onBlur) {
          onBlur(e);
        }
        setIsFocused(false);
      }}
      onFocus={e => {
        if (onFocus) {
          onFocus(e);
        }
        setIsFocused(true);
      }}
      {...restProps}
      ref={innerRef}
      style={[styles.input, style, isFocused && styles.focusedInput]}
    />
  );
}
