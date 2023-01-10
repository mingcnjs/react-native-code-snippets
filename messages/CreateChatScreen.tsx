import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../../types/paramlists';
import {FlatList, StyleSheet, TouchableHighlight, View} from 'react-native';
import {layoutColors} from '../../constants/colors';
import Lato from '../../components/labels/Lato';
import {
  FontDimensions,
  FontWeights,
} from '../../components/labels/CustomText/types';
import Avatar from '../../components/Avatar';
import {CHAT_TYPES} from '../../types/chat';
import {useAppSelector} from '../../redux/store';
import {getChannelId} from '../../utils/chat';
import {useUserList} from './useUserList';
import {IRole} from '../../types/account';
import Loading from '../../components/Loading';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: layoutColors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  scrollView: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  contentContainer: {paddingVertical: 20},
  user: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 9,
  },
  bottomMargin5: {marginBottom: 5},
  leftMargin14: {marginLeft: 14},
  topPadding16: {paddingTop: 16},
  bottom59: {bottom: 59},
});

type Props = NativeStackScreenProps<HomeStackParamList, 'CreateChatScreen'>;

export default function CreateChatScreen(props: Props) {
  const {navigation} = props;
  const {users, fetchMore, isLoading, refetch} = useUserList();

  const user = useAppSelector(state => state.auth.user);

  const filteredUsers = users
    .filter(u => u.id !== `${user.id}`)
    .filter(
      ({custom: {role}}) => role === IRole.ADMIN || role === IRole.COORDINATOR,
    );

  return (
    <View style={styles.container}>
      <FlatList
        refreshing={isLoading}
        onRefresh={refetch}
        data={filteredUsers}
        renderItem={({item, index}) => {
          return (
            <TouchableHighlight
              underlayColor={layoutColors.black10}
              onPress={() =>
                navigation.replace('DirectChatScreen', {
                  chatId: getChannelId(
                    CHAT_TYPES.DIRECT,
                    undefined,
                    item.id,
                    user.id,
                  ),
                  title: item.name as string,
                  description: item.custom.role as string,
                })
              }
              style={[styles.user, index === 0 && styles.topPadding16]}>
              <>
                <Avatar name={item.name!} />

                <View style={styles.leftMargin14}>
                  <Lato
                    fontDimensions={FontDimensions.BODY1}
                    fontWeight={FontWeights.BOLD}
                    style={styles.bottomMargin5}>
                    {item.name}
                  </Lato>

                  <Lato
                    fontDimensions={FontDimensions.CAPTION1}
                    color={layoutColors.black70}>
                    {item.custom?.phoneNumber}
                  </Lato>
                </View>
              </>
            </TouchableHighlight>
          );
        }}
        keyExtractor={item => item.id}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={() => <Loading />}
      />
    </View>
  );
}
