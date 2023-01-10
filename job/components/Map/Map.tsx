import React, {useCallback, useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
// todo update react-native-maps, version 1 is out
import MapView, {Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {layoutColors} from '../../../../constants/colors';
import BackgroundColor from '../../../../components/BackgroundColor';
import PlacePointerIcon from '../../../../assets/icons/PlacePointerIcon';
import {DISABLE_MAP} from '@env';

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  title: {
    flexDirection: 'row',
    width: 200,
    borderRadius: 12,
  },
  titleText: {
    fontSize: 14,
    lineHeight: 15,
    fontFamily: 'Lato-Bold',
    color: layoutColors.green100,
    textAlign: 'center',
  },
});

type IRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const {width} = Dimensions.get('window');

type Props = {
  height: number;
  latitude: number;
  longitude: number;
  address: string;
};

export default function Map(props: Props) {
  const {latitude, longitude, address, height} = props;

  const OFFSET = {x: 0.5, y: 1};

  const [region, setRegion] = useState<IRegion>();
  const [isLoaded, setIsLoaded] = useState(false);

  function onMapLoaded() {
    setIsLoaded(true);
  }

  const initializeMap = useCallback(() => {
    const ASPECT_RATIO = width / height;
    const latitudeDelta = 0.0017;
    const longitudeDelta = latitudeDelta * ASPECT_RATIO;

    setRegion({
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta,
    });
  }, [longitude, latitude, height]);

  useEffect(() => {
    if (isLoaded) {
      initializeMap();
    }
  }, [isLoaded, initializeMap]);
  /** temporary fix */
  if (DISABLE_MAP === 'true' && __DEV__) {
    return <View style={{height}} />;
  }

  return (
    <View style={{height}}>
      <MapView
        onMapLoaded={onMapLoaded}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        loadingEnabled>
        <Marker
          coordinate={{
            latitude,
            longitude,
          }}
          centerOffset={OFFSET}
          anchor={OFFSET}>
          <PlacePointerIcon />
          <Callout tooltip>
            <View style={styles.title}>
              <BackgroundColor color={layoutColors.white} opacity={0.5} />
              <Text style={styles.titleText}>{address}</Text>
            </View>
          </Callout>
        </Marker>
      </MapView>
    </View>
  );
}
