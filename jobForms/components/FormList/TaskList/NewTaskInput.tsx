import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {layoutColors} from '../../../../../constants/colors';
import React, {useCallback, useState} from 'react';
import AddIcon2 from '../../../../../assets/icons/AddIcon2';
import Lato from '../../../../../components/labels/Lato';
import {FontDimensions} from '../../../../../components/labels/CustomText/types';
import StyledInput from '../../../../../components/StyledInput';

const styles = StyleSheet.create({
  item: {
    paddingVertical: 17,
    paddingLeft: 15,
    paddingRight: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addIcon: {
    height: 24,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
});

type Props = {
  title?: string;
  onSetService: (service: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  readonly?: boolean;
};

export default function NewTaskInput(props: Props) {
  const {title = '', onSetService, onFocus, onBlur, readonly = false} = props;

  const [inputMode, setInputMode] = useState(false);
  const [text, setText] = useState('');

  const onEndEditing = useCallback(() => {
    if (text) {
      onSetService(text);
    }
    if (onBlur) {
      onBlur();
    }
    setText('');
    setInputMode(false);
  }, [text, onSetService, onBlur]);

  if (inputMode) {
    return (
      <StyledInput
        editable={!readonly}
        autoFocus
        onFocus={onFocus}
        value={text}
        onChangeText={setText}
        style={[styles.item]}
        onBlur={onEndEditing}
        onSubmitEditing={onEndEditing}
        returnKeyType={'done'}
      />
    );
  }

  return (
    <TouchableOpacity
      disabled={readonly}
      activeOpacity={0.7}
      onPress={() => setInputMode(true)}
      style={styles.item}>
      <View style={styles.addIcon}>
        <AddIcon2 fill={layoutColors.black60} />
      </View>
      <Lato fontDimensions={FontDimensions.BODY1} color={layoutColors.black60}>
        {title}
      </Lato>
    </TouchableOpacity>
  );
}
