import React, {useLayoutEffect, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {layoutColors} from '../../constants/colors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../types/paramlists';
import {useAppSelector} from '../../redux/store';
import HeaderButton from '../job/components/HeaderButton';
import OptionsIcon from '../../assets/icons/OptionsIcon';
import ChatHeaderTitle from './components/ChatHeaderTitle';
import {SafeAreaView} from 'react-native-safe-area-context';
import JobChatDetails from './components/JobChatDetails';
import CustomGiftedChat from './components/giftedChat/CustomGiftedChat';
import {parseChatId} from '../../utils/chat';

const styles = StyleSheet.create({
  flex1: {flex: 1, backgroundColor: layoutColors.lightBeige},
  horizontalMarginM20: {marginHorizontal: -20},
});

type Props = NativeStackScreenProps<HomeStackParamList, 'ChatScreen'>;

export default function ChatScreen(props: Props) {
  const {navigation, route} = props;
  const {chatId, title} = route.params;
  const {workOrderId} = parseChatId(chatId);
  const user = useAppSelector(state => state.auth.user);

  const [showOptions, setShowOptions] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButton onPress={() => setShowOptions(prevState => !prevState)}>
            <OptionsIcon />
          </HeaderButton>
        );
      },
      headerTitle: () => {
        return <ChatHeaderTitle chatTitle={title} />;
      },
    });
  }, [user, navigation, title]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.flex1}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={layoutColors.lightBeige}
      />
      <CustomGiftedChat
        chatId={chatId}
        showOptions={showOptions}
        setShowOptions={setShowOptions}
        ListHeaderComponent={
          // TODO make this card appear-hide when user scrolls list up-down
          <View style={styles.horizontalMarginM20}>
            <JobChatDetails workOrderId={workOrderId} />
          </View>
        }
      />
    </SafeAreaView>
  );
}
