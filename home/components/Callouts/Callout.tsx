import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {layoutColors} from '../../../../constants/colors';
import {
  FontDimensions,
  FontWeights,
} from '../../../../components/labels/CustomText/types';
import Archivo from '../../../../components/labels/Archivo';
import CloseIcon from '../../../../assets/icons/CloseIcon';
import {CalloutProps} from './types';
import {getPointerStyles} from './utils';
import CalloutPointer from './CalloutPointer';

const styles = StyleSheet.create({
  callout: {
    position: 'absolute',
    backgroundColor: layoutColors.green100,
    padding: 16,
    borderRadius: 24,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowRadius: 8,
    shadowOpacity: 1,
    shadowColor: `rgba(${layoutColors.black100RGB}, 0.4)`,
    elevation: 6,
  },
  calloutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  closeButton: {
    width: 24,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutContent: {
    marginRight: 32,
    marginBottom: 16,
  },
  calloutFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calloutFooterButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 50,
    backgroundColor: layoutColors.green40,
  },
  pointer: {
    position: 'absolute',
    height: 10,
    width: 24,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightMargin8: {marginRight: 8},
  rightMargin16: {marginRight: 16},
  rightMargin32: {marginRight: 32},
});

export default function Callout(props: CalloutProps) {
  const {
    style,
    title,
    titleFontDimension = FontDimensions.HEADLINE,
    titleFontWeight = FontWeights.BOLD,
    content,
    contentFontDimension = FontDimensions.BUTTON1,
    contentFontWeight = FontWeights.REGULAR,
    footerButtonFontDimension = FontDimensions.BUTTON1,
    leftButtonText = 'Previous',
    rightButtonText = 'Continue',
    onPressLeft,
    onPressRight,
    onPressClose,
    pointer,
    index,
  } = props;
  return (
    <View style={[styles.callout, style]}>
      <View style={styles.calloutHeader}>
        <Archivo
          fontDimensions={titleFontDimension}
          fontWeight={titleFontWeight}
          color={layoutColors.white}
          style={onPressClose ? styles.rightMargin8 : styles.rightMargin32}>
          {title}
        </Archivo>
        {Boolean(onPressClose) && (
          <TouchableOpacity onPress={onPressClose} style={styles.closeButton}>
            <CloseIcon color={layoutColors.white} />
          </TouchableOpacity>
        )}
      </View>
      {Boolean(content) && (
        <Archivo
          style={styles.calloutContent}
          fontDimensions={contentFontDimension}
          fontWeight={contentFontWeight}
          color={layoutColors.white}>
          {content}
        </Archivo>
      )}
      <View style={styles.calloutFooter}>
        <View style={styles.flexRow}>
          {Boolean(onPressLeft) && (
            <TouchableOpacity
              onPress={onPressLeft}
              style={[styles.calloutFooterButton, styles.rightMargin16]}>
              <Archivo
                fontDimensions={footerButtonFontDimension}
                fontWeight={FontWeights.MEDIUM}>
                {leftButtonText}
              </Archivo>
            </TouchableOpacity>
          )}
          {Boolean(onPressRight) && (
            <TouchableOpacity
              onPress={onPressRight}
              style={styles.calloutFooterButton}>
              <Archivo
                fontDimensions={footerButtonFontDimension}
                fontWeight={FontWeights.MEDIUM}>
                {rightButtonText}
              </Archivo>
            </TouchableOpacity>
          )}
        </View>
        {Boolean(index) && (
          <Archivo
            fontDimensions={FontDimensions.HEADLINE}
            fontWeight={FontWeights.BOLD}
            color={layoutColors.white}>
            {index}
          </Archivo>
        )}
      </View>
      {Boolean(pointer) && (
        <View style={[styles.pointer, getPointerStyles(pointer!)]}>
          <CalloutPointer />
        </View>
      )}
    </View>
  );
}
