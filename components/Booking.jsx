import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../Config/Firebase';
import BottomNavbar from './BottomNavbar';

const Booking = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(true);
  const [indoorData, setIndoorData] = useState(null);
  const [ownerData, setOwnerData] = useState(null);
  const bookingId = route.params?.bookingId;

  useEffect(() => {
    fetchBookingData();
  }, [bookingId]);

  const fetchBookingData = async () => {
    try {
      if (!bookingId) {
        console.error('No booking ID provided');
        return;
      }

      // Fetch docunment
      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingDoc = await getDoc(bookingRef);

      if (bookingDoc.exists()) {
        const bookingData = { id: bookingDoc.id, ...bookingDoc.data() };
        setIndoorData(bookingData);
      
        //  fetch owner data 
        if (bookingData.userId) {
          const userRef = doc(db, 'users', bookingData.userId);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setOwnerData(userDoc.data());
          } else {
            console.error('Owner not found in users collection');
          }
        } else {
          console.error('No userId found in booking data');
        }
      } else {
        console.error('No such booking!');
      }
      
    } catch (error) {
      console.error('Error fetching booking:', error);
    } finally {
      setLoading(false);
    }
  };


    const handleCall = () => {
      Linking.openURL(`tel:${indoorData.phone}`);
    };
  
  

  const handleBooking = () => {
    navigation.navigate('Confirm', { bookingId });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7A67FF" />
      </View>
    );
  }

  if (!indoorData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Booking information not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Image source={require('../assets/turf.jpg')} style={styles.logo} />
      </View>

      {/* Owner Info Section */}
      <View style={styles.ownerInfo}>
        <View style={styles.ownerInfoHeader}>
          <Text style={styles.ownerInfoTitle}>Owner Info</Text>
        </View>
        <View style={styles.ownerDetails}>
          <View style={styles.ownerNameContainer}>
            <Text style={styles.ownerName}>{ownerData?.name || 'N/A'}</Text>
          </View>
          <View style={styles.ownerContactContainer}>
            <Text style={styles.ownerPhone}>Phone: {indoorData.phone || 'N/A'}</Text>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.callButton} onPress={handleCall}>
              <Text style={styles.callButtonText}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Booking Details Section */}
      <View style={styles.bookingDetails}>
        <Text style={styles.price}>
          ৳{indoorData.price}
          <Text style={styles.priceCurrency}>/hr</Text>
        </Text>
        <View style={styles.venueInfo}>
          <View style={styles.venueSection}>
            <Text style={styles.venueName}>{indoorData.name}</Text>
          </View>
          <View style={styles.venueSection}>
            <Text style={styles.venueAddress}>{indoorData.location}</Text>
          </View>
        </View>
        <Text style={styles.paymentInfo}>Bkash/Nagad: {indoorData.phone}</Text>
        <TouchableOpacity style={styles.bookNowButton} onPress={handleBooking}>
          <Text style={styles.bookNowButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
      <BottomNavbar />
    </View>
  );
};
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffffff',
      paddingHorizontal: 5,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
     marginTop:40,
      width:'100%'
    },
    logo: {
      width: '100%',
      height: 200,
      borderRadius:15,
      resizeMode: 'cover',
    },
    headerIcons: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerIcon: {
      width: 24,
      height: 24,
      marginHorizontal: 5,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorText: {
      fontSize: 16,
      color: '#F44336',
    },
    ownerInfo: {
      backgroundColor: '#fff',
      borderRadius: 24,
      borderWidth: 1,
      borderColor: '#e7e7e7',
      margin: 5,
      padding: 16,
    },
    ownerInfoHeader: {
      alignItems: 'flex-end',
    },
    ownerInfoTitle: {
      color: 'rgba(0, 0, 0, 0.5)',
      fontSize: 14,
    },
    ownerDetails: {
      marginTop: 10,
    },
    ownerNameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    ownerName: {
      fontSize: 20,
      fontWeight: '500',
      color: '#1e1e1e',
    },
    ownerContactContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    ownerPhone: {
      fontSize: 16,
      color: '#1e1e1e',
    },
    
    callButton: {
      backgroundColor: '#7A67FF',
      borderRadius: 10,
      paddingVertical: 15,
      paddingHorizontal: 150,
      textAlign: 'center',
    },
    callButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '500',
    },
    bookingDetails: {
      backgroundColor: '#fff',
      borderRadius: 24,
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.21)',
      margin: 5,
      padding: 16,
    },
    dateTimeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.46)',
      borderRadius: 16,
      padding: 12,
      marginBottom: 20,
    },
    dateTimeLabel: {
      color: 'rgba(0, 0, 0, 0.5)',
      fontSize: 12,
    },
    price: {
      fontSize: 30,
      fontWeight: '500',
      color: 'rgba(30, 30, 30, 0.9)',
      marginBottom: 20,
    },
    priceCurrency: {
      color: 'rgba(30, 30, 30, 0.4)',
      fontSize: 25,
    },
    venueInfo: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 25,
      paddingHorizontal: 5,
    },
    venueSection: {
      flex: 1,
   
    },
    venueName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#1e1e1e',
    },
    venueAddress: {
      fontSize: 16,
      color: '#1e1e1e',
      paddingLeft:35
    },
    
    paymentInfo: {
      fontSize: 18,
      color: '#1e1e1e',
      marginBottom: 15,
    },
    bookNowButton: {
      backgroundColor: '#7A67FF',
      borderRadius: 7,
      paddingVertical: 15,
      paddingHorizontal: 20,
      alignItems: 'center',
    },
    bookNowButtonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: 'bold',
    },
  });
  
export default Booking;
