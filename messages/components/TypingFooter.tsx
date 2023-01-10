import React from 'react';
import {StyleSheet, View} from 'react-native';
import {layoutColors} from '../../../constants/colors';
import {useAppSelector} from '../../../redux/store';
import {
  FontDimensions,
  FontWeights,
} from '../../../components/labels/CustomText/types';
import Lato from '../../../components/labels/Lato';

const styles = StyleSheet.create({
  footer: {
    marginHorizontal: 10,
  },
  bottomMargin6: {marginBottom: 6},
});

type Props = {
  channelId: string;
};

export default function TypingFooter(props: Props) {
  const {channelId} = props;

  const typingUsers = useAppSelector(state => state.chat.typing[channelId]);

  if (typingUsers) {
    return (
      <View style={styles.footer}>
        {Object.keys(typingUsers)
          .filter(key => typingUsers[key])
          .map(username => {
            return (
              <Lato
                key={username}
                fontDimensions={FontDimensions.BODY2}
                color={layoutColors.black60}
                style={styles.bottomMargin6}>
                <Lato
                  fontDimensions={FontDimensions.BODY2}
                  fontWeight={FontWeights.BOLD}
                  color={layoutColors.black60}>
                  {username}
                </Lato>{' '}
                is typing...
              </Lato>
            );
          })}
      </View>
    );
  }
  return null;
}
