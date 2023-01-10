import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import CloseIcon from '../../assets/icons/CloseIcon';
import IconButton from '../../components/buttons/IconButton';
import Archivo from '../../components/labels/Archivo';
import {FontDimensions} from '../../components/labels/CustomText/types';
import Lato from '../../components/labels/Lato';
import CenteredModal from '../../components/modals/CenteredModal';
import {layoutColors} from '../../constants/colors';

type Props = {
  onClose: () => void;
};

const styles = StyleSheet.create({
  body: {
    position: 'relative',
    borderRadius: 10,
    padding: 24,
    margin: 24,
  },
  content: {
    paddingRight: 40,
  },
  headerLine: {
    height: 5,
    width: 36,
    borderRadius: 5,
    backgroundColor: 'rgba(60,60,67,0.3)',
  },
  header: {
    alignItems: 'flex-end',
    marginRight: -10,
  },
  headerTitle: {
    alignItems: 'baseline',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  close: {
    backgroundColor: layoutColors.green100,
    height: 40,
    width: 93,
    borderRadius: 4,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
});

const NoAvailableJobModalScreen = ({onClose}: Props) => {
  return (
    <CenteredModal closeModal={onClose} modalBodyStyles={styles.body}>
      <View>
        <View>
          <View style={styles.header}>
            <View style={[StyleSheet.absoluteFill, styles.headerTitle]}>
              <Archivo fontDimensions={FontDimensions.HEADLINE1}>
                Job not available
              </Archivo>
            </View>
            <IconButton onPress={onClose}>
              <CloseIcon />
            </IconButton>
          </View>
        </View>
        <Lato fontDimensions={FontDimensions.HEADLINE1} style={styles.content}>
          Sorry but it looks like this job is no longer available.
        </Lato>
        <TouchableOpacity style={styles.close} onPress={onClose}>
          <Archivo
            fontDimensions={FontDimensions.BUTTON1}
            color={layoutColors.white}>
            Close
          </Archivo>
        </TouchableOpacity>
      </View>
    </CenteredModal>
  );
};

export default NoAvailableJobModalScreen;
