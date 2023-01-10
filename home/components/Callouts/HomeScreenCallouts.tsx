import React, {useCallback, useState} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FontDimensions} from '../../../../components/labels/CustomText/types';
import Callout from './Callout';
import {useAppDispatch} from '../../../../redux/store';
import {setFirstSignInAction} from '../../../../redux/slices/appDataSlice';
import {CalloutProps} from './types';

const HEADER_HEIGHT = 50;
const UPCOMING_JOBS_HEADER_HEIGHT = 62;
const POINTER_HEIGHT = 12;
const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  flex1: {flex: 1},
  welcome: {
    top: HEADER_HEIGHT + UPCOMING_JOBS_HEADER_HEIGHT,
    right: 22,
    left: 22,
  },
  firstCallout: {
    bottom: POINTER_HEIGHT,
    right: 22,
    left: 18,
  },
  secondCallout: {
    top: HEADER_HEIGHT,
    left: 35,
    right: 2,
  },
  thirdCallout: {
    top: HEADER_HEIGHT + 82,
    left: 9,
    right: 38,
  },
  fourthCallout: {
    bottom: POINTER_HEIGHT,
    left: 23,
    right: 23,
  },
});

const calloutProps: CalloutProps[] = [
  {
    style: styles.welcome,
    title: 'Welcome to the Wreno App!',
    titleFontDimension: FontDimensions.TITLE1,
    content:
      'We created a short guide for you that will walk you through your new home.',
    contentFontDimension: FontDimensions.BODY1,
    footerButtonFontDimension: FontDimensions.BODY1,
    leftButtonText: 'Start Tour!',
  },
  {
    style: styles.firstCallout,
    title: 'Homescreen',
    content:
      'This is your Homescreen. Here you can find jobs to claim and jobs that are assigned to you.',
    pointer: {
      edge: 'bottom',
      offset: {
        side: 'start',
        value: 20,
      },
    },
  },
  {
    style: styles.secondCallout,
    title: 'Notification Center',
    content:
      'Here is where all your notifications will be displayed and stored.',
    pointer: {
      edge: 'top',
      offset: {
        side: 'end',
        value: 18,
      },
    },
  },
  {
    style: styles.thirdCallout,
    title: 'Job Calendar',
    content:
      'Click on a date to see if there is a job available for claim or directly assigned to you. We only display jobs that match your skillset and are within the market that you specified.',
    pointer: {
      edge: 'bottom',
      offset: {
        side: 'start',
        value: 18,
      },
    },
  },
  {
    style: styles.fourthCallout,
    title: 'My Job View',
    content: 'Once you have jobs accepted they will be listed here.',
    pointer: {
      edge: 'bottom',
      offset: {
        side: 'start',
        value: windowWidth / 3 - 24,
      },
    },
  },
  {
    style: styles.fourthCallout,
    title: 'Chat',
    content:
      'You can reach out to our coordinators at any time using the Chat function.',
    pointer: {
      edge: 'bottom',
      offset: {
        side: 'end',
        value: windowWidth / 3 - 24,
      },
    },
  },
  {
    style: styles.fourthCallout,
    title: 'Profile',
    content: 'Adjust personal information or password in your profile.',
    pointer: {
      edge: 'bottom',
      offset: {
        side: 'end',
        value: 18,
      },
    },
  },
  {
    style: styles.fourthCallout,
    title: 'Get your first job!',
    titleFontDimension: FontDimensions.TITLE1,
    content:
      'To get your first job assigned, reach out to Johannes Lamprecht via direct chat. He will assign you a TEST job.',
    contentFontDimension: FontDimensions.BODY1,
    footerButtonFontDimension: FontDimensions.BODY1,
    leftButtonText: 'Get job!',
    pointer: {
      edge: 'bottom',
      offset: {
        side: 'end',
        value: windowWidth / 3 - 24,
      },
    },
  },
];

export default function HomeScreenCallouts() {
  const dispatch = useAppDispatch();
  const [calloutIndex, setCalloutIndex] = useState(0);

  const goToNextCallout = useCallback(() => {
    setCalloutIndex(prevState => {
      if (prevState < calloutProps.length - 1) {
        return prevState + 1;
      }
      return prevState;
    });
  }, []);

  const goToPrevCallout = useCallback(() => {
    setCalloutIndex(prevState => {
      if (prevState > 0) {
        return prevState - 1;
      }
      return prevState;
    });
  }, []);

  const goBack = useCallback(() => {
    dispatch(setFirstSignInAction());
  }, [dispatch]);

  const isFirst = calloutIndex === 0;
  const isLast = calloutIndex === calloutProps.length - 1;
  const isNotFirstOrLast = !isFirst && !isLast;

  const indexText = `${calloutIndex} / ${calloutProps.length - 2}`;

  let onPressLeft = goToPrevCallout;
  if (isFirst) {
    onPressLeft = goToNextCallout;
  } else if (isLast) {
    onPressLeft = goBack;
  }

  return (
    <SafeAreaView style={StyleSheet.absoluteFill} edges={['top']}>
      <View style={styles.flex1}>
        {Boolean(calloutProps[calloutIndex]) && (
          <Callout
            {...calloutProps[calloutIndex]}
            onPressLeft={onPressLeft}
            onPressRight={isNotFirstOrLast ? goToNextCallout : undefined}
            onPressClose={isNotFirstOrLast ? goBack : undefined}
            index={isNotFirstOrLast ? indexText : undefined}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
