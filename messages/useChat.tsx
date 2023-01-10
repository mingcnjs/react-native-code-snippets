import {usePubNub} from 'pubnub-react';
import {useCallback, useEffect} from 'react';
import PubNub, {FileEvent, MessageEvent, UriFileInput} from 'pubnub';
import {store, useAppDispatch, useAppSelector} from '../../redux/store';
import {
  Actions,
  addPrevMessagesAction,
  addUsersAction,
  CustomUserEntity,
  Message,
  updateMessageAction,
} from '../../redux/slices/chatSlice';
import {useChannelMembers, UserEntity} from '@pubnub/react-chat-components';
import {CHAT_TYPES} from '../../types/chat';
import {useCreateChatMutation} from '../../services/endpoints/chat';
import {getFullName} from '../../utils/utils';
import {IUser} from '../../types/account';
import {parseChatId} from '../../utils/chat';
import {NotificationTag} from '../../types/notification';
import {useGetAssignedWorkOrdersQuery} from '../../services/endpoints/workOrders';
import {IPopulatedWorkOrder} from '../../types/work-order';

type PNMessage = {
  channel: string;
  message: any;
  timetoken: string | number;
  messageType?: string | number | undefined;
  uuid?: string | undefined;
  meta?: {[p: string]: any} | undefined;
  actions: Actions;
};

export type PNFile = {
  id: string;
  name: string;
  channel: string;
};

type MessageContent = {
  text: string;
  file?: PNFile;
  actions?: Actions;
};

type NotificationData = {
  tag: NotificationTag;
  chatId: string;
  user?: IUser;
  title?: string;
};

function getMessageBody(
  uid: string,
  timetoken: string | number,
  messageContent: MessageContent,
): Message {
  return {
    createdAt: parseInt(timetoken as string, 10) / 10000,
    _id: timetoken,
    timetoken,
    user: {
      _id: uid,
    },
    ...messageContent,
  };
}

function buildMessageBody(
  message: string,
  publisherName: string | undefined,
  tokens: string[],
  chatId: string,
  user: IUser,
  jobs: IPopulatedWorkOrder[],
) {
  const {chatType, workOrderId} = parseChatId(chatId);

  let data: NotificationData = {
    tag: NotificationTag.JOB_CHAT,
    chatId,
  };

  const title = publisherName
    ? `You have a message from ${publisherName}`
    : 'You received new message';

  const builder = PubNub.notificationPayload(title, message);
  const messagePayload = builder.buildPayload(['fcm']) as {
    text: string;
    pn_gcm: any;
  };
  messagePayload.text = message;
  messagePayload.pn_gcm.pn_exceptions = tokens;

  if (chatType === CHAT_TYPES.DIRECT) {
    data = {...data, tag: NotificationTag.DIRECT_CHAT, user};
  } else {
    const chatJob = jobs?.find(job => job.id === workOrderId);
    data = {...data, title: chatJob?.title || ''};
  }

  messagePayload.pn_gcm.data = data;
  console.log(data);
  return messagePayload;
}

export async function convertFileToGCMessage(fileData: FileEvent) {
  const uid = fileData.publisher;
  const {id, name} = fileData.file;

  return getMessageBody(uid, fileData.timetoken, {
    text: '',
    file: {id, name, channel: fileData.channel},
  });
}

export function convertToGCMessage(
  pnMessage: PNMessage | MessageEvent,
): Message {
  const {publisher, uuid, message, channel, timetoken, actions} =
    pnMessage as PNMessage & MessageEvent;
  const uid = uuid ? uuid : publisher!;

  const messageContent: MessageContent = {text: '', actions};
  if (message.file) {
    const {id, name} = message.file;
    messageContent.file = {id, name, channel};
  } else if (message.text !== undefined) {
    messageContent.text = message.text;
  } else {
    messageContent.text = message;
  }

  return getMessageBody(uid, timetoken, messageContent);
}

const MESSAGE_COUNT = 100;

function getFirstTimeToken(messages: Message[]) {
  return messages.length ? messages[messages.length - 1].timetoken : undefined;
}

export function getMissingUsers(chatId: string, users: (UserEntity | IUser)[]) {
  const {userIds} = parseChatId(chatId);
  return userIds.filter(value => !users.some(u => u.id === value));
}

function checkRead(
  lastMessage: Message,
  chatLastMessageId: string | number | boolean | undefined,
  lastMessageId: string | number,
) {
  return lastMessage.read || chatLastMessageId === lastMessageId;
}

export function useChat(chatId: string) {
  const pubnub = usePubNub();
  const dispatch = useAppDispatch();
  const messages = useAppSelector(state => state.chat.messages[chatId] || []);
  const currentChat = useAppSelector(state => state.chat.channels).find(
    chat => chat.id === chatId,
  );

  const user = useAppSelector(state => state.auth.user);
  const [createChat] = useCreateChatMutation();
  const {data = []} = useGetAssignedWorkOrdersQuery();

  const [members] = useChannelMembers({
    channel: chatId,
    include: {customFields: true, customUUIDFields: true},
  });

  useEffect(() => {
    dispatch(addUsersAction(members as CustomUserEntity[]));
  }, [members, dispatch]);

  const lastMessageId = messages[0]?._id;

  useEffect(() => {
    if (lastMessageId) {
      const lastMessage = store.getState().chat.messages[chatId][0];
      const cChat = store
        .getState()
        .chat.channels.find(chat => chat.id === chatId);
      const myMessage = lastMessage.user?._id === user.id;
      const isRead = checkRead(
        lastMessage,
        cChat?.custom?.[user.id],
        lastMessageId,
      );
      if (!myMessage && !isRead) {
        const readPromise = pubnub.addMessageAction({
          channel: chatId,
          messageTimetoken: lastMessageId as string,
          action: {
            type: 'receipt',
            value: 'read',
          },
        });
        const channelPromise = pubnub.objects.setChannelMetadata({
          channel: chatId,
          data: {
            custom: {
              ...(cChat?.custom || {status: 'ACTIVE'}),
              [user.id]: lastMessageId,
            },
          },
        });
        Promise.all([readPromise, channelPromise]).then(() => {
          dispatch(
            updateMessageAction({
              channelId: chatId,
              messageId: lastMessageId,
              updatedFields: {read: true},
            }),
          );
        });
      }
    }
  }, [chatId, dispatch, lastMessageId, pubnub, user.id]);

  const getMessages = useCallback(() => {
    const currentChatMessages = store.getState().chat.messages[chatId] || [];
    pubnub
      .fetchMessages({
        channels: [chatId],
        count: MESSAGE_COUNT,
        start: getFirstTimeToken(currentChatMessages) as number,
        includeMessageActions: true,
      })
      .then(result => {
        if (result.channels[chatId]) {
          const gcMessages = result.channels[chatId].map(message =>
            convertToGCMessage(message),
          );
          dispatch(
            addPrevMessagesAction({
              channelId: chatId,
              messages: gcMessages.reverse(),
            }),
          );
        }
      })
      .catch(e => console.log(e));
  }, [pubnub, chatId, dispatch]);

  const onSend = useCallback(
    async (messagesToAdd: Message[] = []) => {
      // creating new chat if there are no messages
      if (!messages.length) {
        const {workOrderId, userIds} = parseChatId(chatId);
        await createChat({users: userIds, workOrderId}).unwrap();
      }

      // adding back missing user
      if (members.length < 2) {
        const missingUsers = getMissingUsers(chatId, members);
        for (const missingUser of missingUsers) {
          await pubnub?.objects?.setMemberships({
            channels: [chatId],
            uuid: missingUser,
          });
        }
      }

      messagesToAdd.forEach(m => {
        pubnub.publish({
          message: buildMessageBody(
            m.text,
            m.user.name,
            user.pushTokens,
            chatId,
            user,
            data,
          ),
          channel: chatId,
        });
        pubnub.objects.setChannelMetadata({
          channel: chatId,
          data: {
            custom: {
              ...(currentChat?.custom || {status: 'ACTIVE'}),
              lastMessage: m.text,
            },
          },
        });
      });
    },
    [
      messages.length,
      currentChat,
      members,
      chatId,
      createChat,
      pubnub,
      user,
      data,
    ],
  );

  const onSendFiles = useCallback(
    async (files: UriFileInput[]) => {
      try {
        const responses = await Promise.all(
          files.map(file => {
            return new Promise<{error?: any}>((resolve, reject) =>
              pubnub
                .sendFile({file, channel: chatId})
                .then(() => resolve({}))
                .catch(error => reject({error})),
            );
          }),
        );
        await pubnub.objects.setChannelMetadata({
          channel: chatId,
          data: {
            custom: {
              ...(currentChat?.custom || {status: 'ACTIVE'}),
              lastMessage: `Attachment: ${
                responses.filter(response => !response.error).length
              } item(s)`,
            },
          },
        });
      } catch (e) {
        console.log(e);
      }
    },
    [pubnub, chatId, currentChat],
  );

  const downloadFile = useCallback(
    (file: PNFile): Promise<string> => {
      return pubnub.downloadFile(file).then(res => {
        return res.data.url as string;
      });
    },
    [pubnub],
  );

  const sendSignal = useCallback(
    async (type: string) => {
      if (currentChat) {
        try {
          await pubnub.signal({
            message: {
              type,
              user: getFullName(user),
            },
            channel: chatId,
          });
        } catch (error) {
          console.error(
            'Error setting typing indicator',
            (error as any).status || error,
          );
        }
      }
    },
    [chatId, currentChat, pubnub, user],
  );

  const removeChat = useCallback(async () => {
    if (currentChat) {
      try {
        await pubnub.objects.removeMemberships({
          channels: [currentChat.id],
        });
      } catch (error) {
        console.error(
          `Error leaving pubnub channel ${currentChat.id}: `,
          (error as any).status || error,
        );
      }
    }
  }, [pubnub, currentChat]);

  return {
    messages,
    getMessages,
    onSend,
    onSendFiles,
    downloadFile,
    sendSignal,
    removeChat,
  };
}
