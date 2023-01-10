import React, {useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {layoutColors} from '../../../../constants/colors';
import Lato from '../../../../components/labels/Lato';
import {
  FontDimensions,
  FontWeights,
} from '../../../../components/labels/CustomText/types';
import MaterialRow from './MaterialRow';
import {FormField} from '../../../../types/jobForm';
import Archivo from '../../../../components/labels/Archivo';
import BackgroundColor from '../../../../components/BackgroundColor';
import {formatPrice} from '../../../../utils/workOrderUtils/formatPrice';
import ErrorText from '../ErrorText';

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: layoutColors.black10,
    borderRadius: 4,
    overflow: 'hidden',
  },
  error: {
    borderWidth: 1,
    borderColor: layoutColors.red3,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: layoutColors.black10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    paddingVertical: 17,
    paddingHorizontal: 15,
  },
  nameInput: {
    flexGrow: 1,
    flexShrink: 1,
    paddingLeft: 20,
  },
  total: {
    minWidth: 78,
    alignItems: 'center',
  },
  bottomMargin24: {marginBottom: 24},
});

type Props = {
  items: {name: string; value: number}[];
  setField: (type: string, title: string, value: string) => void;
  formField: FormField;
  error?: boolean;
  readonly?: boolean;
};

export default function QuoteAndMaterialTable(props: Props) {
  const {
    items: prevItems = [],
    error,
    setField,
    formField,
    readonly = false,
  } = props;

  const [items, setItems] = useState(Array.isArray(prevItems) ? prevItems : []);

  function onAddMaterial(name: string) {
    const notRepeatsExistingName = !items.find(item => item.name === name);
    if (name && notRepeatsExistingName) {
      const newItems = [...items, {name, value: 0}];
      setField(formField.type, formField.title, JSON.stringify(newItems));
      setItems(newItems);
    }
  }

  function onUpdateMaterial(index: number, name: string, price: number) {
    const newItems = [...items];
    newItems[index] = {name, value: price || 0};
    setField(formField.type, formField.title, JSON.stringify(newItems));
    setItems(newItems);
  }

  const totalPrice = useMemo(() => {
    const totalAmount = items.reduce((sum, item) => sum + (item.value || 0), 0);
    return formatPrice(totalAmount);
  }, [items]);

  return (
    <>
      <View style={[styles.table]}>
        <View style={styles.tableHeader}>
          <BackgroundColor color={layoutColors.black10} opacity={0.5} />
          <View style={styles.nameInput}>
            <Archivo
              fontDimensions={FontDimensions.CALLOUT2}
              fontWeight={FontWeights.BOLD}
              color={layoutColors.black60}>
              NAME
            </Archivo>
          </View>
          <View style={styles.total}>
            <Archivo
              fontDimensions={FontDimensions.CALLOUT2}
              fontWeight={FontWeights.BOLD}
              color={layoutColors.black60}>
              COST
            </Archivo>
          </View>
        </View>

        {items.map((item, index, array) => {
          return (
            <MaterialRow
              key={`${index}-${item.name}`}
              name={item.name}
              index={index}
              price={item.value}
              onSetMaterial={onUpdateMaterial}
              bottomLine={array.length - 1 === index}
              readonly={readonly}
            />
          );
        })}

        <MaterialRow
          index={-1}
          onSetMaterial={(index, name) => onAddMaterial(name)}
          bottomLine={items.length > 0}
          clearOnEndEditing
          type={'set'}
          readonly={readonly}
        />

        {items.length > 0 && (
          <View style={[styles.row, Boolean(error) && styles.error]}>
            <View style={[styles.item, styles.nameInput]}>
              <Lato
                fontDimensions={FontDimensions.BODY1}
                fontWeight={FontWeights.BOLD}>
                Total
              </Lato>
            </View>
            <View style={[styles.item, styles.total]}>
              <Lato
                fontDimensions={FontDimensions.BODY1}
                fontWeight={FontWeights.BOLD}>
                {totalPrice}
              </Lato>
            </View>
          </View>
        )}
      </View>
      <ErrorText isInvalid={Boolean(error)}>
        A cost estimate is required
      </ErrorText>
    </>
  );
}
