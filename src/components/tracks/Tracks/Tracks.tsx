import React, { useEffect, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { StyleSheet, Text, View, ScrollView, StatusBar } from 'react-native';

import { requestLocationPermission } from '../../../utils/requestLocationPermission';
import { createGPXFile } from '../../../utils/createGPXFile';
import { getDistanceFromGPX } from '../../../utils/getDistanceFromGPX';
import Odometer from '../../Odometer/Odometer';
import StartStopButton from '../../StartStopButton/StartStopButton';
import TrackList from '../TrackList/TrackList';

const Tracks = (): JSX.Element => {
  const [tracking, setTracking] = useState<boolean>(false);
  const [currentPosition, setCurrentPosition] = useState<any>();
  const [trackPoints, setTrackPoints] = useState<any[]>([]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
      backgroundColor: '#1e1e20',
    },
    gradient: {
      flex: 1,
    },
    header: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },

    title: {
      fontSize: 30,
      color: '#fff',
    },
    triggerBtnContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 25,
      fontWeight: '500',
    },
    inputContainer: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    tramoContainer: {
      marginBottom: 8,
      borderBottomWidth: 1,
      paddingBottom: 8,
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
    try {
      Geolocation.stopObserving();
      setTracking(!tracking);
      const xml = await createGPXFile(trackPoints);
      const distance = getDistanceFromGPX(xml);

      // store the tramo
      // const nuevoTramoRegistro: Tramo = {
      //   id: uuidv4(),
      //   fechaHora: new Date().toISOString(),
      //   kilometrosRecorridos: parseFloat(distance),
      // };
      // setTramos([...tramos, nuevoTramoRegistro]);
      // await AsyncStorage.setItem(storageKey, JSON.stringify(tramos));
      console.log(distance);
      setTrackPoints([]);
      console.log('Tramo guardado exitosamente!');
    } catch (error) {
      console.error('Error al guardar el tramo:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.header}>
          <Text style={styles.title}>ZAPP</Text>
        </View>

        <Odometer />

        <View style={styles.triggerBtnContainer}>
          <StartStopButton text={tracking ? 'Stop' : 'Start'} />
        </View>

        <TrackList />
      </ScrollView>
    </View>
  );
};

export default Tracks;
