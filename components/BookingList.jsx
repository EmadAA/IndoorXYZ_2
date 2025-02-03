import { getAuth } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../Config/Firebase';
import BottomNavbar from './BottomNavbar';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [intervalIds, setIntervalIds] = useState({});

  useEffect(() => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) {
      console.error('User not authenticated.');
      return;
    }

    const bookingsRef = collection(db, 'indoorBookings');
    const userBookingsQuery = query(bookingsRef, where('userId', '==', userId));

    const unsubscribe = onSnapshot(userBookingsQuery, (snapshot) => {
      const userBookings = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        timeRemaining: 1200,
        isExpired: false
      }));
      setBookings(userBookings);

      const newIntervalIds = {};
      userBookings.forEach((booking) => {
        newIntervalIds[booking.id] = startTimer(booking.id, booking.createdAt);
      });
      setIntervalIds(newIntervalIds);
    }, (error) => {
      console.error("Error fetching bookings:", error);
    });

    return () => {
      Object.values(intervalIds).forEach(clearInterval);
      unsubscribe();
    };
  }, []);

  const startTimer = (bookingId, createdAt) => {
    return setInterval(() => {
      updateTimeRemaining(bookingId, createdAt);
    }, 1000);
  };

  const updateTimeRemaining = (bookingId, createdAt) => {
    const now = new Date().getTime();
    const createdAtDate = new Date(createdAt).getTime();
    const timeRemaining = 1200 - Math.floor((now - createdAtDate) / 1000);

    setBookings((prevBookings) =>
      prevBookings.map((booking) => {
        if (booking.id === bookingId) {
          if (timeRemaining <= 0) {
            clearInterval(intervalIds[bookingId]);
            
            return {
              ...booking, 
              timeRemaining: 0, 
              isExpired: true
            };
          }
          return { 
            ...booking, 
            timeRemaining 
          };
        }
        return booking;
      })
    );
  };

  const formatTimeRemaining = (timeRemaining) => {
    if (timeRemaining <= 0) return "Expired";
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCancel = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking && !booking.isExpired) {
      console.log('Cancel booking:', bookingId);
    }
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
                <View style={styles.nameandlocation}>
                  <View style={styles.locationContainer}>
                    <Text style={styles.locationIcon}>📍</Text>
                    <Text style={styles.locationText}>{booking.location || 'Indoor Location'}</Text>
                  </View>
                  <View style={styles.indoorNameContainer}>
                    <Text style={styles.indoorNameText}>{booking.IndoorName}</Text>
                  </View>
                </View>
                {!booking.isExpired && (
                  <View style={styles.timerContainer}>
                    <Text style={styles.timerText}>
                      Time remaining for cancellation : {formatTimeRemaining(booking.timeRemaining)}
                    </Text>
                  </View>
                )}
                <View style={styles.detailsRow}>
                  <Text style={styles.indoorName}>{booking.name}</Text>
                  <Text style={styles.price}>৳{booking.cost}</Text>
                </View>
                <View style={styles.timeSlotContainer}>
                  <View style={styles.dateTimeContainer}>
                    <Text style={styles.timeSlot}>
                      {booking.fromTime} - {booking.toTime}
                    </Text>
                    <Text style={styles.date}>
                      {booking.date}
                    </Text>
                  </View>
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentType}>{"Payment : "+booking.paymentType}</Text>
                </View>
                {!booking.isExpired && (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={() => handleCancel(booking.id)}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {booking.isExpired && (
                  <View style={styles.buttonContainer}>
                    <View style={[styles.button, styles.expiredButton]}>
                      <Text style={styles.expiredButtonText}>Cancel</Text>
                    </View>
                  </View>
                )}
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
  nameandlocation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  indoorNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  indoorNameText: {
    fontSize: 18,
    color: '#000',
    fontWeight: 'bold',
  },
  timerContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 16,
    color: '#7A67FF',
    fontWeight: 'bold',
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
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeSlot: {
    fontSize: 14,
    color: '#666',
  },
  date: {
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
  expiredButton: {
    backgroundColor: '#CCCCCC', // Grayed out color
  },
  expiredButtonText: {
    color: '#666666', // Lighter text color
    fontSize: 14,
    fontWeight: '500',
  },
});

export default BookingList;