import React from 'react';
import {CHAT_TYPES} from '../../../types/chat';
import {ChannelEntity} from '@pubnub/react-chat-components';
import {IUser} from '../../../types/account';
import Avatar from '../../../components/Avatar';
import {getFullName} from '../../../utils/utils';
import {StyleProp, ViewStyle} from 'react-native';

type Props = {
  user: IUser;
  chatType: CHAT_TYPES;
  chat: ChannelEntity;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export default function ChatItemPicture(props: Props) {
  const {chat, chatType, user, size, style} = props;

  let name = chat.name ? chat.name.split(' ')[0] : '';
  if (chatType === CHAT_TYPES.DIRECT && chat.name) {
    const userNames = chat.name
      .split(',')
      .filter(userName => userName !== getFullName(user));
    name = userNames.length > 0 ? userNames[0] : '';
  }

  return <Avatar name={name} size={size} style={style} />;
}
