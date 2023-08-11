import React, { useEffect, useState } from 'react';
import {
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export interface Track {
  id: string;
  datetime: string;
  km: number;
}

const storageKey = '@MyApp:tramos';

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    borderColor: 'red',
    borderWidth: 2,
  },
  kmInput: {},
  trackContainer: {
    marginBottom: 8,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  item: {},
});

const TrackList = () => {
  const [newTrack, setNewTrack] = useState<Track | undefined>();
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    getTracks();
  }, []);

  const addTrack = async () => {
    try {
      const newTrack: Track = {
        id: uuidv4(),
        datetime: new Date().toISOString(),
        km: 10,
      };
      setTracks([...tracks, newTrack]);
      await AsyncStorage.setItem(storageKey, JSON.stringify(tracks));
    } catch (error) {
      console.error(error);
    }
  };

  const getTracks = async () => {
    try {
      const storedTracks = await AsyncStorage.getItem(storageKey);
      if (storedTracks !== null) {
        setTracks(JSON.parse(storedTracks));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTrack = async (id: string) => {
    console.log(id);
    try {
      const updatedTracks = tracks.filter(track => track.id !== id);
      await AsyncStorage.setItem(storageKey, JSON.stringify(updatedTracks));
      setTracks(updatedTracks);
    } catch (error) {
      console.error(error);
    }
  };

  const renderTrack = ({ item }) => {
    console.log('track', item);
    return (
      <View style={styles.trackContainer}>
        <Text style={styles.item}>{item.datetime}</Text>
        <Text>{item.km}Km</Text>
        <Button title="Delete track" onPress={() => deleteTrack(item.id)} />
      </View>
    );
  };

  return (
    <View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.kmInput}
          value={newTrack}
          onChangeText={value => setNewTrack(value)}
          placeholder="Km"
          keyboardType="numeric"
        />
        <Button title="Add" onPress={addTrack} />
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={tracks}
          renderItem={renderTrack}
          keyExtractor={item => item.id}
        />
      </SafeAreaView>
    </View>
  );
};

export default TrackList;
