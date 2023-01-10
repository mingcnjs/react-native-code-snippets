import {usePubNub} from 'pubnub-react';
import {store, useAppDispatch, useAppSelector} from '../../redux/store';
import {useEffect, useMemo, useRef} from 'react';
import {
  addReadReceiptToMessageAction,
  appendMessagesAction,
  setChannelsAction,
  setMessagesAction,
  setTypingUserAction,
} from '../../redux/slices/chatSlice';
import {
  FileEvent,
  MessageActionEvent,
  MessageEvent,
  ObjectsEvent,
  SignalEvent,
} from 'pubnub';
import {convertFileToGCMessage, convertToGCMessage} from './useChat';
import {MESSAGE_TYPE} from '../../constants/constants';
import bigInt from 'big-integer';
import {useGetChatTokenQuery} from '../../services/endpoints/auth';
import {ChannelEntity} from '@pubnub/react-chat-components';

const MISSING_MESSAGES = 100;

function getEnd() {
  const messagesMap = store.getState().chat.messages;
  const lastMessages = Object.values(messagesMap)
    .map(msgs => bigInt(msgs[0].timetoken as string))
    .sort();

  return lastMessages[lastMessages.length - 1]?.plus(1).toString();
}

export default function usePubNubChat() {
  const channels = useAppSelector(state => state.chat.channels);
  const pubnub = usePubNub();
  const {data} = useGetChatTokenQuery();
  const user = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  const missingMessagesFetched = useRef(false);

  const subscriptionIds = useMemo(
    () => JSON.stringify([...channels.map(ch => ch.id), user.id]),
    [channels, user.id],
  );

  useEffect(() => {
    const channelIds = JSON.parse(subscriptionIds);
    console.log('subscribing to ', channelIds.length);
    pubnub.subscribe({
      channels: channelIds,
    });
  }, [pubnub, subscriptionIds]);

  useEffect(() => {
    if (data && channels.length && !missingMessagesFetched.current) {
      missingMessagesFetched.current = true;
      const end = getEnd();
      pubnub
        .fetchMessages({
          channels: [...channels.map(ch => ch.id)],
          count: end ? MISSING_MESSAGES : 1,
          end,
        })
        .then(result => {
          const channelMessages = Object.entries(result.channels);
          channelMessages.forEach(([chatId, msgs]) => {
            const gcMessages = msgs.map(message => convertToGCMessage(message));
            if (gcMessages.length === MISSING_MESSAGES) {
              /** if there are too many new messages we overwrite  */
              dispatch(
                setMessagesAction({
                  channelId: chatId,
                  messages: gcMessages.reverse(),
                }),
              );
            } else {
              dispatch(
                appendMessagesAction({
                  channelId: chatId,
                  messages: gcMessages.reverse(),
                }),
              );
            }
          });
        })
        .catch(e => console.error(e));
    }
  }, [channels, data, dispatch, pubnub]);

  useEffect(() => {
    const handleSignal = (signal: SignalEvent) => {
      if (signal.publisher !== `${user.id}` && signal.message?.type) {
        const message: {type: string; user: string} = signal.message;
        if (message.type === MESSAGE_TYPE.TYPING_MESSAGE_ON && message?.user) {
          dispatch(
            setTypingUserAction({
              channelId: signal.channel,
              username: message.user,
              value: true,
            }),
          );
        } else if (
          message.type === MESSAGE_TYPE.TYPING_MESSAGE_OFF &&
          message?.user
        ) {
          dispatch(
            setTypingUserAction({
              channelId: signal.channel,
              username: message.user,
              value: false,
            }),
          );
        }
      }
    };
    const handleMessageActionEvent = (messageAction: MessageActionEvent) => {
      if (
        messageAction.data.type === 'receipt' &&
        messageAction.data.value === 'read' &&
        messageAction.data.uuid !== `${user.id}`
      ) {
        dispatch(addReadReceiptToMessageAction(messageAction));
      }
    };
    function fetch() {
      pubnub.objects
        .getMemberships({
          include: {
            channelFields: true,
            customChannelFields: true,
            customFields: true,
          },
        })
        .then(result => {
          if (result.data) {
            const channelsData = result.data.map(d => d.channel);
            dispatch(setChannelsAction(channelsData as ChannelEntity[]));
          }
        })
        .catch(error => {
          console.warn(error);
        });
    }

    const handleChannelUpdates = (objectEvent: ObjectsEvent) => {
      if (
        (objectEvent.message?.type === 'membership' ||
          objectEvent.message?.type === 'channel') &&
        objectEvent.channel?.includes(pubnub.getUUID())
      ) {
        console.log('new channel', objectEvent);
        fetch();
      }
    };
    const handleFiles = (file: FileEvent) => {
      convertFileToGCMessage(file).then(gcMessage => {
        dispatch(
          appendMessagesAction({
            channelId: file.channel,
            messages: [gcMessage],
          }),
        );
      });
    };
    const handleMessages = (envelope: MessageEvent) => {
      console.log('new message', envelope);
      const gcMessage = convertToGCMessage(envelope);
      dispatch(
        appendMessagesAction({
          channelId: envelope.channel,
          messages: [gcMessage],
        }),
      );
    };
    const listener = {
      message: handleMessages,
      file: handleFiles,
      signal: handleSignal,
      messageAction: handleMessageActionEvent,
      objects: handleChannelUpdates,
    };
    if (data) {
      // console.log('initial fetch');
      fetch();
      pubnub.addListener(listener);
    }
    return () => {
      pubnub.removeListener(listener);
      pubnub.unsubscribeAll();
    };
  }, [data, dispatch, pubnub, user.id]);
}
