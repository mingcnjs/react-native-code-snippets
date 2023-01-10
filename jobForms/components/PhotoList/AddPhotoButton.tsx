import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import AddIcon2 from '../../../../assets/icons/AddIcon2';
import {layoutColors} from '../../../../constants/colors';
import ErrorText from '../ErrorText';

const styles = StyleSheet.create({
  addPhotoButton: {
    width: 94,
    aspectRatio: 1,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderColor: layoutColors.black20,
  },
  colorBorderRed: {borderColor: layoutColors.red3},
});

type Props = {
  onPress?: () => void;
  isInvalid?: boolean;
  disabled?: boolean;
};

export default function AddPhotoButton(props: Props) {
  const {onPress, isInvalid, disabled = false} = props;

  return (
    <View>
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        activeOpacity={0.6}
        style={[
          styles.addPhotoButton,
          Boolean(isInvalid) && styles.colorBorderRed,
        ]}>
        <AddIcon2 fill={layoutColors.black100} size={22} />
      </TouchableOpacity>
      <ErrorText isInvalid={Boolean(isInvalid)}>
        A picture is required
      </ErrorText>
    </View>
  );
}
