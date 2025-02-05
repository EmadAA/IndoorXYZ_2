import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const DatePicker = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Generate a list of the next 30 days starting from today
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i +1);

      const day = date.toLocaleString('en-US', { weekday: 'short' });
      const month = date.toLocaleString('en-US', { month: 'short' });
      const dayNum = date.getDate();

      dates.push(`${day}, ${month} ${dayNum}`);
    }

    return dates;
  };

  const dates = generateDates();

  const selectDate = (date) => {
    setSelectedDate(date);
    if (onDateSelect) onDateSelect(date); // Notify parent component of the selected date
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Date:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {dates.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dateItem, selectedDate === date ? styles.selected : {}]}
            onPress={() => selectDate(date)}
          >
            <Text style={styles.dateText}>{date}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  dateItem: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
  selected: {
    backgroundColor: '#4CAF50',
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default DatePicker;