import React, {useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Lato from '../../../../../components/labels/Lato';
import {FontDimensions} from '../../../../../components/labels/CustomText/types';
import DoubleLineIcon from '../../../../../assets/icons/DoubleLineIcon';
import {layoutColors} from '../../../../../constants/colors';
import BackgroundColor from '../../../../../components/BackgroundColor';
import TrashBinIcon from '../../../../../assets/icons/TrashBinIcon';
import EditTextIcon from '../../../../../assets/icons/EditTextIcon';

const styles = StyleSheet.create({
  container: {
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: layoutColors.black10,
  },
  height54: {height: 54},
  item: {
    backgroundColor: layoutColors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 25,
  },
  inputText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: 'Lato-Regular',
    paddingHorizontal: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 5,
  },
  actionButton: {
    height: 44,
    aspectRatio: 1,
    borderRadius: 4,
    backgroundColor: layoutColors.green10,
    marginRight: 5,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragButton: {padding: 14},
  backgroundWhite: {backgroundColor: layoutColors.white},
});

type Props = {
  text: string;
  onDeleteItem: () => void;
  onChangeItem: (newText: string) => void;
  isDragging: boolean;
  drag: () => void;
  readonly?: boolean;
};

export default function SwipeableItem(props: Props) {
  const {
    text,
    onDeleteItem,
    onChangeItem,
    isDragging,
    drag,
    readonly = false,
  } = props;
  const scrollRef = useRef<ScrollView>(null);

  const [scrollWidth, setScrollWidth] = useState(0);
  const [isSwiped, setIsSwiped] = useState(false);
  const [inputMode, setInputMode] = useState(false);
  const [editedText, setEditedText] = useState(text);

  function scrollToEnd() {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd();
    }
  }
  function scrollToStart() {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({x: 0, animated: true});
    }
  }

  function onEndEditing() {
    if (editedText && text !== editedText) {
      onChangeItem(editedText);
    } else {
      setEditedText(text);
    }
    setInputMode(false);
  }

  if (inputMode) {
    return (
      <View style={styles.container}>
        <TextInput
          editable={!readonly}
          autoFocus
          value={editedText}
          onChangeText={setEditedText}
          style={[styles.item, styles.inputText, styles.height54]}
          onBlur={onEndEditing}
          onSubmitEditing={onEndEditing}
          returnKeyType={'done'}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        scrollEnabled={!isDragging && !readonly}
        onLayout={e => {
          setScrollWidth(e.nativeEvent.layout.width);
        }}
        onScrollEndDrag={e => {
          const offsetX = e.nativeEvent.contentOffset.x;
          if (!isSwiped && offsetX > 5) {
            setIsSwiped(true);
            scrollToEnd();
          } else if (isSwiped && offsetX < 95) {
            setIsSwiped(false);
            scrollToStart();
          } else if (isSwiped) {
            scrollToEnd();
          } else {
            scrollToStart();
          }
        }}
        style={styles.height54}
        horizontal
        showsHorizontalScrollIndicator={false}>
        <View style={[styles.item, {width: scrollWidth}]}>
          <TouchableOpacity
            onLongPress={drag}
            activeOpacity={1}
            disabled={isDragging || readonly}
            style={styles.dragButton}>
            <DoubleLineIcon />
          </TouchableOpacity>
          <Lato fontDimensions={FontDimensions.BODY1}>{text}</Lato>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            disabled={isDragging || readonly}
            onPress={() => setInputMode(true)}
            activeOpacity={0.7}
            style={styles.actionButton}>
            <EditTextIcon />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onDeleteItem}
            disabled={isDragging || readonly}
            style={[styles.actionButton, styles.backgroundWhite]}>
            <BackgroundColor color={layoutColors.red} opacity={0.1} />
            <TrashBinIcon />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
