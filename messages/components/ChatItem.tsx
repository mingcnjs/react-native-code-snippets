import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {layoutColors} from '../../../constants/colors';
import {CHAT_TYPES} from '../../../types/chat';
import {useAppSelector} from '../../../redux/store';
import Lato from '../../../components/labels/Lato';
import Inter from '../../../components/labels/Inter';
import {
  FontDimensions,
  FontWeights,
} from '../../../components/labels/CustomText/types';
import {ChannelEntity} from '@pubnub/react-chat-components';
import ChatItemPicture from './ChatItemPicture';
import {getPastTime, getFullName} from '../../../utils/utils';
import {Message} from '../../../redux/slices/chatSlice';
import Pubnub from 'pubnub';
import {IUser} from '../../../types/account';

const styles = StyleSheet.create({
  chat: {
    paddingVertical: 16,
    paddingLeft: 16,
    paddingRight: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: layoutColors.white,
    borderRadius: 10,
  },
  chatRight: {
    flex: 1,
    marginLeft: 12,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatTitle: {
    flexGrow: 1,
    flexShrink: 1,
  },
  lastMessageTime: {
    marginLeft: 5,
    flexGrow: 0,
    flexShrink: 0,
  },
  badgeContainer: {
    position: 'absolute',
    top: -3,
    right: -4,
    minWidth: 24,
    aspectRatio: 1,
    borderRadius: 24,
    padding: 3,
    backgroundColor: layoutColors.white,
  },
  badge: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: layoutColors.red3,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function getLastMessageTime(
  dateStr: number | Date,
  now: Date,
): string | undefined {
  const date = dateStr ? new Date(dateStr) : new Date();

  return getPastTime(date, now);
}

type Props = {
  chat: ChannelEntity;
  chatType: CHAT_TYPES;
  now: Date;
  onPressChat?: () => void;
};

export function getBadge(messages: Message[] = [], user: IUser) {
  let badge = 0;
  for (const message of messages) {
    if (message.read || message.user._id === user.id) {
      break;
    }
    badge++;
  }
  return badge;
}

function getChatName(
  chat: Pubnub.ChannelMetadataObject<Pubnub.ObjectCustom>,
  chatType: CHAT_TYPES,
  user: IUser,
) {
  if (chatType === CHAT_TYPES.DIRECT && chat.name) {
    return chat.name.replace(',', '').replace(getFullName(user), '');
  }
  return chat.name;
}

export default function ChatItem(props: Props) {
  const {chat, now, onPressChat, chatType} = props;

  const user = useAppSelector(state => state.auth.user);
  const chatMessages = useAppSelector(state => state.chat.messages[chat.id]);
  const lastMessage = chatMessages[0];

  const badge = getBadge(chatMessages, user);

  const typing = useAppSelector(state => state.chat.typing);

  const hasBadge = badge > 0 && chat.custom?.[user.id] !== lastMessage._id;

  const name = getChatName(chat, chatType, user);

  const lastMessageText = Object.values(typing?.[chat.id] || {}).find(
    value => value,
  )
    ? 'Typing...'
    : lastMessage?.text;

  const text = lastMessageText ? lastMessageText : chat.custom?.lastMessage;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPressChat}
      style={styles.chat}>
      <View>
        <ChatItemPicture user={user} chatType={chatType} chat={chat} />
        {hasBadge && (
          <View style={styles.badgeContainer}>
            <View style={styles.badge}>
              <Lato
                fontDimensions={FontDimensions.HEADLINE2}
                fontWeight={FontWeights.BOLD}
                color={layoutColors.white}>
                {badge || ''}
              </Lato>
            </View>
          </View>
        )}
      </View>

      <View style={styles.chatRight}>
        <View style={styles.chatHeader}>
          <Lato
            fontDimensions={FontDimensions.BODY1}
            fontWeight={FontWeights.BOLD}
            style={styles.chatTitle}
            color={layoutColors.deep100}
            numberOfLines={1}>
            {name}
          </Lato>
          <Inter
            fontDimensions={FontDimensions.BODY2}
            color={layoutColors.black30}
            style={styles.lastMessageTime}>
            {lastMessage ? getLastMessageTime(lastMessage.createdAt, now) : ''}
          </Inter>
        </View>
        <Lato
          fontDimensions={FontDimensions.CAPTION1}
          color={layoutColors.black70}
          numberOfLines={2}>
          {text}
        </Lato>
      </View>
    </TouchableOpacity>
  );
}
