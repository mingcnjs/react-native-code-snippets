import React from 'react';
import ChatList from './components/ChatList';
import {CHAT_TYPES} from '../../types/chat';
import FloatingActionButton from '../../components/buttons/FloatingActionButton';
import AddIcon from '../../assets/icons/AddIcon';
import {CompositeScreenProps} from '@react-navigation/native';
import {MaterialTopTabScreenProps} from '@react-navigation/material-top-tabs';
import {ChatsTabNavigator, HomeStackParamList} from '../../types/paramlists';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ChannelEntity} from '@pubnub/react-chat-components';
import {useAppSelector} from '../../redux/store';
import {getDirectChatTitle} from '../../utils/chat';

type Props = CompositeScreenProps<
  MaterialTopTabScreenProps<ChatsTabNavigator, 'DirectChatsScreen'>,
  NativeStackScreenProps<HomeStackParamList>
>;

export default function DirectChatsScreen(props: Props) {
  const {navigation} = props;

  const {user} = useAppSelector(state => state.auth);

  function onPressChat(chat: ChannelEntity) {
    navigation.navigate('DirectChatScreen', {
      chatId: chat.id,
      title: getDirectChatTitle(chat.name!, user),
    });
  }

  return (
    <>
      <ChatList chatType={CHAT_TYPES.DIRECT} onPressChat={onPressChat} />
      <FloatingActionButton
        Icon={<AddIcon />}
        onPress={() => {
          navigation.navigate('CreateChatScreen', {
            chatType: CHAT_TYPES.DIRECT,
          });
        }}
      />
    </>
  );
}
