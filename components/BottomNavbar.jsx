// BottomNavbar.js
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // For the "user" icon
import Icon from 'react-native-vector-icons/MaterialIcons'; // For existing icons



const BottomNavbar = ({ activeTab, setActiveTab }) => {
  
    const navigation = useNavigation(); 
  return (
    <View style={styles.bottomNavigation}>
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Icon
          name="home"
          style={styles.homeIcon}
          size={30}
          color={activeTab === 'home' ? '#7A67FF' : '#777'}
        />
        <Text
          style={[styles.navText, activeTab === 'home' && styles.activeNavText]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setActiveTab('playground')}>
        <Icon
          name="sports-soccer"
          style={styles.playgroundIcon}
          size={30}
          color={activeTab === 'playground' ? '#7A67FF' : '#777'}
        />
        <Text
          style={[styles.navText, activeTab === 'playground' && styles.activeNavText]}
        >
          Playground
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('BookingList')}>
        <Icon
          style={styles.bookingIcon}
          name="event"
          size={30}
          color={activeTab === 'booking' ? '#7A67FF' : '#777'}
        />
        <Text
          style={[styles.navText, activeTab === 'booking' && styles.activeNavText]}
        >
          Booking
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <FontAwesome
          style={styles.profileIcon}
          name="user"
          size={30}
          color={activeTab === 'profile' ? '#7A67FF' : '#777'}
        />
        <Text
          style={[styles.navText, activeTab === 'profile' && styles.activeNavText]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
      marginTop: 25,
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingVertical: 10,
      borderTopWidth: 1,
      borderColor: '#ddd',
  
    },
    navText: {
      border: '1px solid #000',
      fontSize: 14,
      color: '#333',
      
    },
    playgroundIcon:{
        marginLeft: 20,
    },
    homeIcon:{
        marginLeft: 5,
    },
    bookingIcon:{
        marginLeft: 10,
    },
    profileIcon:{
        marginLeft: 7,
    }
});

export default BottomNavbar;
