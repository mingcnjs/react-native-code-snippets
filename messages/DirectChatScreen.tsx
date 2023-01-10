import React, {useLayoutEffect, useState} from 'react';
import {StatusBar, StyleSheet} from 'react-native';
import {layoutColors} from '../../constants/colors';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../types/paramlists';
import {useAppSelector} from '../../redux/store';
import HeaderButton from '../job/components/HeaderButton';
import OptionsIcon from '../../assets/icons/OptionsIcon';
import {SafeAreaView} from 'react-native-safe-area-context';
import DirectChatHeaderTitle from './components/DirectChatHeaderTitle';
import CustomGiftedChat from './components/giftedChat/CustomGiftedChat';
import {CustomUserEntity} from '../../redux/slices/chatSlice';
import {IUser} from '../../types/account';
import {parseChatId} from '../../utils/chat';

const styles = StyleSheet.create({
  flex1: {flex: 1, backgroundColor: layoutColors.lightBeige},
});

type Props = NativeStackScreenProps<HomeStackParamList, 'DirectChatScreen'>;

function getDescription(
  chatId: string,
  user: IUser,
  usersMap: Record<string, CustomUserEntity>,
) {
  const {other} = parseChatId(chatId, user);
  return usersMap[other!]?.custom.role;
}

export default function DirectChatScreen(props: Props) {
  const {navigation, route} = props;
  const {chatId, title, description} = route.params;

  const user = useAppSelector(state => state.auth.user);
  const usersMap = useAppSelector(state => state.chat.users);
  const descriptionStr = description || getDescription(chatId, user, usersMap);

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
        return (
          <DirectChatHeaderTitle
            description={descriptionStr}
            chatTitle={title}
          />
        );
      },
    });
  }, [descriptionStr, navigation, title]);

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
      />
    </SafeAreaView>
  );
}
