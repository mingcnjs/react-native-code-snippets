import React, {useCallback, useMemo, useState} from 'react';
import {
  FormField as IFormField,
  FormFieldType,
} from '../../../../types/jobForm';
import {ScaleDecorator, ShadowDecorator} from 'react-native-draggable-flatlist';
import Archivo from '../../../../components/labels/Archivo';
import {FontDimensions} from '../../../../components/labels/CustomText/types';
import {layoutColors} from '../../../../constants/colors';
import {Platform, StyleSheet, View} from 'react-native';
import {FormsComponentProps, Task} from './types';
import {stringToArrayOfString} from '../../../../utils/utils';
import SwipeableItem from './TaskList/SwipeableItem';
import NewTaskInput from './TaskList/NewTaskInput';
import Lato from '../../../../components/labels/Lato';
import KeyboardAwareDraggableFlatList from '../../../../components/KeyboardAwareDraggableFlatList';
import ErrorText from '../ErrorText';

const styles = StyleSheet.create({
  flex1: {flex: 1},
  shadow: {
    shadowOffset: {height: 0, width: 0},
    shadowRadius: 5,
    shadowOpacity: 0.05,
    shadowColor:
      Platform.OS === 'android'
        ? `rgba(${layoutColors.black100RGB},0.2)`
        : layoutColors.black100,
    elevation: 4,
  },
  taskListHeader: {
    paddingTop: 25,
    paddingHorizontal: 20,
    backgroundColor: layoutColors.white,
  },
  taskListTopBorder: {
    height: 10,
    borderColor: layoutColors.black10,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderRadius: 5,
    marginBottom: -5,
  },
  taskListFooter: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    marginBottom: 20,
    backgroundColor: layoutColors.white,
  },
  taskListFooterPlank: {
    position: 'absolute',
    bottom: -10,
    height: 10,
    left: 0,
    right: 0,
    backgroundColor: layoutColors.white,
  },
  addTaskContainer: {
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: layoutColors.black10,
  },
  colorBorderRed: {borderColor: layoutColors.red3},
  borderNone: {borderWidth: 0},
  taskItemContainer: {
    paddingHorizontal: 20,
    backgroundColor: layoutColors.white,
  },
  bottomMargin10: {marginBottom: 10},
  bottomMargin20: {marginBottom: 20},
  leftPadding5: {paddingLeft: 5},
  height20: {height: 20},
});

export default function FormListWithTasksForm(props: FormsComponentProps) {
  const {
    values,
    setField,
    flatListRef,
    renderFormField,
    FormListHeader,
    style,
    invalidFields,
    readonly,
  } = props;

  const [newTaskInputIsFocused, setNewTaskInputIsFocused] = useState(false);

  const taskListIndex = useMemo(
    () => values.findIndex(item => item.type === FormFieldType.TASK_LIST),
    [values],
  );

  const [taskList, beforeTaskListFields, afterTaskListFields] = useMemo(() => {
    const allValues = values.map((item, index) => ({item, index}));

    return [
      values[taskListIndex],
      allValues.filter(item => item.index < taskListIndex),
      allValues.filter(item => item.index > taskListIndex),
    ];
  }, [values, taskListIndex]);

  const taskListHasError = invalidFields.includes(
    `${taskList.title}-${taskList.label}-${taskListIndex}`,
  );

  const tasks = useMemo(() => {
    try {
      const strArray = stringToArrayOfString(taskList.value);
      return strArray.map(item => ({id: item, value: item}));
    } catch (e) {
      console.log(e);
      return [];
    }
  }, [taskList]);

  const onSetField = useCallback(
    (prevForm: IFormField, newServices: Task[]) => {
      setField(
        prevForm.type,
        prevForm.title,
        JSON.stringify(newServices.map(task => task.value)),
      );
    },
    [setField],
  );

  function onSetService(text: string) {
    if (!tasks.find(task => task.value === text)) {
      onSetField(taskList, [...tasks, {value: text, id: text}]);
    }
  }

  function onChangeItem(value: string, id: string) {
    const serviceIndex = tasks.findIndex(task => task.id === id);
    if (serviceIndex >= 0 && tasks[serviceIndex].value !== value) {
      const servicesBeforeIndex = tasks.slice(0, serviceIndex);
      const servicesAfterIndex = tasks.slice(serviceIndex + 1);
      const newServices = [
        ...servicesBeforeIndex,
        {value, id},
        ...servicesAfterIndex,
      ];
      onSetField(taskList, newServices);
    }
  }

  function onDeleteItem(id: string) {
    const newServices = tasks.filter(task => task.id !== id);
    onSetField(taskList, newServices);
  }

  return (
    <View style={styles.flex1}>
      <KeyboardAwareDraggableFlatList
        automaticallyAdjustContentInsets={false}
        keyboardShouldPersistTaps="handled"
        enableResetScrollToCoords={false}
        enableOnAndroid
        innerRef={ref => {
          // @ts-expect-error this is the recommended way
          flatListRef.current = ref;
        }}
        showsVerticalScrollIndicator={false}
        style={style}
        data={tasks}
        onDragEnd={({data}) => onSetField(taskList, data)}
        keyExtractor={item => item.id}
        ListHeaderComponent={
          <>
            {FormListHeader}

            {beforeTaskListFields.map(item =>
              renderFormField(item.item, item.index),
            )}

            <View style={[styles.taskListHeader, styles.shadow]}>
              <Archivo
                fontDimensions={FontDimensions.HEADLINE}
                style={styles.bottomMargin10}>
                {taskList.title}
                {!taskList.required && (
                  <View style={styles.leftPadding5}>
                    <Lato
                      color={layoutColors.black60}
                      fontDimensions={FontDimensions.BODY1}>
                      (optional)
                    </Lato>
                  </View>
                )}
              </Archivo>
              <Lato
                fontDimensions={FontDimensions.BODY1}
                color={layoutColors.black60}
                style={styles.bottomMargin20}>
                {taskList.label}
                {taskList.required ? '*' : ''}
              </Lato>
              {((newTaskInputIsFocused && Boolean(tasks.length)) ||
                !newTaskInputIsFocused) && (
                <View
                  style={[
                    styles.taskListTopBorder,
                    taskListHasError && styles.colorBorderRed,
                  ]}
                />
              )}
            </View>
          </>
        }
        renderItem={({item, isActive, drag}) => {
          return (
            <View style={styles.taskItemContainer}>
              <ScaleDecorator>
                <ShadowDecorator color={layoutColors.black60}>
                  <SwipeableItem
                    readonly={readonly}
                    drag={drag}
                    isDragging={isActive}
                    onChangeItem={newText => onChangeItem(newText, item.id)}
                    onDeleteItem={() => onDeleteItem(item.id)}
                    text={item.value}
                  />
                </ShadowDecorator>
              </ScaleDecorator>
            </View>
          );
        }}
        ListFooterComponent={
          <>
            <View style={styles.taskListFooter}>
              <View
                style={[
                  styles.addTaskContainer,
                  taskListHasError && styles.colorBorderRed,
                  newTaskInputIsFocused && styles.borderNone,
                ]}>
                <NewTaskInput
                  readonly={readonly}
                  onFocus={() => setNewTaskInputIsFocused(true)}
                  onBlur={() => setNewTaskInputIsFocused(false)}
                  title={
                    tasks.length > 0
                      ? 'Add another task...'
                      : 'Edit your task list here...'
                  }
                  onSetService={onSetService}
                />
              </View>
              <View style={[styles.shadow, styles.taskListFooterPlank]} />
              <ErrorText isInvalid={taskListHasError}>
                Task(s) need to be entered
              </ErrorText>
              <View style={[styles.taskListFooterPlank, styles.height20]} />
            </View>

            {afterTaskListFields.map(item =>
              renderFormField(item.item, item.index),
            )}
          </>
        }
      />
    </View>
  );
}
