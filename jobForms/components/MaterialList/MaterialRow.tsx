import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {layoutColors} from '../../../../constants/colors';
import TableInput from './TableInput';
import AddIcon2 from '../../../../assets/icons/AddIcon2';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderBottomColor: layoutColors.black10,
  },
  item: {
    paddingVertical: 17,
    paddingHorizontal: 15,
  },
  inputText: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: 'Lato-Regular',
    color: layoutColors.black100,
  },
  nameInput: {
    flexGrow: 1,
    flexShrink: 1,
    paddingLeft: 20,
  },
  priceInput: {
    width: 100,
    textAlign: 'center',
    borderLeftWidth: 1,
    borderLeftColor: layoutColors.black10,
  },
  addIcon: {
    position: 'absolute',
    left: 20,
    top: 3,
    bottom: 0,
    justifyContent: 'center',
  },
  leftPadding42: {paddingLeft: 42},
});

type Props = {
  onFocus?: () => void;
  onSetMaterial: (index: number, name: string, price: number) => void;
  clearOnEndEditing?: boolean;
  bottomLine?: boolean;
  name?: string;
  price?: number;
  type?: 'set' | 'update';
  nameIsDisabled?: boolean;
  index: number;
  readonly?: boolean;
};

export default function MaterialRow(props: Props) {
  const {
    index,
    bottomLine = false,
    onFocus,
    onSetMaterial,
    clearOnEndEditing = false,
    name: prevName,
    price: prevPrice,
    type = 'update',
    nameIsDisabled = false,
    readonly = false,
  } = props;

  const [name, setName] = useState(prevName || '');
  const [price, setPrice] = useState(prevPrice ? `$${prevPrice}` : '');
  const [isFocused, setIsFocused] = useState(false);

  function onEndEditing() {
    setIsFocused(false);
    const newPrice = parseFloat(
      price && price.includes('$') ? price.slice(1) : price,
    );
    onSetMaterial(index, name, isNaN(newPrice) ? 0 : newPrice);
    if (price && !price.includes('$')) {
      setPrice(prevState => `$${prevState}`);
    }
    if (clearOnEndEditing) {
      setName('');
      setPrice('');
    }
  }

  function renderContent() {
    if (type === 'set') {
      return (
        <>
          <TableInput
            value={name}
            onChangeText={setName}
            style={[
              styles.item,
              styles.inputText,
              styles.nameInput,
              !isFocused && styles.leftPadding42,
            ]}
            placeholder={'Parts/materials name'}
            placeholderTextColor={layoutColors.black60}
            onFocus={() => {
              if (onFocus) {
                onFocus();
              }
              setIsFocused(true);
            }}
            onBlur={onEndEditing}
            onEndEditing={onEndEditing}
            returnKeyType={'done'}
            editable={!nameIsDisabled && !readonly}
          />
          {!isFocused && (
            <View style={styles.addIcon}>
              <AddIcon2 fill={layoutColors.black60} />
            </View>
          )}
        </>
      );
    }
    return (
      <>
        <TableInput
          value={name}
          onChangeText={setName}
          style={[styles.item, styles.inputText, styles.nameInput]}
          placeholder={'Parts/materials name'}
          placeholderTextColor={layoutColors.black60}
          onFocus={onFocus}
          onBlur={onEndEditing}
          onEndEditing={onEndEditing}
          returnKeyType={'done'}
          editable={!nameIsDisabled && !readonly}
        />
        <TableInput
          value={price}
          onChangeText={setPrice}
          style={[styles.item, styles.inputText, styles.priceInput]}
          placeholder={'$'}
          placeholderTextColor={layoutColors.black60}
          onFocus={() => {
            setPrice(prevState => prevState.slice(1));
            if (onFocus) {
              onFocus();
            }
          }}
          onBlur={onEndEditing}
          onEndEditing={onEndEditing}
          returnKeyType={'done'}
          keyboardType={'numeric'}
          editable={!readonly}
        />
      </>
    );
  }

  return (
    <View style={[styles.row, bottomLine && styles.bottomBorder]}>
      {renderContent()}
    </View>
  );
}
