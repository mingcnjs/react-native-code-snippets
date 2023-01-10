import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FormFieldComponentProps, FormPhoto} from '../../../types/jobForm';
import PhotoList from './PhotoList/PhotoList';
import {uploadPhoto} from '../../../services/formPhotos';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {IPhoto, openImagePickerActionSheet} from '../../../utils/imagePicker';
import {useAppSelector} from '../../../redux/store';
import {useMount} from '../../../hooks/useMount';
import {getFormPhotos} from '../../../utils/forms';

export default function SingleFileUpload(props: FormFieldComponentProps) {
  const {
    formField,
    formInstanceId,
    setField,
    setSaveButtonDisabled,
    isInvalid,
    readonly,
  } = props;
  const {showActionSheetWithOptions} = useActionSheet();

  const [photos, setPhotos] = useState<IPhoto[]>([]);
  const user = useAppSelector(state => state.auth.user);
  const [hasChange, setHasChange] = useState(false);

  const photosIsLoading = useMemo(() => {
    return photos.some(photo => !photo.url);
  }, [photos]);

  useEffect(() => {
    setSaveButtonDisabled(photosIsLoading);
  }, [photosIsLoading, setSaveButtonDisabled]);

  useMount(() => {
    try {
      setPhotos(getFormPhotos(formField));
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    if (hasChange && !photos.find(photo => !photo.url)) {
      const value = JSON.stringify(photos);
      setField(formField.type, formField.title, value);
      setHasChange(false);
    }
  }, [hasChange, photos, formField, setField]);

  const onPickImage = useCallback(() => {
    openImagePickerActionSheet(showActionSheetWithOptions, async newPhotos => {
      setPhotos(prevState => {
        return [...prevState, ...newPhotos.map(() => ({url: ''}))];
      });

      setHasChange(true);
      for (const newPhoto of newPhotos) {
        await uploadPhoto(
          formInstanceId,
          newPhoto.url,
          newPhoto.fileName?.split('.')[0],
        )
          .then(url => {
            setPhotos(prevState => {
              const index = prevState.findIndex(item => !item.url);
              return [...prevState.filter((item, i) => i !== index), {url}];
            });
          })
          .catch(e => {
            setPhotos(prevState => {
              const index = prevState.findIndex(item => !item.url);
              return prevState.filter((item, i) => i !== index);
            });
            console.log(e);
          });
      }
    });
  }, [showActionSheetWithOptions, formInstanceId]);

  const onDeletePhoto = useCallback((photo: FormPhoto) => {
    setPhotos(prevState => {
      return prevState.filter(item => item.url !== photo.url);
    });

    setHasChange(true);
  }, []);

  const onSetNote = useCallback(
    (url: string, newNote: string) => {
      setPhotos(prevState => {
        const index = prevState.findIndex(item => item.url === url);
        if (index >= 0) {
          const updatedFields: Pick<FormPhoto, 'note' | 'noteAuthor'> = {
            note: newNote,
            noteAuthor: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
            },
          };

          return [
            ...prevState.slice(0, index),
            {...prevState[index], ...updatedFields},
            ...prevState.slice(index + 1),
          ];
        }
        return prevState;
      });

      setHasChange(true);
    },
    [user],
  );

  return (
    <PhotoList
      photos={photos}
      onPressAddButton={onPickImage}
      onDeletePhoto={onDeletePhoto}
      onSetNote={onSetNote}
      isInvalid={isInvalid}
      readonly={readonly}
    />
  );
}
