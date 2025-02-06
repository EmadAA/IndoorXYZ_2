import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TimePicker = ({ onTimeSelect }) => {
  const [selectedFromTime, setSelectedFromTime] = useState(null);
  const [selectedToTime, setSelectedToTime] = useState(null);

  const times = [
    '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm',
    '6pm', '7pm', '8pm', '9pm', '10pm', '11pm', '12am'
  ];

  const calculateNextHour = (time) => {
    const index = times.indexOf(time);
    if (index < times.length - 1) {
      return times[index + 1];
    }
    return null;
  };

  const selectFromTime = (time) => {
    setSelectedFromTime(time);
    const nextHour = calculateNextHour(time);
    setSelectedToTime(nextHour);
    if (onTimeSelect) onTimeSelect({ from: time, to: nextHour });
  };

  // Removed selectToTime function since we're auto-calculating it

  return (
    <View style={styles.container}>
      <Text style={styles.title}>From:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {times.slice(0, -1).map((time, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.timeItem, selectedFromTime === time ? styles.selected : {}]}
            onPress={() => selectFromTime(time)}
          >
            <Text style={styles.timeText}>{time.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {selectedFromTime && selectedToTime && (
        <>
          <Text style={styles.title}>To:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
            <TouchableOpacity
              style={[styles.timeItem, styles.selected]}
              disabled={true}
            >
              <Text style={styles.timeText}>{selectedToTime.toUpperCase()}</Text>
            </TouchableOpacity>
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
    backgroundColor: '#7A67FF',
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

export default TimePicker;