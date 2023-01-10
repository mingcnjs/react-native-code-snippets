import React, {useEffect, useState} from 'react';
import {
  FontDimensions,
  FontWeights,
} from '../../../components/labels/CustomText/types';
import {StyleSheet, View} from 'react-native';
import Lato from '../../../components/labels/Lato';
import {layoutColors} from '../../../constants/colors';
import StyledInput from '../../../components/StyledInput';
import {FormFieldComponentProps} from '../../../types/jobForm';
import Archivo from '../../../components/labels/Archivo';
import ErrorText from './ErrorText';

const styles = StyleSheet.create({
  inputs: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 45,
    paddingTop: 22,
  },
  input: {flex: 1},
  inputText: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Archivo-SemiBold',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  label: {
    position: 'absolute',
    top: -22,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  rightMargin15: {marginRight: 15},
  colorBorderRed: {borderColor: layoutColors.red3},
});

export default function HourInput(props: FormFieldComponentProps) {
  const {formField, isInvalid, setField, readonly} = props;
  console.log(isInvalid);

  useEffect(() => {
    try {
      if (formField.value) {
        const {hours = 0, minutes = 0} = JSON.parse(formField.value);
        setHours(hours.toString());
        setMinutes(minutes.toString());
      }
    } catch (e) {
      console.log(e);
    }
  }, [formField.value]);

  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  function onSetField() {
    setField(
      formField.type,
      formField.title,
      JSON.stringify({
        hours: hours ? Number(hours) : 0,
        minutes: minutes ? Number(minutes) : 0,
      }),
    );
  }

  return (
    <>
      <View style={styles.inputs}>
        <View style={styles.input}>
          <StyledInput
            editable={!readonly}
            value={hours}
            onChangeText={text => setHours(Number(text).toString())}
            inputContainerStyle={[
              styles.input,
              styles.rightMargin15,
              isInvalid && styles.colorBorderRed,
            ]}
            placeholder={'0'}
            placeholderTextColor={layoutColors.black60}
            style={styles.inputText}
            keyboardType={'number-pad'}
            returnKeyType={'done'}
            onBlur={onSetField}
            error={isInvalid}
            onEndEditing={onSetField}
          />
          <Archivo
            fontDimensions={FontDimensions.CALLOUT1}
            fontWeight={FontWeights.BOLD}
            color={layoutColors.black60}
            style={styles.label}>
            Hours
          </Archivo>
        </View>
        <Lato
          fontDimensions={FontDimensions.BODY1}
          fontWeight={FontWeights.BOLD}
          style={styles.rightMargin15}>
          :
        </Lato>
        <View style={styles.input}>
          <StyledInput
            editable={!readonly}
            value={minutes}
            onChangeText={text => {
              let numberMinutes = Number(text);
              if (isNaN(numberMinutes)) {
                numberMinutes = 0;
              } else if (numberMinutes > 60) {
                numberMinutes = 60;
              }
              setMinutes(numberMinutes.toString());
            }}
            error={isInvalid}
            inputContainerStyle={[
              styles.input,
              styles.rightMargin15,
              isInvalid && styles.colorBorderRed,
            ]}
            placeholder={'0'}
            placeholderTextColor={layoutColors.black60}
            style={styles.inputText}
            textAlignVertical={'top'}
            keyboardType={'number-pad'}
            returnKeyType={'done'}
            onBlur={onSetField}
            onEndEditing={onSetField}
          />
          <Archivo
            fontDimensions={FontDimensions.CALLOUT1}
            fontWeight={FontWeights.BOLD}
            color={layoutColors.black60}
            style={styles.label}>
            Minutes
          </Archivo>
        </View>
      </View>
      <ErrorText isInvalid={Boolean(isInvalid)}>
        Estimate of time is required
      </ErrorText>
    </>
  );
}
