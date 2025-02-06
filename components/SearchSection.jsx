import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SearchSection = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [costPerHour, setCostPerHour] = useState('');
  const duration = '1'; // Fixed duration of 1 hour

  const handleSearch = () => {
    onSearch({
      location: location.trim().toLowerCase(),
      costPerHour: costPerHour ? parseInt(costPerHour) : 0,
      duration: parseInt(duration)
    });
  };

  const handleClear = () => {
    setLocation('');
    setCostPerHour('');
    onSearch({
      location: '',
      costPerHour: 0,
      duration: parseInt(duration)
    });
  };

  return (
    <View style={styles.searchSection}>
      <View style={styles.inputContainerArea}>
        <Icon name="location-on" size={20} color="#777" style={styles.inputIcon} />
        <TextInput 
          style={styles.input} 
          placeholder="Your Area" 
          value={location}
          onChangeText={setLocation}
        />
        {(location || costPerHour) && (
          <TouchableOpacity onPress={handleClear}>
            <Icon name="clear" size={20} color="#777" style={styles.clearIcon} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.motherSection}>
        <View style={styles.inputContainer}>
          <TextInput 
            style={[styles.input, styles.costPerHour]} 
            placeholder="Cost Per Hour" 
            keyboardType="numeric"
            value={costPerHour}
            onChangeText={setCostPerHour}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="Duration (Hours)" 
            value={"Duration "+duration+" hour"}
            editable={false}
            selectTextOnFocus={false}
          />
        </View>
      </View>
      <TouchableOpacity 
        style={[
          styles.findNowButton,
          (!location && !costPerHour) && styles.findNowButtonDisabled
        ]} 
        onPress={handleSearch}
      >
        <Icon name="search" size={20} color="#fff" style={styles.findNowIcon} />
        <Text style={styles.findNowText}>
          {(location || costPerHour) ? 'Search' : 'Show All'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    paddingTop: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%', 
  },
  motherSection: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  inputContainerArea: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
    paddingVertical: 5,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
    paddingVertical: 5,
    width: '48%',
  },
  costPerHour: {
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    fontSize: 16,
    color: '#777',
  },
  inputIcon: {
    marginRight: 10,
  },
  clearIcon: {
    marginLeft: 10,
  },
  findNowButton: {
    backgroundColor: '#7A67FF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 20,
    marginTop: -10,
  },
  findNowButtonDisabled: {
    backgroundColor: '#7A67FF',
    opacity: 0.8,
  },
  findNowIcon: {
    marginRight: 10,
  },
  findNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SearchSection;