import React, {useState} from 'react';
import {SectionList, StyleSheet, View} from 'react-native';
import ChatItem from './ChatItem';
import {CHAT_TYPES} from '../../../types/chat';
import {useAppSelector} from '../../../redux/store';
import {Message} from '../../../redux/slices/chatSlice';
import {ChannelEntity} from '@pubnub/react-chat-components';
import Archivo from '../../../components/labels/Archivo';
import {
  FontDimensions,
  FontWeights,
} from '../../../components/labels/CustomText/types';
import {layoutColors} from '../../../constants/colors';

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 20,
    backgroundColor: layoutColors.lightBeige,
  },
  line: {
    height: 1,
    backgroundColor: layoutColors.black10,
    flex: 1,
  },
  rightMargin9: {marginRight: 9},
});

function compareChatsByLastMessage(messagesMap: Record<string, Message[]>) {
  return (a: ChannelEntity, b: ChannelEntity) => {
    const lastMessageA = messagesMap[a.id]?.[0].createdAt as number;
    const lastMessageB = messagesMap[b.id]?.[0].createdAt as number;
    return lastMessageB - lastMessageA;
  };
}

function sameType(chatType: CHAT_TYPES) {
  return (channel: ChannelEntity) => channel.id.startsWith(chatType);
}

function hasMessages(messagesMap: Record<string, Message[]>) {
  return (channel: ChannelEntity) => messagesMap[channel.id]?.length;
}

const ARCHIVED = 'ARCHIVED';
const ACTIVE = 'ACTIVE';
type ChatsSection = {title: string; data: ChannelEntity[]};

type Props = {
  chatType: CHAT_TYPES;
  onPressChat: Function;
};

export default function ChatList(props: Props) {
  const {chatType, onPressChat} = props;

  const [now, setNow] = useState(new Date());
  const messagesMap = useAppSelector(state => state.chat.messages);

  const chats = useAppSelector(state => state.chat.channels)
    .filter(sameType(chatType))
    .filter(hasMessages(messagesMap))
    .sort(compareChatsByLastMessage(messagesMap));

  const sections = chats.reduce<ChatsSection[]>(
    (arr, item) => {
      if (item.custom?.status === ARCHIVED) {
        arr[1].data.push(item);
      } else {
        arr[0].data.push(item);
      }
      return arr;
    },
    [
      {title: ACTIVE, data: []},
      {title: ARCHIVED, data: []},
    ],
  );

  function refreshFunction() {
    setNow(new Date());
  }

  return (
    <SectionList
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      refreshing={false}
      onRefresh={refreshFunction}
      sections={sections}
      renderSectionHeader={({section: {title, data}}) => {
        if (title === ARCHIVED && data.length) {
          return (
            <View style={styles.sectionHeader}>
              <View style={[styles.line, styles.rightMargin9]} />
              <Archivo
                fontDimensions={FontDimensions.CALLOUT2}
                fontWeight={FontWeights.BOLD}
                color={layoutColors.black80}
                style={styles.rightMargin9}>
                {title}
              </Archivo>
              <View style={styles.line} />
            </View>
          );
        }
        return null;
      }}
      renderItem={({item}) => (
        <ChatItem
          chatType={chatType}
          chat={item}
          now={now}
          onPressChat={() => {
            onPressChat(item);
          }}
        />
      )}
      keyExtractor={item => item.id}
    />
  );
}
