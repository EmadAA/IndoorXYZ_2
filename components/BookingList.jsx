import { getAuth } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../Config/Firebase';
import BottomNavbar from './BottomNavbar';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) {
      console.error('User not authenticated.');
      return;
    }

    // Changed collection from 'bookings' to 'indoorBookings'
    const bookingsRef = collection(db, 'indoorBookings');
    const userBookingsQuery = query(bookingsRef, where('userId', '==', userId));

    const unsubscribe = onSnapshot(userBookingsQuery, (snapshot) => {
      const userBookings = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log('Fetched bookings:', userBookings); // Debug log
      setBookings(userBookings);
    }, (error) => {
      console.error("Error fetching bookings:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (bookingId) => {
    console.log('Edit booking:', bookingId);
  };

  const handleCancel = (bookingId) => {
    console.log('Cancel booking:', bookingId);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>My Bookings</Text>
        {bookings.length === 0 ? (
          <Text style={styles.noBookings}>No bookings found</Text>
        ) : (
          bookings.map((booking) => (
            <View key={booking.id} style={styles.card}>
              <View style={styles.contentContainer}>
                <View style={styles.locationContainer}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={styles.locationText}>{booking.location || 'Indoor Location'}</Text>
                </View>
                <View style={styles.detailsRow}>
                  <Text style={styles.indoorName}>{booking.name}</Text>
                  <Text style={styles.price}>৳{booking.cost}</Text>
                </View>
                <View style={styles.timeSlotContainer}>
                  <Text style={styles.timeSlot}>
                    {booking.fromTime} - {booking.toTime}
                  </Text>
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentType}>{booking.paymentType}</Text>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={[styles.button, styles.editButton]} 
                    onPress={() => handleEdit(booking.id)}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.button, styles.cancelButton]}
                    onPress={() => handleCancel(booking.id)}
                  >
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <BottomNavbar activeTab="booking" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  noBookings: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    padding: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationIcon: {
    marginRight: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  indoorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeSlotContainer: {
    marginBottom: 8,
  },
  timeSlot: {
    fontSize: 14,
    color: '#666',
  },
  paymentInfo: {
    marginBottom: 12,
  },
  paymentType: {
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#7A67FF',
  },
  cancelButton: {
    backgroundColor: '#7A67FF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default BookingList;