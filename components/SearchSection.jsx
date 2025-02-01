import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SearchSection = () => {
  return (
    <View style={styles.searchSection}>
      {/* Your Area Input */}
      <View style={styles.inputContainerArea}>
        <Icon name="location-on" size={20} color="#777" style={styles.inputIcon} />
        <TextInput style={styles.input} placeholder="Your Area" />
      </View>

      {/* Cost Per Hour and Duration Inputs */}
      <View style={styles.motherSection}>
        <View style={styles.inputContainer}>
          <TextInput style={[styles.input, styles.costPerHour]} placeholder="Cost Per Hour" keyboardType="numeric" />
        </View>

        <View style={styles.inputContainer}>
          <TextInput style={styles.input} placeholder="Duration" keyboardType="numeric" />
        </View>
      </View>

      {/* Find Now Button */}
      <TouchableOpacity style={styles.findNowButton}>
        <Icon name="search" size={20} color="#fff" style={styles.findNowIcon} />
        <Text style={styles.findNowText}>Find Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    
    // paddingVertical: 10,
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
    borderRightColor: '#ddd', // Black 1px border for separation
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    fontSize: 16,
    color: '#333',
    
  },
  inputIcon: {
    marginRight: 10,
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