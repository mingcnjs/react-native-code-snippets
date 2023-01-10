import React from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import AttachedImagesIcon from '../../../assets/icons/AttachedImagesIcon';
import Lato from '../../../components/labels/Lato';
import {
  FontDimensions,
  FontWeights,
} from '../../../components/labels/CustomText/types';
import TrashBinIcon2 from '../../../assets/icons/TrashBinIcon2';
import {layoutColors} from '../../../constants/colors';

const styles = StyleSheet.create({
  options: {
    position: 'absolute',
    top: 5,
    right: 15,
    borderRadius: 16,
    backgroundColor: layoutColors.white,
    shadowOffset: {
      width: 4,
      height: 6,
    },
    shadowRadius: 28,
    shadowOpacity: 1,
    shadowColor: `rgba(${layoutColors.black100RGB}, ${
      Platform.OS === 'ios' ? '0.1' : '0.4'
    })`,
    elevation: 16,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    height: 1,
    marginHorizontal: 15,
    backgroundColor: layoutColors.green10,
  },
  leftMargin10: {marginLeft: 10},
  bottomPadding15: {paddingBottom: 15},
  topPadding15: {paddingTop: 15},
});

type Props = {
  closeOptions: () => void;
  onPressAttachedPhotos?: () => void;
  onPressLeaveAndRemove?: () => void;
  leaveAndRemoveDisabled?: boolean;
};

export default function ChatOptions(props: Props) {
  const {
    closeOptions,
    onPressAttachedPhotos,
    onPressLeaveAndRemove,
    leaveAndRemoveDisabled = false,
  } = props;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={closeOptions}
      style={StyleSheet.absoluteFill}>
      <View style={styles.options}>
        <TouchableOpacity
          onPress={onPressAttachedPhotos}
          style={[styles.optionButton, styles.topPadding15]}>
          <AttachedImagesIcon />
          <Lato
            fontDimensions={FontDimensions.BODY2}
            fontWeight={FontWeights.MEDIUM}
            style={styles.leftMargin10}>
            Attached photos
          </Lato>
        </TouchableOpacity>

        <View style={styles.line} />

        <TouchableOpacity
          onPress={onPressLeaveAndRemove}
          style={[styles.optionButton, styles.bottomPadding15]}
          disabled={leaveAndRemoveDisabled}>
          <TrashBinIcon2 />
          <Lato
            fontDimensions={FontDimensions.BODY2}
            fontWeight={FontWeights.MEDIUM}
            color={layoutColors.red3}
            style={styles.leftMargin10}>
            Leave & Remove
          </Lato>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
