import React from 'react';
import {AccountInfo} from '../../../../types/work-order';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Avatar from '../../../../components/Avatar';
import {getFullName} from '../../../../utils/utils';
import {layoutColors} from '../../../../constants/colors';
import {
  FontDimensions,
  FontWeights,
} from '../../../../components/labels/CustomText/types';
import Lato from '../../../../components/labels/Lato';
import {IUser} from '../../../../types/account';

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coordinator: {marginLeft: 15},
  bottomMargin20: {marginBottom: 20},
  bottomMargin5: {marginBottom: 5},
});

interface Props {
  coordinator: AccountInfo | IUser;
  size?: number;
  coordinatorStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function CoordinatorInfo(props: Props) {
  const {coordinator, size, coordinatorStyle, containerStyle} = props;
  return (
    <View style={[styles.flexRow, styles.bottomMargin20, containerStyle]}>
      <Avatar name={getFullName(coordinator)} size={size} />
      <View style={[styles.coordinator, coordinatorStyle]}>
        <Lato
          fontDimensions={FontDimensions.BODY1}
          fontWeight={FontWeights.BOLD}
          style={styles.bottomMargin5}>
          {getFullName(coordinator)}
        </Lato>
        <Lato
          fontDimensions={FontDimensions.CAPTION1}
          color={layoutColors.boulder}>
          Wreno Coordinator
        </Lato>
      </View>
    </View>
  );
}
