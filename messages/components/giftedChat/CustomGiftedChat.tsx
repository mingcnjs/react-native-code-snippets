import React, {Dispatch, ReactElement, SetStateAction, useState} from 'react';
import {
  CustomComposer,
  CustomInputToolbar,
  renderActions,
  renderSend,
} from './chatComponents';
import {getFullName} from '../../../../utils/utils';
import TypingFooter from '../TypingFooter';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {layoutColors} from '../../../../constants/colors';
import {BubbleProps, GiftedChat} from 'react-native-gifted-chat';
import {useAppDispatch, useAppSelector} from '../../../../redux/store';
import useFilePicker from '../../../../hooks/useFilePicker';
import {useChat} from '../../useChat';
import ChatOptions from '../ChatOptions';
import useHomeStackNavigation from '../../../../hooks/useHomeStackNavigation';
import {Message, updateMessageAction} from '../../../../redux/slices/chatSlice';
import Bubble from './Bubble';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  list: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: layoutColors.white,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  loadingEarlier: {
    alignItems: 'flex-end',
    height: 40,
    justifyContent: 'center',
    paddingRight: 24,
    width: '100%',
  },
  chatTop: {
    backgroundColor: layoutColors.lightBeige,
    paddingTop: 15,
  },
  roundedAngles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: layoutColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 30,
  },
  safeAreaPlank: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: layoutColors.white,
  },
});

type Props = {
  chatId: string;
  showOptions: boolean;
  setShowOptions: Dispatch<SetStateAction<boolean>>;
  ListHeaderComponent?: ReactElement;
};

export default function CustomGiftedChat(props: Props) {
  const {chatId, showOptions, setShowOptions, ListHeaderComponent} = props;
  const dispatch = useAppDispatch();
  const {bottom} = useSafeAreaInsets();

  const user = useAppSelector(state => state.auth.user);
  const chats = useAppSelector(state => state.chat.channels);
  const navigation = useHomeStackNavigation();
  const [removeChatButtonDisabled, setRemoveChatButtonDisabled] =
    useState(false);
  const [textLines, setTextLines] = useState(1);

  const {
    messages,
    getMessages,
    onSend,
    onSendFiles,
    downloadFile,
    sendSignal,
    removeChat,
  } = useChat(chatId);

  const openActionSheet = useFilePicker(files => onSendFiles(files));

  function onUpdateMessage(
    messageId: string | number,
    updatedFields: Partial<Message>,
  ) {
    dispatch(
      updateMessageAction({
        channelId: chatId,
        messageId,
        updatedFields,
      }),
    );
  }

  const chatUser = {
    _id: user.id,
    avatar: '',
    name: getFullName(user),
  };
  const selectedChat = chats?.find(c => c.id === chatId);
  return (
    <>
      <GiftedChat
        messagesContainerStyle={styles.list}
        wrapInSafeArea={false}
        listViewProps={{
          contentContainerStyle: styles.contentContainer,
          onEndReached: getMessages,
          showsVerticalScrollIndicator: false,
          ListFooterComponent: ListHeaderComponent,
        }}
        inverted
        loadEarlier={true}
        infiniteScroll={true}
        messages={messages}
        onSend={(newMessages: Message[]) => onSend(newMessages)}
        showUserAvatar={false}
        // @ts-ignore
        renderAvatar={null}
        renderBubble={(bubbleProps: BubbleProps<Message>) => {
          return (
            <Bubble
              {...bubbleProps}
              getFileUrl={downloadFile}
              updateMessage={updatedFields => {
                onUpdateMessage(
                  bubbleProps.currentMessage?._id!,
                  updatedFields,
                );
              }}
              chatId={chatId}
            />
          );
        }}
        user={chatUser}
        renderInputToolbar={inputProps => (
          <CustomInputToolbar {...inputProps} textLines={textLines} />
        )}
        renderComposer={composerProps => (
          // @ts-ignore
          <CustomComposer
            {...composerProps}
            sendSignal={sendSignal}
            channelId={chatId}
            user={chatUser}
            setTextLines={setTextLines}
            disabled={selectedChat?.custom?.status === 'ARCHIVED'}
          />
        )}
        renderFooter={() => <TypingFooter channelId={chatId} />}
        renderSend={renderSend}
        renderActions={renderActions}
        onPressActionButton={openActionSheet}
        renderLoadEarlier={({isLoadingEarlier}) => {
          return (
            <View style={styles.loadingEarlier}>
              {isLoadingEarlier && (
                <ActivityIndicator color={layoutColors.black} size={'small'} />
              )}
            </View>
          );
        }}
      />

      {showOptions && (
        <ChatOptions
          closeOptions={() => setShowOptions(false)}
          onPressAttachedPhotos={() => {
            setShowOptions(false);
            navigation.navigate('ChatPhotosModalScreen', {chatId});
          }}
          leaveAndRemoveDisabled={removeChatButtonDisabled}
          onPressLeaveAndRemove={() => {
            setRemoveChatButtonDisabled(true);
            removeChat()
              .then(() => navigation.goBack())
              .catch(() => setRemoveChatButtonDisabled(false));
          }}
        />
      )}
      <View style={[styles.safeAreaPlank, {height: bottom}]} />
    </>
  );
}
