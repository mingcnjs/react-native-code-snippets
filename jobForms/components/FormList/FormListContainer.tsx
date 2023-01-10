import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {
  FormField as IFormField,
  FormFieldType,
  FormInstance,
  FormStatus,
} from '../../../../types/jobForm';
import {IPopulatedWorkOrder} from '../../../../types/work-order';
import {ScrollView, StyleSheet} from 'react-native';
import {useUpdateJobFormInstanceMutation} from '../../../../services/endpoints/workOrders';
import {deletePhotosFromStorage} from '../../../../services/formPhotos';
import {validateForm} from '../../../../utils/forms';
import FooterWithMultiButton from '../../../job/components/FooterWithMultButton';
import {FormListWithoutTasksForm} from './FormListWithoutTasksForm';
import FormListWithTasksForm from './FormListWithTasksForm';
import {FormsComponentProps} from './types';
import {FlatList} from 'react-native-gesture-handler';
import FormField from '../FormField';
import Part from '../../../job/components/Part/Part';
import Archivo from '../../../../components/labels/Archivo';
import {
  FontDimensions,
  FontWeights,
} from '../../../../components/labels/CustomText/types';
import {layoutColors} from '../../../../constants/colors';
import BoxShadow from '../../../job/components/BoxShadow';

const styles = StyleSheet.create({
  scrollView: {backgroundColor: layoutColors.lightBeige},
  bottomMargin10: {marginBottom: 10},
});

type Props = {
  job: IPopulatedWorkOrder;
  formInstanceId: number;
  closeModal: () => void;
  readonly?: boolean;
};

export default function FormListContainer(props: Props) {
  const {job, formInstanceId, closeModal, readonly = false} = props;
  const {formInstances} = job;

  const formInstance: FormInstance = formInstances.find(
    f => f.id === formInstanceId,
  )!;
  const scrollViewRef = useRef<ScrollView>(null);
  const flatListRef = useRef<FlatList>(null);
  const [invalidFields, setInvalidFields] = useState<string[]>([]);
  const [values, setValues] = useState<IFormField[]>(formInstance.fields);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);
  const [isSubmitted, setSubmitted] = useState(false);

  const [updateForm, {isLoading}] = useUpdateJobFormInstanceMutation();

  useEffect(() => {
    if (!isSubmitted) {
      return;
    }
    const validation = validateForm({...formInstance, fields: values});
    setInvalidFields(
      validation.filter(field => !field.isValid).map(field => field.id),
    );
  }, [formInstance, isSubmitted, values]);

  const sharedSaveFormLogic = useCallback(
    async (status: FormStatus) => {
      await updateForm({
        workOrderId: job.id,
        formInstanceId,
        formInstance: {fields: values, status},
      }).unwrap();
      deletePhotosFromStorage(formInstance.fields, values);
    },
    [job, formInstance, formInstanceId, updateForm, values],
  );

  const onSubmitForm = useCallback(async () => {
    setSubmitted(true);
    const validation = validateForm({...formInstance, fields: values});
    const errors = validation
      .filter(field => !field.isValid)
      .map(field => field.id);
    if (errors.length) {
      setInvalidFields(
        validation.filter(field => !field.isValid).map(field => field.id),
      );
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({x: 0, animated: true});
      }
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({offset: 0, animated: true});
      }
      return;
    }
    await sharedSaveFormLogic(FormStatus.SUBMITTED);
    closeModal();
  }, [formInstance, sharedSaveFormLogic, closeModal, values]);

  const setField = useCallback((type: string, title: string, value: string) => {
    setValues(prevState => {
      const fieldIndex = prevState.findIndex(
        field => field.type === type && field.title === title,
      );
      if (fieldIndex >= 0) {
        const fieldsBeforeIndex = prevState.slice(0, fieldIndex);
        const fieldsAfterIndex = prevState.slice(fieldIndex + 1);
        return [
          ...fieldsBeforeIndex,
          {...prevState[fieldIndex], value},
          ...fieldsAfterIndex,
        ];
      }
      return prevState;
    });
  }, []);

  const FormList: FC<FormsComponentProps> = values.find(
    item => item.type === FormFieldType.TASK_LIST,
  )
    ? FormListWithTasksForm
    : FormListWithoutTasksForm;

  return (
    <>
      <FormList
        readonly={readonly}
        style={styles.scrollView}
        flatListRef={flatListRef}
        scrollViewRef={scrollViewRef}
        values={values}
        invalidFields={invalidFields}
        setField={setField}
        renderFormField={(field, index) => {
          return (
            <FormField
              key={field.title}
              formField={field}
              formInstanceId={formInstanceId}
              setField={setField}
              isInvalid={invalidFields.includes(
                `${field.title}-${field.label}-${index}`,
              )}
              setSaveButtonDisabled={setSaveButtonDisabled}
              readonly={readonly}
            />
          );
        }}
        FormListHeader={
          <BoxShadow>
            <Part>
              <Archivo
                fontDimensions={FontDimensions.TITLE2}
                style={styles.bottomMargin10}>
                {`${readonly ? 'Preview of' : 'Fill out your'} ${
                  formInstance.form.title
                } Form`}
              </Archivo>
              <Archivo
                fontWeight={FontWeights.REGULAR}
                fontDimensions={FontDimensions.CALLOUT1}
                style={styles.bottomMargin10}>
                * Indicates required info
              </Archivo>
            </Part>
          </BoxShadow>
        }
      />

      {!readonly && (
        <FooterWithMultiButton
          onPressSecondaryButton={async () => {
            try {
              await sharedSaveFormLogic(FormStatus.IN_PROGRESS);
              closeModal();
            } catch (e) {
              console.log(e);
            }
          }}
          onPressPrimaryButton={onSubmitForm}
          secondaryButtonIsDisabled={saveButtonDisabled}
          primaryButtonIsDisabled={
            saveButtonDisabled || Boolean(invalidFields.length)
          }
          error={Boolean(invalidFields.length)}
          secondaryButtonIsLoading={isLoading && !isSubmitted}
          primaryButtonIsLoading={isLoading && isSubmitted}
          secondaryButtonText="Save for later"
          primaryButtonText="Submit"
        />
      )}
    </>
  );
}
