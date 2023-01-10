import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet} from 'react-native';
import Lato from '../../../components/labels/Lato';
import {
  FontDimensions,
  fontDimensionStyles,
} from '../../../components/labels/CustomText/types';

const MAX_LINES_COUNT = 3;
const LINE_HEIGHT = fontDimensionStyles[FontDimensions.BODY1].lineHeight;

const styles = StyleSheet.create({
  tasks: {overflow: 'hidden'},
});

type Props = {
  taskList: string[];
  showAll?: boolean;
};

export default function TaskList(props: Props) {
  const {taskList, showAll = false} = props;
  const height = useRef(
    new Animated.Value(LINE_HEIGHT * MAX_LINES_COUNT),
  ).current;

  const totalNumberOfLines = useRef(0);
  const [totalLines, setTotalLines] = useState(0);
  const [taskToHide, setTaskToHide] = useState<{
    index: number;
    numberOfLines: number;
  }>();

  const animateHeight = useCallback(
    (toValue: number) => {
      Animated.timing(height, {
        toValue,
        duration: 300,
        useNativeDriver: false,
      }).start();
    },
    [height],
  );

  useEffect(() => {
    if (showAll) {
      animateHeight(LINE_HEIGHT * totalLines);
    } else if (taskToHide && taskToHide.numberOfLines === 0) {
      animateHeight(LINE_HEIGHT * (MAX_LINES_COUNT - 1));
    } else {
      animateHeight(LINE_HEIGHT * MAX_LINES_COUNT);
    }
  }, [showAll, animateHeight, totalLines, taskToHide]);

  return (
    <Animated.View style={[styles.tasks, {height}]}>
      {taskList.map((task, index, array) => {
        const isLast = index === array.length - 1;
        const taskText = `${index + 1}. ${task}`;
        const numberOfLines =
          !showAll &&
          taskToHide &&
          taskToHide.index === index &&
          taskToHide.numberOfLines !== 0
            ? taskToHide.numberOfLines
            : undefined;

        return (
          <Lato
            key={task + index}
            fontDimensions={FontDimensions.BODY1}
            numberOfLines={numberOfLines}
            onTextLayout={e => {
              const linesCount = e.nativeEvent.lines.length;
              if (index === 0) {
                totalNumberOfLines.current = linesCount;
              } else {
                totalNumberOfLines.current += linesCount;
              }
              if (
                !taskToHide &&
                totalNumberOfLines.current >= MAX_LINES_COUNT
              ) {
                setTaskToHide({
                  index,
                  numberOfLines:
                    linesCount - (totalNumberOfLines.current - MAX_LINES_COUNT),
                });
              }
              if (isLast) {
                setTotalLines(totalNumberOfLines.current);
              }
            }}>
            {taskText}
          </Lato>
        );
      })}
    </Animated.View>
  );
}
