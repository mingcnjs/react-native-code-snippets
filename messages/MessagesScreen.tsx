import React from 'react';
import {StyleSheet} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {layoutColors} from '../../constants/colors';
import tabBarIndicator from '../shiftInProgress/components/tabBarIndicator';
import JobChatsScreen from './JobChatsScreen';
import {SafeAreaView} from 'react-native-safe-area-context';
import Archivo from '../../components/labels/Archivo';
import {FontDimensions} from '../../components/labels/CustomText/types';
import DirectChatsScreen from './DirectChatsScreen';
import {ChatsTabNavigator} from '../../types/paramlists';

const styles = StyleSheet.create({
  flex1: {flex: 1},
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 10,
    paddingBottom: 15,
    backgroundColor: layoutColors.white,
    shadowRadius: 5,
    shadowOpacity: 1,
    shadowColor: `rgba(${layoutColors.black100RGB}, 0.05)`,
    zIndex: 2,
    elevation: 9,
  },
  scene: {backgroundColor: layoutColors.lightBeige},
  tabBar: {
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: -5,
    },
    backgroundColor: layoutColors.lightBeige,
  },
  tabBarLabel: {
    fontSize: 11,
    fontFamily: 'Archivo-Bold',
    letterSpacing: 1,
  },
});

const TopTab = createMaterialTopTabNavigator<ChatsTabNavigator>();

export default function MessagesScreen() {
  return (
    <>
      <SafeAreaView edges={['top']} style={styles.header}>
        <Archivo fontDimensions={FontDimensions.TITLE1}>Messages</Archivo>
      </SafeAreaView>
      <TopTab.Navigator
        sceneContainerStyle={styles.scene}
        screenOptions={{
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: layoutColors.black100,
          tabBarInactiveTintColor: layoutColors.black60,
          tabBarIndicator,
        }}>
        <TopTab.Screen
          name={'JobChatsScreen'}
          component={JobChatsScreen}
          options={{title: 'Job Chats'}}
        />
        <TopTab.Screen
          name={'DirectChatsScreen'}
          component={DirectChatsScreen}
          options={{title: 'Direct Messages'}}
        />
      </TopTab.Navigator>
    </>
  );
}
