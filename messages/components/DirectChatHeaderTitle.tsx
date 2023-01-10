import React from 'react';
import {StyleSheet, View} from 'react-native';
import Lato from '../../../components/labels/Lato';
import {
  FontDimensions,
  FontWeights,
} from '../../../components/labels/CustomText/types';
import {layoutColors} from '../../../constants/colors';
import Avatar from '../../../components/Avatar';

const styles = StyleSheet.create({
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftMargin12: {marginLeft: 12},
  borderWidth3: {borderWidth: 3},
  bottomMargin5: {marginBottom: 5},
  capitalize: {textTransform: 'capitalize'},
});

type Props = {
  description: string;
  chatTitle: string;
};

export default function DirectChatHeaderTitle(props: Props) {
  const {description, chatTitle} = props;

  return (
    <View style={styles.headerTitle}>
      <Avatar name={chatTitle} size={45} style={styles.borderWidth3} />
      <View style={styles.leftMargin12}>
        <Lato
          fontDimensions={FontDimensions.BODY1}
          fontWeight={FontWeights.BOLD}
          color={layoutColors.deep100}
          style={styles.bottomMargin5}>
          {chatTitle}
        </Lato>
        <Lato
          fontDimensions={FontDimensions.CAPTION1}
          color={layoutColors.black60}
          style={styles.capitalize}>
          {description}
        </Lato>
      </View>
    </View>
  );
}
