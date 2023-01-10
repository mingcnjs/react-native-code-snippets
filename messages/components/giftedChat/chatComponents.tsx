import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Platform, StyleSheet, Text, TextInput, View} from 'react-native';
import {
  ActionsProps,
  ComposerProps,
  IMessage,
  InputToolbar,
  InputToolbarProps,
  Send,
  SendProps,
  User,
} from 'react-native-gifted-chat';
import {layoutColors} from '../../../../constants/colors';
import PictureIcon from '../../../../assets/icons/PictureIcon';
import SendArrowIcon from '../../../../assets/icons/SendArrowIcon';
import IconButton from '../../../../components/buttons/IconButton';
import {
  MESSAGE_TYPE,
  TYPING_INDICATOR_MINIMUM_CHARACTER_LIMIT,
  TYPING_INDICATOR_TIMEOUT_DURATION,
} from '../../../../constants/constants';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useKeyboardListener} from '../../../../hooks/useKeyboardListener';

const styles = StyleSheet.create({
  flex1: {flex: 1},
  inputText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: 'Lato-Regular',
  },
  input: {
    marginTop: 4,
    color: layoutColors.black100,
    backgroundColor: layoutColors.white,
    borderWidth: 1,
    borderColor: layoutColors.black20,
    paddingHorizontal: 20,
    marginHorizontal: 11,
    paddingVertical: 4,
    maxHeight: 80,
    borderRadius: 16,
  },
  transparentText: {
    position: 'absolute',
    backgroundColor: 'red',
    left: 32,
    right: 32,
    bottom: 0,
    opacity: 0,
  },
  inputToolbarContainer: {
    backgroundColor: layoutColors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -20,
    },
    shadowOpacity: 0.06,
    shadowRadius: 19,
    borderTopWidth: 0,
    elevation: 20,
    padding: 0,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  inputToolbar: {alignItems: 'center'},
  sendButton: {backgroundColor: 'transparent'},
});

export function CustomInputToolbar(
  props: InputToolbarProps<any> & {textLines: number},
) {
  const {bottom: safeAreaBottom} = useSafeAreaInsets();
  const [keyboardIsShown, setKeyboardIsShown] = useState(false);

  useKeyboardListener({
    onWillShow: () => setKeyboardIsShown(true),
    onWillHide: () => setKeyboardIsShown(false),
  });

  const bottom = 18 * props.textLines + 8 - safeAreaBottom;
  const paddingBottom = safeAreaBottom || 18;

  return (
    <InputToolbar
      {...props}
      containerStyle={[
        styles.inputToolbarContainer,
        (!safeAreaBottom || keyboardIsShown) && {paddingBottom},
        Platform.OS === 'ios' && keyboardIsShown && {bottom},
      ]}
      primaryStyle={styles.inputToolbar}
    />
  );
}

export function CustomComposer(
  props: ComposerProps & {
    onSend: SendProps<IMessage>['onSend'];
    sendSignal: (type: string) => void;
    channelId: string;
    user: User;
    setTextLines: Dispatch<SetStateAction<number>>;
    disabled?: boolean;
  },
) {
  const {text, onSend, sendSignal, onTextChanged, setTextLines, disabled} =
    props;
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (text && text?.length >= TYPING_INDICATOR_MINIMUM_CHARACTER_LIMIT) {
      if (!timerRef.current) {
        sendSignal(MESSAGE_TYPE.TYPING_MESSAGE_ON);
      }
      timerRef.current = setTimeout(async () => {
        sendSignal(MESSAGE_TYPE.TYPING_MESSAGE_OFF);
        timerRef.current = undefined;
      }, TYPING_INDICATOR_TIMEOUT_DURATION * 1000);
    } else if (timerRef.current) {
      sendSignal(MESSAGE_TYPE.TYPING_MESSAGE_OFF);
      timerRef.current = undefined;
    }
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [sendSignal, text]);

  return (
    <View style={styles.flex1}>
      <TextInput
        editable={!disabled}
        value={text}
        placeholder={'Type something...'}
        onChangeText={onTextChanged}
        style={[styles.input, styles.inputText]}
        multiline
        onSubmitEditing={() => {
          if (onSend) {
            onSend({text}, true);
          }
        }}
        returnKeyType={'send'}
      />
      <View pointerEvents={'none'} style={styles.transparentText}>
        <Text
          style={styles.inputText}
          onTextLayout={e =>
            setTextLines(prevState => {
              const textLines = e.nativeEvent.lines.length;
              if (textLines && textLines <= 3) {
                return textLines;
              }
              if (!textLines) {
                return 1;
              }
              return prevState;
            })
          }>
          {text}
        </Text>
      </View>
    </View>
  );
}

export function renderSend(props: SendProps<IMessage>) {
  if (!props.text) {
    return null;
  }
  return (
    <Send
      {...props}
      alwaysShowSend
      disabled={!props.text}
      containerStyle={styles.sendButton}>
      <IconButton disabled>
        <SendArrowIcon />
      </IconButton>
    </Send>
  );
}

export function renderActions({onPressActionButton}: ActionsProps) {
  return (
    <IconButton onPress={onPressActionButton}>
      <PictureIcon />
    </IconButton>
  );
}
