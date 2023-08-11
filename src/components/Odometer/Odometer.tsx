import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface Track {
  id: string;
  datetime: string;
  km: number;
}

const styles = StyleSheet.create({
  odometer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: '500',
  },
});

const Odometer = () => {
  const [odometer, setOdometer] = useState<number>(10);

  return (
    <View style={styles.odometer}>
      <Text style={styles.title}>
        {odometer.toString().padStart(8, '0') + ' km'}
      </Text>
    </View>
  );
};

export default Odometer;
