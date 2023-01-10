import React from 'react';
import ChatList from './components/ChatList';
import {CHAT_TYPES} from '../../types/chat';
import {ChannelEntity} from '@pubnub/react-chat-components';
import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {ChatsTabNavigator, HomeStackParamList} from '../../types/paramlists';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type Props = CompositeScreenProps<
  MaterialTopTabScreenProps<ChatsTabNavigator, 'JobChatsScreen'>,
  NativeStackScreenProps<HomeStackParamList>
>;

export default function JobChatsScreen(props: Props) {
  const {navigation} = props;
  // todo useCallback if needed
  function onPressChat(chat: ChannelEntity) {
    navigation.navigate('ChatScreen', {
      chatId: chat.id,
      title: chat.name!,
    });
  }
  return <ChatList onPressChat={onPressChat} chatType={CHAT_TYPES.JOB_CHAT} />;
}
