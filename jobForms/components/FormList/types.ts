import {FormField as IFormField} from '../../../../types/jobForm';
import {ForwardedRef, ReactElement} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import {ScrollView, StyleProp, ViewStyle} from 'react-native';

export type SetFieldFunction = (
  type: string,
  title: string,
  value: string,
) => void;

export type FormsComponentProps = {
  style?: StyleProp<ViewStyle>;
  values: IFormField[];
  setField: SetFieldFunction;
  flatListRef?: ForwardedRef<FlatList>;
  scrollViewRef?: ForwardedRef<ScrollView>;
  renderFormField: (formField: IFormField, index: number) => ReactElement;
  FormListHeader: ReactElement;
  invalidFields: string[];
  readonly?: boolean;
};

export type Task = {id: string; value: string};
