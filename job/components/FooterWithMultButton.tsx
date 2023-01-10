import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {layoutColors} from '../../../constants/colors';
import LoadingButton from '../../../components/buttons/LoadingButton';
import Archivo from '../../../components/labels/Archivo';
import {FontDimensions} from '../../../components/labels/CustomText/types';
import ErrorText from '../../jobForms/components/ErrorText';

const styles = StyleSheet.create({
  container: {
    backgroundColor: layoutColors.white,
    paddingHorizontal: 20,
    shadowOffset: {height: -5, width: 0},
    shadowRadius: 12,
    shadowOpacity: 1,
    shadowColor: `rgba(${layoutColors.black100RGB}, ${
      Platform.OS === 'ios' ? 0.08 : 0.3
    })`,
    elevation: 8,
  },
  footer: {
    flexDirection: 'row',
    shadowColor: layoutColors.black100,
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 13,
  },
  secondaryButton: {marginRight: 12},
  bottomMargin7: {marginBottom: 7},
});

type Props = {
  onPressPrimaryButton?: () => void;
  primaryButtonIsDisabled?: boolean;
  primaryButtonIsLoading?: boolean;
  primaryButtonText: string;
  onPressSecondaryButton?: () => void;
  secondaryButtonIsDisabled?: boolean;
  secondaryButtonIsLoading?: boolean;
  secondaryButtonText: string;
  paddingVertical?: number;
  error?: boolean;
};

export default function FooterWithMultiButton(props: Props) {
  const {
    onPressPrimaryButton,
    onPressSecondaryButton,
    primaryButtonIsDisabled = false,
    primaryButtonIsLoading = false,
    secondaryButtonIsDisabled = false,
    secondaryButtonIsLoading = false,
    primaryButtonText,
    secondaryButtonText,
    paddingVertical = 10,
    error,
  } = props;

  const {bottom} = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <ErrorText isInvalid={Boolean(error)} style={styles.bottomMargin7}>
        There are one or more required entries that are empty. Complete the form
        to continue.
      </ErrorText>
      <View
        style={[
          styles.footer,
          {
            paddingTop: paddingVertical,
            paddingBottom: bottom || paddingVertical,
          },
        ]}>
        <LoadingButton
          style={[styles.secondaryButton]}
          disabled={secondaryButtonIsDisabled}
          loading={secondaryButtonIsLoading}
          type={'outline'}
          onPress={onPressSecondaryButton}
          borderColor={layoutColors.green20}>
          <Archivo
            fontDimensions={FontDimensions.BUTTON}
            color={layoutColors.deep100}>
            {secondaryButtonText}
          </Archivo>
        </LoadingButton>

        <LoadingButton
          disabled={primaryButtonIsDisabled}
          loading={primaryButtonIsLoading}
          type={'solid'}
          onPress={onPressPrimaryButton}>
          <Archivo
            fontDimensions={FontDimensions.BUTTON}
            color={layoutColors.deep100}>
            {primaryButtonText}
          </Archivo>
        </LoadingButton>
      </View>
    </View>
  );
}
