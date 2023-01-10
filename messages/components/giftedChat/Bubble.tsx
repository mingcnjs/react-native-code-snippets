import React, {ReactElement, useState} from 'react';
import {BubbleProps} from 'react-native-gifted-chat';
import {PNFile} from '../../useChat';
import {useMount} from '../../../../hooks/useMount';
import {
  getExtensionFromName,
  getFileData,
  getTime,
} from '../../../../utils/utils';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import Lato from '../../../../components/labels/Lato';
import {
  FontDimensions,
  FontWeights,
} from '../../../../components/labels/CustomText/types';
import {layoutColors} from '../../../../constants/colors';
import {format} from 'date-fns';
import {IMAGE_EXTENSIONS} from '../../../../constants/constants';
import ImageModal from 'react-native-image-modal';
import EmptyFIleIcon from '../../../../assets/icons/EmptyFIleIcon';
import Loading from '../../../../components/Loading';
import BackgroundColor from '../../../../components/BackgroundColor';
import {downloadFile} from '../../../../utils/fileUtils';
import {Message} from '../../../../redux/slices/chatSlice';
import {useAppSelector} from '../../../../redux/store';

const imagePlaceholder = require('../../../../assets/images/imagePlaceholder.jpg');
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  bubble: {
    paddingTop: 11,
    paddingBottom: 7,
    borderRadius: 16,
  },
  bubbleRight: {
    paddingLeft: 18,
    paddingRight: 15,
    backgroundColor: layoutColors.highlight,
    borderBottomRightRadius: 0,
  },
  bubbleLeft: {
    paddingHorizontal: 15,
    backgroundColor: layoutColors.lightBeige,
    borderTopLeftRadius: 0,
  },
  messageText: {
    flexGrow: 0,
    flexShrink: 1,
    marginRight: 31,
  },
  messageTimeContainer: {alignItems: 'flex-end'},
  messageImage: {
    width: windowWidth * 0.34,
    aspectRatio: 0.8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: layoutColors.black10,
  },
  imageTime: {marginBottom: 10},
  messageFile: {
    borderWidth: 1,
    borderColor: layoutColors.black20,
    borderRadius: 12,
    paddingLeft: 8,
    paddingRight: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomPadding11: {paddingBottom: 11},
  bottomMargin10: {marginBottom: 10},
  bottomMargin6: {marginBottom: 6},
  bottomMargin4: {marginBottom: 4},
  leftMargin9: {marginLeft: 9},
  borderRadius12: {borderRadius: 12},
  topLeftRadius0: {borderTopLeftRadius: 0},
  bottomRightRadius0: {borderBottomRightRadius: 0},
  alignItemsEnd: {alignItems: 'flex-end'},
});

type MessageContentProps = {
  position: 'left' | 'right';
  renderTime: () => ReactElement | null;
  shouldHideTime: boolean;
  text: string;
};

function MessageContent(props: MessageContentProps) {
  const {position, renderTime, shouldHideTime, text} = props;

  return (
    <View
      style={[
        styles.bubble,
        position === 'right' ? styles.bubbleRight : styles.bubbleLeft,
        shouldHideTime && styles.bottomPadding11,
      ]}>
      <Lato fontDimensions={FontDimensions.BODY1} style={styles.messageText}>
        {text}
      </Lato>
      {renderTime()}
    </View>
  );
}

type FileContentProps = {
  getFileUrl: (file: PNFile) => Promise<string>;
  file: PNFile;
  fileUrl: string | undefined;
  renderTime: () => ReactElement | null;
  updateMessage: (updatedFields: Partial<Message>) => void;
  position: 'left' | 'right';
};

type ImageMessageProps = {
  fileUrl: string | undefined;
  renderTime: () => ReactElement | null;
};

function ImageMessage(props: ImageMessageProps) {
  const {fileUrl, renderTime} = props;

  return (
    <View>
      <ImageModal
        resizeMode={'cover'}
        modalImageResizeMode={'contain'}
        style={styles.messageImage}
        source={fileUrl ? {uri: fileUrl} : imagePlaceholder}
      />
      <View style={styles.imageTime}>{renderTime()}</View>
    </View>
  );
}

function FileMessage(props: FileContentProps) {
  const {file, fileUrl, getFileUrl, updateMessage, position} = props;

  const [isLoading, setIsLoading] = useState(false);

  async function onPress() {
    setIsLoading(true);
    try {
      let url: string;
      if (fileUrl) {
        url = fileUrl;
      } else {
        url = await getFileUrl(file);
        updateMessage({fileUrl: url});
      }

      await downloadFile({
        ...getFileData(file.name),
        link: url,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <TouchableOpacity
      style={[
        styles.messageFile,
        position === 'left' ? styles.topLeftRadius0 : styles.bottomRightRadius0,
      ]}
      onPress={onPress}>
      <EmptyFIleIcon />
      <Lato
        fontDimensions={FontDimensions.BODY1}
        fontWeight={FontWeights.BOLD}
        style={styles.leftMargin9}
        numberOfLines={1}>
        {file.name}
      </Lato>
      {isLoading && (
        <View style={StyleSheet.absoluteFill}>
          <BackgroundColor
            color={layoutColors.white}
            opacity={0.8}
            style={styles.borderRadius12}
          />
          <Loading />
        </View>
      )}
    </TouchableOpacity>
  );
}

function FileContent(props: FileContentProps) {
  const {fileUrl, getFileUrl, updateMessage, file, renderTime} = props;

  const [localFileUrl, setLocalFileUrl] = useState<string>();

  useMount(() => {
    if (!fileUrl && !localFileUrl) {
      getFileUrl(file)
        .then(url => {
          updateMessage({fileUrl: url});
          setLocalFileUrl(url);
        })
        .catch(e => console.log(e));
    }
  });

  if (IMAGE_EXTENSIONS.includes(getExtensionFromName(props.file.name))) {
    return (
      <ImageMessage fileUrl={fileUrl || localFileUrl} renderTime={renderTime} />
    );
  }

  return <FileMessage {...props} fileUrl={fileUrl || localFileUrl} />;
}

type Props = BubbleProps<Message & {file?: PNFile}> & {
  getFileUrl: (file: PNFile) => Promise<string>;
  updateMessage: (updatedFields: Partial<Message>) => void;
  chatId: string;
};

export default function Bubble(props: Props) {
  const {
    nextMessage,
    currentMessage,
    previousMessage,
    position,
    getFileUrl,
    updateMessage,
  } = props;

  const usersMap = useAppSelector(state => state.chat.users);

  if (!currentMessage) {
    return null;
  }

  const shouldHideTime = Boolean(
    nextMessage?.createdAt &&
      currentMessage.createdAt &&
      getTime(new Date(nextMessage.createdAt)) ===
        getTime(new Date(currentMessage.createdAt)) &&
      nextMessage.user._id === currentMessage.user._id,
  );

  function renderTime() {
    if (shouldHideTime || !currentMessage) {
      return null;
    }
    return (
      <View style={styles.messageTimeContainer}>
        <Lato
          fontDimensions={FontDimensions.CALLOUT2}
          color={layoutColors.black60}>
          {format(new Date(currentMessage.createdAt), 'h:mm aa')}
        </Lato>
      </View>
    );
  }

  function renderMessage() {
    if (!currentMessage) {
      return null;
    }
    if (!currentMessage.text && currentMessage.file) {
      return (
        <FileContent
          getFileUrl={getFileUrl}
          file={currentMessage.file}
          fileUrl={currentMessage.fileUrl}
          renderTime={renderTime}
          updateMessage={updateMessage}
          position={position}
        />
      );
    }
    return (
      <MessageContent
        position={position}
        renderTime={renderTime}
        shouldHideTime={shouldHideTime}
        text={currentMessage?.text}
      />
    );
  }

  const readUsers = currentMessage.actions?.receipt.read.reduce<string[]>(
    (arr, item) => {
      const readUser = usersMap[item.uuid];
      if (item.uuid !== currentMessage?.user._id && readUser?.name) {
        return [...arr, readUser.name.split(' ')[0]];
      }
      return arr;
    },
    [],
  );
  const showReadBy =
    (!nextMessage ||
      !nextMessage._id ||
      nextMessage.user?._id !== currentMessage.user._id) &&
    Boolean(readUsers?.length);

  return (
    <View>
      {previousMessage?.user?._id !== currentMessage.user._id &&
        position === 'left' && (
          <Lato
            fontDimensions={FontDimensions.CALLOUT1}
            fontWeight={FontWeights.SEMI_BOLD}
            color={layoutColors.deep100}
            style={styles.bottomMargin6}>
            {usersMap[currentMessage?.user._id]?.name || ''}
          </Lato>
        )}
      <View style={showReadBy ? styles.bottomMargin4 : styles.bottomMargin10}>
        {renderMessage()}
      </View>
      {showReadBy && (
        <View
          style={[
            styles.bottomMargin10,
            position === 'right' && styles.alignItemsEnd,
          ]}>
          <Lato
            fontDimensions={FontDimensions.BODY2}
            fontWeight={FontWeights.BOLD}
            color={layoutColors.black40}>
            Read by {readUsers!.join(', ')}
          </Lato>
        </View>
      )}
    </View>
  );
}
