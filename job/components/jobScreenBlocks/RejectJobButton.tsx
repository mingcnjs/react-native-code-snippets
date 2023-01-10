import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import InfoBlock from '../InfoBlock';
import DangerousIcon from '../../../../assets/icons/DangerousIcon';
import {layoutColors} from '../../../../constants/colors';

const styles = StyleSheet.create({
  container: {
    marginBottom: -10,
  },
  button: {
    paddingTop: 15,
    paddingHorizontal: -20,
  },
  title: {color: layoutColors.red},
});

type Props = {
  onPress?: () => void;
};

export default function RejectJobButton(props: Props) {
  const {onPress} = props;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={styles.button}
      onPress={onPress}>
      <InfoBlock
        containerStyle={styles.container}
        title={'Reject this job'}
        Icon={<DangerousIcon />}
        textStyle={styles.title}
      />
    </TouchableOpacity>
  );
}
