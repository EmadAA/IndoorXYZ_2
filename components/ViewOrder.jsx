import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../Config/Firebase';

const ViewOrder = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const auth = getAuth();
      const userId = auth.currentUser?.uid;

      if (!userId) {
        console.error('User not authenticated.');
        return;
      }

      try {
        const bookingsRef = collection(db, 'bookings');
        const ownedBookingsQuery = query(bookingsRef, where('userId', '==', userId));
        const ownedBookingsSnapshot = await getDocs(ownedBookingsQuery);

        const bookingDetailsPromises = ownedBookingsSnapshot.docs.map(async (bookingDoc) => {
          const bookingData = bookingDoc.data();
          const bookingReference = bookingDoc.data().bookingReference;

          // Fetch indoor booking details based on bookingReference
          const indoorBookingDetails = await fetchIndoorBookingDetails(bookingReference);
          return {
            ...bookingData,
            id: bookingDoc.id,
            ...indoorBookingDetails
          };
        });

        const processedBookings = await Promise.all(bookingDetailsPromises);
        setBookings(processedBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const fetchIndoorBookingDetails = async (bookingReference) => {
    try {
      const indoorBookingsRef = collection(db, 'indoorBookings');
      const indoorBookingQuery = query(indoorBookingsRef, where('bookingReference', '==', bookingReference));
      const indoorBookingSnapshot = await getDocs(indoorBookingQuery);

      if (indoorBookingSnapshot.empty) {
        console.error(`No indoor booking found for reference: ${bookingReference}`);
        return {};
      }

      return indoorBookingSnapshot.docs[0].data();
    } catch (error) {
      console.error('Error fetching indoor booking details:', error);
      return {};
    }
  };

  const handleCancel = (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      console.log('Cancel booking:', bookingId);
      // Implement cancellation logic here (e.g., update the status to 'cancelled')
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Indoor Orders</Text>
        {bookings.length === 0 ? (
          <Text style={styles.noBookings}>No orders found</Text>
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
                <View style={styles.detailsRow}>
                  <Text style={styles.indoorName}>{booking.name}</Text>
                  <Text style={styles.price}>৳{booking.cost}</Text>
                </View>
                <View style={styles.timeSlotContainer}>
                  <View style={styles.dateTimeContainer}>
                    <Text style={styles.timeSlot}>
                      {booking.fromTime} - {booking.toTime}
                    </Text>
                    <Text style={styles.date}>{booking.date}</Text>
                  </View>
                </View>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentType}>{`Payment: ${booking.paymentType}`}</Text>
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
                      <Text style={styles.expiredButtonText}>Expired</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
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
  cancelButton: {
    backgroundColor: '#7A67FF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  expiredButton: {
    backgroundColor: '#CCCCCC',
  },
  expiredButtonText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ViewOrder;
