import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {layoutColors} from '../../../constants/colors';
import BackgroundColor from '../../../components/BackgroundColor';
import LoadingButton from '../../../components/buttons/LoadingButton';
import Archivo from '../../../components/labels/Archivo';
import {FontDimensions} from '../../../components/labels/CustomText/types';

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    backgroundColor: layoutColors.white,
    shadowColor: layoutColors.black100,
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 13,
  },
});

type Props = {
  onPressButton?: () => void;
  buttonIsDisabled?: boolean;
  isLoading?: boolean;
  title: string;
  secondary?: boolean;
  paddingVertical?: number;
  buttonDisabledCoverTestID?: string;
};

export default function FooterWithButton(props: Props) {
  const {
    onPressButton,
    buttonIsDisabled = false,
    isLoading = false,
    title,
    secondary,
    paddingVertical = 10,
    buttonDisabledCoverTestID,
  } = props;

  const {bottom} = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.footer,
        {paddingTop: paddingVertical, paddingBottom: bottom || paddingVertical},
      ]}>
      <LoadingButton
        disabled={buttonIsDisabled}
        loading={isLoading}
        type={secondary ? 'outline' : 'solid'}
        onPress={onPressButton}>
        <Archivo
          fontDimensions={FontDimensions.BUTTON}
          color={layoutColors.deep100}>
          {title}
        </Archivo>
      </LoadingButton>
      {buttonIsDisabled && (
        <BackgroundColor
          testID={buttonDisabledCoverTestID}
          color={layoutColors.white}
          opacity={0.5}
        />
      )}
    </View>
  );
}
