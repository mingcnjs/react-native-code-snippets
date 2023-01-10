import React, {useState} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {PNFile} from '../useChat';
import ImageModal from 'react-native-image-modal';
import {useMount} from '../../../hooks/useMount';
import PubNub from 'pubnub';

const imagePlaceholder = require('../../../assets/images/imagePlaceholder.jpg');
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  image: {
    width: (width - 56) / 3,
    aspectRatio: 1,
    marginRight: 10,
    marginBottom: 12,
    borderRadius: 16,
  },
});

type Props = {
  pnPhoto: PNFile;
  pubnub: PubNub;
};

export default function ChatPhoto(props: Props) {
  const {pnPhoto, pubnub} = props;

  const [uri, setUri] = useState();

  useMount(() => {
    if (pnPhoto) {
      pubnub
        .downloadFile(pnPhoto)
        .then(response => setUri(response.data.url))
        .catch(e => console.log(e));
    }
  });

  return (
    <ImageModal
      source={uri ? {uri} : imagePlaceholder}
      style={styles.image}
      resizeMode={'cover'}
      modalImageResizeMode={'contain'}
    />
  );
}
