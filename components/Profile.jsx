import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import BottomNavbar from "../components/BottomNavbar";
import { db } from '../Config/Firebase';

const Profile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchUserDataAndBookings();
  }, []);

  const fetchUserDataAndBookings = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Fetch user data
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setUserData(userDocSnap.data());
      }

      // Fetch user's bookings from the main bookings collection
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const bookingsData = [];
      querySnapshot.forEach((doc) => {
        bookingsData.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (screen) => {
    setActiveTab('addIndoor');
    navigation.navigate(screen);
  };

  const handleEdit = (bookingId) => {
    // Navigate to edit screen with booking data
    navigation.navigate('EditBooking', { bookingId });
  };

  const handleCancel = async (bookingId) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: async () => {
            // Add cancellation logic here
            // You might want to update the status rather than delete
            try {
              // Update the booking status to cancelled
              const bookingRef = doc(db, 'bookings', bookingId);
              await updateDoc(bookingRef, {
                status: 'cancelled',
                cancelledAt: new Date().toISOString()
              });
              
              // Refresh bookings
              fetchUserDataAndBookings();
              Alert.alert('Success', 'Booking cancelled successfully');
            } catch (error) {
              console.error('Error cancelling booking:', error);
              Alert.alert('Error', 'Failed to cancel booking');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8A5EFF" />
      </View>
    );
  }

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);  // Sign out the user
      navigation.navigate('Login');  // Navigate to the Login screen
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileCard}>
        <Image
          source={{uri:"https://via.placeholder.com/100"}}
          style={styles.profileImage}
        />
       <View style={styles.profileDetails}>
            <Text style={styles.name}>{ userData?.name || 'User'}</Text>
            <Text style={styles.phone}>{userData?.phone || 'No phone number'}</Text>
               <TouchableOpacity 
                  style={styles.logoutButton} 
                  onPress={handleLogout}
                >
  <Text style={styles.LogoutBtn}>Logout</Text>
</TouchableOpacity>

            
      </View>
      </View>

      {/* Add Indoor Button */}
      <TouchableOpacity 
        style={styles.addIndoorButton} 
        onPress={() => handleNavigate('AddPlayground')}
      >
        <Text style={styles.addIndoorText}>Add Indoor</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.addIndoorButton} 
        onPress={() => handleNavigate('ViewOrder')}
      >
        <Text style={styles.addIndoorText}>View Orders</Text>
      </TouchableOpacity>

      {/* Booking Cards */}
      {bookings.length === 0 ? (
        <View style={styles.noBookings}>
          <Text style={styles.noBookingsText}>No bookings found</Text>
        </View>
      ) : (
        bookings.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            <Image
              source={{ uri: booking.imageUrl || 'https://via.placeholder.com/300' }}
              style={styles.bookingImage}
            />
            <View style={styles.bookingDetails}>
              <Text style={styles.locationText}>{booking.location}</Text>
              <Text style={styles.indoorName}>{booking.name}</Text>
              <Text style={styles.priceText}>৳{booking.price} Per Hour</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => handleEdit(booking.id)}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => handleCancel(booking.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}

      {/* Bottom Navbar */}
      <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: "#F8F8F8",
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 20,
    border: '1px solid #000',
    borderRadius: 15,
    elevation: 3,
    height: 180,
  },
  profileImage: {
    width: 160,
    height: 180,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
  },
  profileDetails: {
    marginLeft: 15,
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  phone: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  socialLink: {
    fontSize: 14,
    color: "#7a67ff",
    marginTop: 5,
  },
  addIndoorButton: {
    backgroundColor: "#7a67ff",
    margin: 10,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  addIndoorText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  bookingCard: {
    backgroundColor: "#FFF",
    margin: 10,
    borderRadius: 10,
    elevation: 3,
    overflow: "hidden",
  },
  bookingImage: {
    width: "100%",
    height: 200,
  },
  bookingDetails: {
    padding: 15,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
  },
  indoorName: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 5,
    color: "#333",
  },
  priceText: {
    fontSize: 14,
    color: "#7a67ff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#7a67ff",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  cancelButton: {
    backgroundColor: "#FF5C5C",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    width: 100,
    textAlign: "center",
    height: 30,
    paddingVertical: 5,
  },
  logoutButton: {
    backgroundColor: "transparent",
    
    borderRadius: 5,
    marginTop: 10,
    
  },
  LogoutBtn:{
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor:'transparent',
  }
});

export default Profile;