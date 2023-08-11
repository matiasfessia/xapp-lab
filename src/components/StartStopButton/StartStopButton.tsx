import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export interface Props {
  text: string;
}

const styles = StyleSheet.create({
  roundButton2: {
    marginTop: 20,
    width: 100,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 40,
    backgroundColor: '#cf3859',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

const StartStopButton = ({ text }: Props) => {
  const buttonClickedHandler = () => {
    console.log('You have been clicked a button!');
    // do something
  };

  return (
    <TouchableOpacity
      onPress={buttonClickedHandler}
      style={styles.roundButton2}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

export default StartStopButton;
