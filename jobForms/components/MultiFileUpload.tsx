import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {FormFieldComponentProps, FormPhoto} from '../../../types/jobForm';
import {FontDimensions} from '../../../components/labels/CustomText/types';
import Lato from '../../../components/labels/Lato';
import {layoutColors} from '../../../constants/colors';
import {StyleSheet} from 'react-native';
import {IPhoto, openImagePickerActionSheet} from '../../../utils/imagePicker';
import PhotoList from './PhotoList/PhotoList';
import {useActionSheet} from '@expo/react-native-action-sheet';
import {uploadPhoto} from '../../../services/formPhotos';
import {useAppSelector} from '../../../redux/store';
import {useMount} from '../../../hooks/useMount';
import {getFormPhotosMap} from '../../../utils/forms';
import ErrorText from './ErrorText';

type IPhotoMap = Record<string, IPhoto[]>;

function filterFirstEmptyPhoto(photosMap: IPhotoMap, option: string) {
  const index = (photosMap[option] || []).findIndex(item => !item.url);
  return (photosMap[option] || []).filter((item, i) => i !== index);
}

const styles = StyleSheet.create({
  bottomMargin25: {marginBottom: 25},
  bottomMargin10: {marginBottom: 10},
});

export default function MultiFileUpload(props: FormFieldComponentProps) {
  const {
    formField,
    formInstanceId,
    setField,
    setSaveButtonDisabled,
    isInvalid,
    readonly,
  } = props;
  const {showActionSheetWithOptions} = useActionSheet();

  const [photos, setPhotos] = useState<IPhotoMap>({});
  const user = useAppSelector(state => state.auth.user);
  const [hasChange, setHasChange] = useState(false);

  const photosIsLoading = useMemo(() => {
    return Object.keys(photos).some(option => {
      return (photos[option] || []).some(photo => !photo.url);
    });
  }, [photos]);

  useEffect(() => {
    setSaveButtonDisabled(photosIsLoading);
  }, [photosIsLoading, setSaveButtonDisabled]);

  useMount(() => {
    try {
      setPhotos(getFormPhotosMap(formField));
    } catch (e) {
      console.log(e);
    }
  });

  useEffect(() => {
    if (
      hasChange &&
      !Object.keys(photos).find(option =>
        (photos[option] || []).find(photo => !photo.url),
      )
    ) {
      const value = JSON.stringify(photos);
      setField(formField.type, formField.title, value);
      setHasChange(false);
    }
  }, [hasChange, photos, formField, setField]);

  const onPickImage = useCallback(
    (option: string) => {
      openImagePickerActionSheet(
        showActionSheetWithOptions,
        async newPhotos => {
          setPhotos(prevState => {
            return {
              ...prevState,
              [option]: [
                ...(prevState[option] || []),
                ...newPhotos.map(() => ({url: ''})),
              ],
            };
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
                  return {
                    ...prevState,
                    [option]: [
                      ...filterFirstEmptyPhoto(prevState, option),
                      {url},
                    ],
                  };
                });
              })
              .catch(e => {
                setPhotos(prevState => {
                  return {
                    ...prevState,
                    [option]: filterFirstEmptyPhoto(prevState, option),
                  };
                });
                console.log(e);
              });
          }
        },
      );
    },
    [showActionSheetWithOptions, formInstanceId],
  );

  const onDeletePhoto = useCallback(
    async (photo: FormPhoto, option: string) => {
      setPhotos(prevState => {
        return {
          ...prevState,
          [option]: (prevState[option] || []).filter(
            item => item.url !== photo.url,
          ),
        };
      });

      setHasChange(true);
    },
    [],
  );

  function onSetNote(url: string, newNote: string, option: string) {
    setPhotos(prevState => {
      const prevPhotos = prevState[option] || [];
      if (prevPhotos.length > 0) {
        const index = prevPhotos.findIndex(item => item.url === url);
        if (index >= 0) {
          const updatedFields: Pick<FormPhoto, 'note' | 'noteAuthor'> = {
            note: newNote,
            noteAuthor: {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
            },
          };

          return {
            ...prevState,
            [option]: [
              ...prevPhotos.slice(0, index),
              {...prevPhotos[index], ...updatedFields},
              ...prevPhotos.slice(index + 1),
            ],
          };
        }

        return prevState;
      }
      return prevState;
    });
  }

  if (formField.options) {
    return (
      <>
        {formField.options.map((option, index, array) => {
          const isLast = index === array.length - 1;

          return (
            <React.Fragment key={option}>
              <Lato
                fontDimensions={FontDimensions.BODY1}
                color={layoutColors.black60}
                style={styles.bottomMargin10}>
                {option}
                {formField.required ? '*' : ''}
              </Lato>

              <PhotoList
                photos={photos[option] || []}
                onPressAddButton={() => onPickImage(option)}
                onDeletePhoto={photo => onDeletePhoto(photo, option)}
                onSetNote={(path, note) => onSetNote(path, note, option)}
                containerStyle={[!isLast && styles.bottomMargin25]}
                readonly={readonly}
              />
            </React.Fragment>
          );
        })}
        <ErrorText isInvalid={Boolean(isInvalid)}>
          Pictures are required
        </ErrorText>
      </>
    );
  }
  return null;
}
