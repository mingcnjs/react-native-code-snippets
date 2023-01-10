import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import BackArrowIcon from '../../../../assets/icons/BackArrowIcon';
import {layoutColors} from '../../../../constants/colors';

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  underline: {borderBottomColor: layoutColors.everglade, borderBottomWidth: 1},
  showMoreButtonText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: 'Lato-Bold',
    color: layoutColors.everglade,
  },
  showMoreButtonIcon: {transform: [{scaleX: -1}], marginLeft: 5},
});

interface Props {
  title: string;
  arrow?: boolean;
  onPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export default function TextLink(props: Props) {
  const {title, arrow = true, onPress, containerStyle} = props;
  return (
    <View style={[styles.flexRow, containerStyle]}>
      <TouchableOpacity style={styles.showMoreButton} onPress={onPress}>
        <View style={styles.underline}>
          <Text style={styles.showMoreButtonText}>{title}</Text>
        </View>
        {arrow && (
          <View style={styles.showMoreButtonIcon}>
            <BackArrowIcon fill={layoutColors.everglade} />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}
