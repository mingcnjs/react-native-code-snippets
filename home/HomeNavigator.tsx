import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeParamList} from '../../types/paramlists';
import HomeScreen from './HomeScreen';

const Stack = createNativeStackNavigator<HomeParamList>();

export default function HomeNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={'HomeScreen'}
        component={HomeScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
