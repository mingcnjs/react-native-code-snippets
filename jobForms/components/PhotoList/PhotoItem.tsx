import React, {useState} from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import ImageModal from 'react-native-image-modal';
import {layoutColors} from '../../../../constants/colors';
import Loading from '../../../../components/Loading';
import Lato from '../../../../components/labels/Lato';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  FontDimensions,
  FontWeights,
} from '../../../../components/labels/CustomText/types';
import ImageModalFooter from './ImageModalFooter';
import StickyNoteIcon from '../../../../assets/icons/StickyNoteIcon';
import {PhotoNoteAuthor} from '../../../../types/jobForm';

const styles = StyleSheet.create({
  photoItem: {
    width: 94,
    aspectRatio: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: layoutColors.black10,
  },
  photo: {width: 94, aspectRatio: 1, borderRadius: 4},
  deleteImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    height: 24,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: layoutColors.white,
    shadowColor: `rgba(${layoutColors.black100RGB},${
      Platform.OS === 'ios' ? '0.3' : '0.6'
    })`,
    shadowOpacity: 1,
    shadowOffset: {height: 0, width: 0},
    elevation: 9,
  },
  rightMargin10: {marginRight: 10},
  modalHeader: {
    paddingBottom: 5,
    paddingHorizontal: 10,
    backgroundColor: layoutColors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalButton: {padding: 10},
  noteIndicator: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    padding: 3,
    backgroundColor: layoutColors.lightBeige,
    borderRadius: 4,
  },
  photoLoading: {
    backgroundColor: layoutColors.black10,
    borderRadius: 4,
  },
});

type Props = {
  url: string | undefined;
  note: string | undefined;
  noteAuthor?: PhotoNoteAuthor;
  onDelete: () => void;
  onSetNote: (path: string, note: string) => void;
  readonly?: boolean;
};

export default function PhotoItem(props: Props) {
  const {url, onDelete, note, noteAuthor, onSetNote, readonly = false} = props;
  const {top} = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(false);

  function openConfirmDeletionAlert(onConfirm: () => void) {
    Alert.alert(
      'Confirm deletion',
      'Are you sure you want to delete this photo?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete();
            onConfirm();
          },
        },
      ],
    );
  }

  return (
    <View style={[styles.photoItem, styles.rightMargin10]}>
      {Boolean(url) && (
        <>
          <ImageModal
            disabled={readonly}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            resizeMode={'cover'}
            modalImageResizeMode={'contain'}
            source={{uri: url}}
            style={styles.photo}
            renderHeader={close => {
              return (
                <View style={[styles.modalHeader, {paddingTop: top + 5}]}>
                  <TouchableOpacity style={styles.modalButton} onPress={close}>
                    <Lato
                      fontDimensions={FontDimensions.BODY1}
                      fontWeight={FontWeights.BOLD}
                      color={layoutColors.green100}>
                      Done
                    </Lato>
                  </TouchableOpacity>
                </View>
              );
            }}
            renderFooter={close => {
              return (
                <ImageModalFooter
                  onPressDelete={() => openConfirmDeletionAlert(close)}
                  onClose={close}
                  note={note}
                  noteAuthor={noteAuthor}
                  onSetNote={newNote => onSetNote(url!, newNote)}
                />
              );
            }}
          />
          {note && (
            <View style={styles.noteIndicator}>
              <StickyNoteIcon />
            </View>
          )}
        </>
      )}
      {(!url || isLoading) && (
        <View style={[StyleSheet.absoluteFill, styles.photoLoading]}>
          <Loading color={layoutColors.black100} />
        </View>
      )}
    </View>
  );
}
