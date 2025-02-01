import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TimePicker = ({ onTimeSelect }) => {
  const [selectedFromTime, setSelectedFromTime] = useState(null);
  const [selectedToTime, setSelectedToTime] = useState(null);
  const times = [
    '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm',
    '6pm', '7pm', '8pm', '9pm', '10pm', '11pm', '12am'
  ];

  const selectFromTime = (time) => {
    setSelectedFromTime(time);
    setSelectedToTime(null); // Reset toTime to ensure it is after fromTime
    if (onTimeSelect) onTimeSelect({ from: time, to: null }); // Notify parent of change
  };

  const selectToTime = (time) => {
    if (times.indexOf(time) > times.indexOf(selectedFromTime)) {
      setSelectedToTime(time);
      if (onTimeSelect) onTimeSelect({ from: selectedFromTime, to: time }); // Notify parent of change
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>From:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {times.map((time, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.timeItem, selectedFromTime === time ? styles.selected : {}]}
            onPress={() => selectFromTime(time)}
          >
            <Text style={styles.timeText}>{time.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {selectedFromTime && (
        <>
          <Text style={styles.title}>To:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
            {times.slice(times.indexOf(selectedFromTime) + 1).map((time, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.timeItem, selectedToTime === time ? styles.selected : {}]}
                onPress={() => selectToTime(time)}
              >
                <Text style={styles.timeText}>{time.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  scrollView: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  timeItem: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
  selected: {
    backgroundColor: '#4CAF50',
  },
  timeText: {
    color: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default  TimePicker;