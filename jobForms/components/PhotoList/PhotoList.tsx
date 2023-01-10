import React, {useCallback} from 'react';
import {FlatList, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import PhotoItem from './PhotoItem';
import AddPhotoButton from './AddPhotoButton';
import {IPhoto} from '../../../../utils/imagePicker';
import {FormPhoto} from '../../../../types/jobForm';

const styles = StyleSheet.create({
  container: {marginBottom: 10},
  flatList: {
    marginHorizontal: -20,
    marginBottom: 10,
  },
  contentContainer: {
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  singleContainer: {
    paddingTop: 12,
    flexDirection: 'row',
    marginBottom: 10,
  },
});

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  single?: boolean;
  photos: IPhoto[];
  onPressAddButton: () => void;
  onDeletePhoto: (photo: FormPhoto) => void;
  onSetNote: (url: string, note: string) => void;
  isInvalid?: boolean;
  readonly?: boolean;
};

export default function PhotoList(props: Props) {
  const {
    containerStyle,
    single = false,
    photos,
    onPressAddButton,
    onDeletePhoto,
    onSetNote,
    isInvalid,
    readonly = false,
  } = props;

  const onDelete = useCallback(
    (photo: IPhoto) => {
      if (photo.url) {
        onDeletePhoto(photo as FormPhoto);
      }
    },
    [onDeletePhoto],
  );

  if (single) {
    if (photos.length === 0) {
      return (
        <View style={[styles.singleContainer, containerStyle]}>
          <AddPhotoButton onPress={onPressAddButton} disabled={readonly} />
        </View>
      );
    }

    const photo = photos[0];
    return (
      <View style={[styles.singleContainer, containerStyle]}>
        <PhotoItem
          url={photo.url}
          onDelete={() => onDelete(photo)}
          note={photo.note}
          noteAuthor={photo.noteAuthor}
          onSetNote={onSetNote}
          readonly={readonly}
        />
      </View>
    );
  }

  return (
    <FlatList
      style={[styles.flatList, containerStyle]}
      contentContainerStyle={styles.contentContainer}
      data={photos}
      renderItem={({item: photo}) => (
        <PhotoItem
          url={photo.url}
          onDelete={() => onDelete(photo)}
          note={photo.note}
          noteAuthor={photo.noteAuthor}
          onSetNote={onSetNote}
          readonly={readonly}
        />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      ListFooterComponent={
        <AddPhotoButton
          onPress={onPressAddButton}
          isInvalid={isInvalid}
          disabled={readonly}
        />
      }
    />
  );
}
