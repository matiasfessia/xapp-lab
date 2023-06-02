import React, { useEffect, useState } from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

import { getDistanceFromGPX } from './src/utils/getDistanceFromGPX';
import { requestLocationPermission } from './src/utils/requestLocationPermission';
import { createGPXFile } from './src/utils/createGPXFile';
const App = (): JSX.Element => {
  const [tracking, setTracking] = useState<boolean>(false);
  const [currentPosition, setCurrentPosition] = useState<any>();
  const [trackPoints, setTrackPoints] = useState<any[]>([]);
  const isDarkMode = useColorScheme() === 'dark';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? '#000' : '#fff',
    },
    text: {
      fontSize: 25,
      fontWeight: '500',
    },
  });

  useEffect(() => {
    if (tracking && currentPosition) {
      setTrackPoints([
        ...trackPoints,
        {
          '@lat': currentPosition.coords.latitude,
          '@lon': currentPosition.coords.longitude,
        },
      ]);
    }
  }, [tracking, currentPosition]);

  const startTracking = () => {
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {
        setTracking(!tracking);
        Geolocation.watchPosition(
          position => {
            setCurrentPosition(position);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setCurrentPosition(false);
          },
          {
            enableHighAccuracy: true,
            interval: 500,
            fastestInterval: 1000,
            distanceFilter: 1,
          },
        );
      }
    });
  };

  const stopTracking = async () => {
    Geolocation.stopObserving();
    setTracking(!tracking);
    const xml = await createGPXFile(trackPoints);
    const distance = getDistanceFromGPX(xml);
    console.log(distance);
    setTrackPoints([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        // backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{ backgroundColor: '#000', height: '100%' }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDarkMode ? '#000' : '#fff',
          }}>
          <Text>x-app</Text>
        </View>
        <View
          style={{
            marginTop: 10,
            padding: 10,
            borderRadius: 10,
            width: '40%',
          }}>
          <Button
            title={tracking ? 'Stop' : 'Start'}
            onPress={() => (tracking ? stopTracking() : startTracking())}
          />
        </View>
        <Text>
          Latitude: {currentPosition ? currentPosition.coords.latitude : null}
        </Text>
        <Text>
          Longitude: {currentPosition ? currentPosition.coords.longitude : null}
        </Text>
        {/* <View>
          <Text styles={{fontSize:"18px"}}>Bluetooh scan</Text>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
