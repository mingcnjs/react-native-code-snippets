import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
import Archivo from '../../components/labels/Archivo';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../types/paramlists';
import UpDownModal from '../../components/modals/UpDownModal';
import {
  FontDimensions,
  FontWeights,
} from '../../components/labels/CustomText/types';
import IconButton from '../../components/buttons/IconButton';
import CloseIcon from '../../assets/icons/CloseIcon';
import {PNFile} from './useChat';
import {usePubNub} from 'pubnub-react';
import Inter from '../../components/labels/Inter';
import {compareDesc, differenceInDays, differenceInHours} from 'date-fns';
import ChatPhoto from './components/ChatPhoto';
import {layoutColors} from '../../constants/colors';
import {getExtensionFromName} from '../../utils/utils';
import {IMAGE_EXTENSIONS} from '../../constants/constants';

const styles = StyleSheet.create({
  headerLineContainer: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  headerLine: {
    height: 5,
    width: 36,
    borderRadius: 5,
    backgroundColor: 'rgba(60,60,67,0.3)',
  },
  header: {
    alignItems: 'flex-end',
    paddingRight: 15,
  },
  headerTitle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderRadius30: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  contentContainer: {
    flexDirection: 'row',
    paddingHorizontal: 18,
  },
  sectionTitle: {
    paddingTop: 13,
    paddingBottom: 12,
    paddingHorizontal: 22,
    backgroundColor: layoutColors.white,
  },
});

type ResponsePhoto = {
  name: string;
  id: string;
  size: number;
  created: string;
};
type PNPhoto = PNFile & {created: string};
type PhotosMap = Record<string, PNPhoto[]>;
type PhotoListSection = {title: string; data: PNPhoto[][]};

function getPhotoTitle(createdAt: Date) {
  const today = new Date();
  if (differenceInHours(today, createdAt) <= 12) {
    return 'Recent';
  } else {
    const daysDiff = differenceInDays(today, createdAt);
    if (daysDiff <= 7) {
      return 'This Week';
    } else if (daysDiff <= 30) {
      return 'Last Month';
    }
  }
  return 'Older photos';
}

function getPhotosMap(
  data: ResponsePhoto[],
  chatId: string,
  prevPhotosMap: PhotosMap,
): PhotosMap {
  const newMap = data
    .filter(item => IMAGE_EXTENSIONS.includes(getExtensionFromName(item.name)))
    .reduce<PhotosMap>((obj, item) => {
      const {id, name, created} = item;

      const title = getPhotoTitle(new Date(created));
      const newItem: PNPhoto = {id, name, channel: chatId, created};

      const prevPhotoList = obj[title] || prevPhotosMap[title] || [];
      const lastItem =
        prevPhotoList.length > 0
          ? prevPhotoList[prevPhotoList.length - 1]
          : undefined;
      if (!lastItem) {
        return {
          ...obj,
          [title]: [newItem],
        };
      } else if (
        lastItem &&
        compareDesc(new Date(created), new Date(lastItem.created)) >= 0
      ) {
        return {
          ...obj,
          [title]: [...prevPhotoList, newItem],
        };
      } else if (
        compareDesc(new Date(created), new Date(prevPhotoList[0].created)) < 0
      ) {
        return {
          ...obj,
          [title]: [newItem, ...prevPhotoList],
        };
      } else {
        const newList = [...prevPhotoList];
        const restItems: PNPhoto[] = [];
        while (newList.length > 0) {
          if (
            compareDesc(
              new Date(created),
              new Date(newList[newList.length - 1].created),
            ) < 0
          ) {
            restItems.push(newList.pop()!);
          } else {
            break;
          }
        }
        return {
          ...obj,
          [title]: [...newList, newItem, ...restItems],
        };
      }
    }, {});

  return {...prevPhotosMap, ...newMap};
}

function getSections(photosMap: PhotosMap): PhotoListSection[] {
  return Object.keys(photosMap).map(title => {
    const data = photosMap[title].reduce<PNPhoto[][]>((arr, item, index) => {
      if (index === 0) {
        return [[item]];
      }
      const lastSubArray = arr.slice(-1)[0];
      if (lastSubArray.length < 3) {
        return [...arr.slice(0, arr.length - 1), [...lastSubArray, item]];
      }
      return [...arr, [item]];
    }, []);
    return {title, data};
  });
}

const PHOTO_FETCH_LIMIT = 15;

type Props = NativeStackScreenProps<
  HomeStackParamList,
  'ChatPhotosModalScreen'
>;

export default function ChatPhotosModalScreen(props: Props) {
  const {navigation, route} = props;
  const {chatId} = route.params;
  const pubnub = usePubNub();

  const [photosMap, setPhotosMap] = useState<PhotosMap>({});
  const [nextPartToken, setNextPartToken] = useState<string | null>(null);

  async function fetchMorePhotos() {
    if (nextPartToken) {
      try {
        const response = await pubnub.listFiles({
          channel: chatId,
          limit: PHOTO_FETCH_LIMIT,
          next: nextPartToken,
        });
        setNextPartToken(response.next);

        setPhotosMap(prevState => {
          return getPhotosMap(response.data, chatId, prevState);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  const getPhotos = useCallback(async () => {
    try {
      const response = await pubnub.listFiles({
        channel: chatId,
        limit: PHOTO_FETCH_LIMIT,
      });
      setNextPartToken(response.next);

      setPhotosMap(prevState => {
        return getPhotosMap(response.data, chatId, prevState);
      });
    } catch (e) {
      console.log(e);
    }
  }, [pubnub, chatId]);

  useEffect(() => {
    getPhotos();
  }, [getPhotos]);

  const sections = useMemo(() => {
    return getSections(photosMap);
  }, [photosMap]);

  function closeModal() {
    navigation.goBack();
  }

  return (
    <UpDownModal
      style={styles.borderRadius30}
      closeModal={closeModal}
      topOffset={60}
      ModalHeader={
        <View>
          <View style={styles.headerLineContainer}>
            <View style={styles.headerLine} />
          </View>
          <View style={styles.header}>
            <View style={[StyleSheet.absoluteFill, styles.headerTitle]}>
              <Archivo fontDimensions={FontDimensions.HEADLINE}>
                Attached photos
              </Archivo>
            </View>
            <IconButton onPress={closeModal}>
              <CloseIcon />
            </IconButton>
          </View>
        </View>
      }>
      <SectionList
        sections={sections}
        renderSectionHeader={({section: {title}}) => {
          return (
            <View style={styles.sectionTitle}>
              <Inter
                fontDimensions={FontDimensions.BODY1}
                fontWeight={FontWeights.MEDIUM}>
                {title}
              </Inter>
            </View>
          );
        }}
        renderItem={({item}) => {
          return (
            <View style={styles.contentContainer}>
              {item.map(photo => {
                return (
                  <ChatPhoto key={photo.id} pnPhoto={photo} pubnub={pubnub} />
                );
              })}
            </View>
          );
        }}
        keyExtractor={item => item[0].id}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchMorePhotos}
        onEndReachedThreshold={0.1}
      />
    </UpDownModal>
  );
}
