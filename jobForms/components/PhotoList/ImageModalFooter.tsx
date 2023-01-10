import React, {useEffect, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  BLACK_TO_TRANSPARENT_GRADIENT,
  layoutColors,
} from '../../../../constants/colors';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import Archivo from '../../../../components/labels/Archivo';
import {FontDimensions} from '../../../../components/labels/CustomText/types';
import Lato from '../../../../components/labels/Lato';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BackgroundColor from '../../../../components/BackgroundColor';
import CloseIcon from '../../../../assets/icons/CloseIcon';
import TextArea from '../../../../components/TextArea';
import LoadingButton from '../../../../components/buttons/LoadingButton';
import {PhotoNoteAuthor} from '../../../../types/jobForm';
import {getFullName} from '../../../../utils/utils';
import IconButton from '../../../../components/buttons/IconButton';

const {height} = Dimensions.get('window');
const NOTE_INPUT_MODAL_HEIGHT = height - 200;

const styles = StyleSheet.create({
  flex1: {flex: 1},
  modalButton: {padding: 10},
  modalFooter: {
    paddingTop: 5,
    paddingHorizontal: 10,
    backgroundColor: layoutColors.white,
    alignItems: 'flex-end',
  },
  gradientBackground: {
    position: 'absolute',
    top: -170,
    height: 170,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  fullNote: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  noteScrollView: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 30,
    paddingBottom: 30,
  },
  bottomMargin5: {marginBottom: 5},
  addNoteButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 10,
    backgroundColor: 'transparent',
    alignItems: 'flex-end',
  },
  noteInputModal: {
    position: 'absolute',
    backgroundColor: layoutColors.white,
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  noteInputModalHeader: {
    paddingTop: 14,
    paddingHorizontal: 14,
    alignItems: 'flex-end',
  },
  noteInputModalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  noteInput: {
    flexGrow: 1,
    flexShrink: 1,
  },
  noteInputModalFooter: {
    flexDirection: 'row',
    marginTop: 24,
  },
  bottomMargin16: {marginBottom: 16},
});

type Props = {
  onClose: () => void;
  onPressDelete: () => void;
  note: string | undefined;
  noteAuthor: PhotoNoteAuthor | undefined;
  onSetNote: (note: string) => void;
};

export default function ImageModalFooter(props: Props) {
  const {onPressDelete, onClose, note, noteAuthor, onSetNote} = props;
  const {bottom, top} = useSafeAreaInsets();

  const [showFullNote, setShowFullNote] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteValue, setNoteValue] = useState(note || '');

  const noteInputTranslateY = useRef(
    new Animated.Value(showNoteInput ? 0 : NOTE_INPUT_MODAL_HEIGHT),
  ).current;

  useEffect(() => {
    Animated.spring(noteInputTranslateY, {
      toValue: showNoteInput ? 0 : NOTE_INPUT_MODAL_HEIGHT,
      useNativeDriver: false,
    }).start();
  }, [showNoteInput, noteInputTranslateY]);

  const HEADER_HEIGHT = 50 + top;
  const FOOTER_HEIGHT = 51 + bottom;
  const FULL_NOTE_HEIGHT = height - (HEADER_HEIGHT + FOOTER_HEIGHT);

  function renderNoteText() {
    return (
      <>
        {noteAuthor && (
          <Archivo
            fontDimensions={FontDimensions.HEADLINE2}
            color={layoutColors.white}
            style={styles.bottomMargin5}>
            {getFullName(noteAuthor)}
          </Archivo>
        )}
        <Lato
          fontDimensions={FontDimensions.BODY1}
          color={layoutColors.white}
          numberOfLines={showFullNote ? undefined : 2}>
          {note}
        </Lato>
      </>
    );
  }

  function renderNote() {
    if (note) {
      if (showFullNote) {
        return (
          <TouchableOpacity
            activeOpacity={1}
            style={[
              styles.fullNote,
              {
                top: -FULL_NOTE_HEIGHT,
                height: FULL_NOTE_HEIGHT,
              },
            ]}
            onPress={() => setShowFullNote(false)}>
            <BackgroundColor color={layoutColors.black100} opacity={0.8} />
            <ScrollView
              style={styles.flex1}
              contentContainerStyle={styles.noteScrollView}>
              {renderNoteText()}
            </ScrollView>
          </TouchableOpacity>
        );
      }
      return (
        <LinearGradient
          {...BLACK_TO_TRANSPARENT_GRADIENT}
          style={styles.gradientBackground}
          pointerEvents={'box-none'}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowFullNote(true)}>
            {renderNoteText()}
          </TouchableOpacity>
        </LinearGradient>
      );
    }
    return null;
  }

  return (
    <View style={[styles.modalFooter, {paddingBottom: bottom + 6}]}>
      {renderNote()}
      <View
        style={[
          styles.addNoteButtonContainer,
          {
            height: FULL_NOTE_HEIGHT + 45,
            top: -(FULL_NOTE_HEIGHT + 45),
          },
        ]}
        pointerEvents={'box-none'}>
        <TouchableOpacity
          style={styles.modalButton}
          onPress={() => setShowNoteInput(true)}>
          <Lato
            fontDimensions={FontDimensions.BODY1}
            color={layoutColors.green100}>
            {note ? 'Edit notes' : 'Add notes'}
          </Lato>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.modalButton} onPress={onPressDelete}>
        <Lato
          fontDimensions={FontDimensions.BODY1}
          color={layoutColors.green100}>
          Delete
        </Lato>
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.noteInputModal,
          {
            height: NOTE_INPUT_MODAL_HEIGHT,
            transform: [{translateY: noteInputTranslateY}],
            paddingBottom: bottom,
          },
        ]}>
        <View style={styles.noteInputModalHeader}>
          <IconButton onPress={() => setShowNoteInput(false)}>
            <CloseIcon />
          </IconButton>
        </View>
        <View style={styles.noteInputModalContent}>
          <Archivo
            fontDimensions={FontDimensions.HEADLINE}
            style={styles.bottomMargin16}>
            Note
          </Archivo>

          <TextArea
            value={noteValue}
            onChangeText={setNoteValue}
            style={styles.noteInput}
            placeholder={'Add note here...'}
          />

          <View style={styles.noteInputModalFooter}>
            <LoadingButton
              type={'outline'}
              borderColor={layoutColors.green50}
              onPress={() => {
                onSetNote(noteValue);
                onClose();
              }}>
              <Archivo
                fontDimensions={FontDimensions.BUTTON}
                color={layoutColors.deep100}>
                Save note
              </Archivo>
            </LoadingButton>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
