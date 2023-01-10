import React, {Dispatch, FC, SetStateAction} from 'react';
import {
  FormField as IFormField,
  FormFieldComponentProps,
  FormFieldType,
} from '../../../types/jobForm';
import Archivo from '../../../components/labels/Archivo';
import {FontDimensions} from '../../../components/labels/CustomText/types';
import {StyleSheet} from 'react-native';
import {layoutColors} from '../../../constants/colors';
import Lato from '../../../components/labels/Lato';
import MultiFileUpload from './MultiFileUpload';
import SingleFileUpload from './SingleFileUpload';
import BoxShadow from '../../job/components/BoxShadow';
import Part from '../../job/components/Part/Part';
import HourInput from './HourInput';
import MaterialListInput from './MaterialList/MaterialListInput';
import MultiLineTextInput from './MultiLineTextInput';

const FormFieldComponents: Partial<
  Record<FormFieldType, FC<FormFieldComponentProps>>
> = {
  MULTI_FILE_UPLOAD: MultiFileUpload,
  SINGLE_FILE_UPLOAD: SingleFileUpload,
  HOUR_INPUT: HourInput,
  MATERIAL_LIST_INPUT: MaterialListInput,
  MULTI_LINE_TEXT_INPUT: MultiLineTextInput,
};

const styles = StyleSheet.create({
  bottomMargin10: {marginBottom: 10},
  bottomMargin25: {marginBottom: 25},
  topMargin6: {marginTop: 6},
  requiredLabel: {paddingLeft: 5},
});

type Props = {
  isInvalid?: boolean;
  formField: IFormField;
  formInstanceId: number;
  setField: (type: string, title: string, value: string) => void;
  setSaveButtonDisabled: Dispatch<SetStateAction<boolean>>;
  readonly?: boolean;
};

export default function FormField(props: Props) {
  const {
    formField,
    isInvalid,
    formInstanceId,
    setField,
    setSaveButtonDisabled,
    readonly = false,
  } = props;
  const {title, required, label, type} = formField;

  const Component = FormFieldComponents[type];

  if (Component) {
    return (
      <BoxShadow>
        <Part>
          <Archivo
            fontDimensions={FontDimensions.HEADLINE}
            style={styles.bottomMargin10}>
            {title}
          </Archivo>

          {label && (
            <Lato
              fontDimensions={FontDimensions.BODY1}
              color={layoutColors.black60}
              style={styles.bottomMargin25}>
              {label}
              {required ? '*' : ''}
            </Lato>
          )}

          <Component
            isInvalid={isInvalid}
            formField={formField}
            setField={setField}
            formInstanceId={formInstanceId}
            setSaveButtonDisabled={setSaveButtonDisabled}
            readonly={readonly}
          />
        </Part>
      </BoxShadow>
    );
  }
  return null;
}
