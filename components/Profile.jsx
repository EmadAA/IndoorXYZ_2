import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import BottomNavbar from "../components/BottomNavbar";
import { db } from '../Config/Firebase';

const Profile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedBooking, setEditedBooking] = useState(null);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);

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

  const handleEdit = (booking) => {
    setEditedBooking({
      ...booking,
      number: booking.phone || '' // Ensure number is always included
    });
    setEditModalVisible(true);
  }

  const handleUpdateBooking = async () => {
    if (!editedBooking) return;
  
    try {
      const bookingRef = doc(db, 'bookings', editedBooking.id);
      await updateDoc(bookingRef, {
        name: editedBooking.name,
        location: editedBooking.location,
        price: parseFloat(editedBooking.price),
        phone: editedBooking.phone // Update to 'phone' to match your database
      });
  
      // Refresh bookings
      await fetchUserDataAndBookings();
      
      setEditModalVisible(false);
      Alert.alert('Success', 'Booking updated successfully');
    } catch (error) {
      console.error('Error updating booking:', error);
      Alert.alert('Error', 'Failed to update booking');
    }
  };

  const handleUpdateProfile = async () => {
    if (!editedProfile) return;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const userDocRef = doc(db, 'users', user.uid);

      await updateDoc(userDocRef, {
        name: editedProfile.name,
        phone: editedProfile.phone,
      });

      // Refresh user data
      await fetchUserDataAndBookings();
      
      setEditProfileModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleDelete = async (bookingId) => {
    Alert.alert(
      'Delete Indoor',
      'Are you sure you want to delete this indoor?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete the booking document from Firestore
              await deleteDoc(doc(db, 'bookings', bookingId));
              
              // Refresh bookings after deletion
              await fetchUserDataAndBookings();
              
              Alert.alert('Success', 'Indoor deleted successfully');
            } catch (error) {
              console.error('Error deleting indoor:', error);
              Alert.alert('Error', 'Failed to delete indoor');
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
      // Ensure user is signed in before attempting logout
      if (auth.currentUser) {
        await signOut(auth);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        // If no current user, force navigation to login
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
      
      // More specific error handling
      if (error.code === 'auth/invalid-user-token') {
        // Token is invalid, force logout and redirect
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        Alert.alert(
          'Logout Error', 
          'Unable to log out. Please try again or restart the app.', 
          [{ text: 'OK' }]
        );
      }
    }
  };

  const handleEditProfile = () => {
    setEditedProfile({
      name: userData?.name || '',
      phone: userData?.phone || '',
    });
    setEditProfileModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileCard}>
        <Image
          source={require('../assets/profilePicture.jpg')}
          style={styles.profileImage}
        />
       <View style={styles.profileDetails}>
            <Text style={styles.name}>{ userData?.name || 'User'}</Text>
            <Text style={styles.phone}>{userData?.phone || 'No phone number'}</Text>
            <View style={styles.profileButtonRow}>
              <TouchableOpacity 
                style={styles.editProfileButton} 
                onPress={handleEditProfile}
              >
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.logoutButton} 
                onPress={handleLogout}
                
              >
                <Text style={styles.LogoutBtn}><Icon name="sign-out" size={16} color="#000" />Logout</Text>
              </TouchableOpacity>
            </View>
      </View>
      </View>

      {/* Add Indoor Button */}
      <View style={styles.addAndViewIndoorButtonContainer}> 
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
      </View>

      {/* Booking Cards */}
      {bookings.length === 0 ? (
        <View style={styles.noBookings}>
          <Text style={styles.noBookingsText}>No bookings found</Text>
        </View>
      ) : 
        bookings.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            <Image
              source={require('../assets/turf.jpg')}
              style={styles.bookingImage}
            />
            <View style={styles.bookingDetails}>
              <Text style={styles.locationText}>{booking.location}</Text>
              <Text style={styles.indoorName}>{booking.name}</Text>
              <Text style={styles.priceText}>৳{booking.price} Per Hour</Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => handleEdit(booking)}
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => handleDelete(booking.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
  
        {/* Edit Booking Modal */}
        <Modal
  animationType="slide"
  transparent={true}
  visible={editModalVisible}
  onRequestClose={() => setEditModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Edit Booking</Text>
      
      <TextInput
        style={styles.modalInput}
        placeholder="Name"
        value={editedBooking?.name}
        onChangeText={(text) => setEditedBooking({...editedBooking, name: text})}
      />
      
      <TextInput
        style={styles.modalInput}
        placeholder="Location"
        value={editedBooking?.location}
        onChangeText={(text) => setEditedBooking({...editedBooking, location: text})}
      />
      
      <TextInput
        style={styles.modalInput}
        placeholder="Price"
        keyboardType="numeric"
        value={editedBooking?.price ? editedBooking.price.toString() : ''}
        onChangeText={(text) => setEditedBooking({...editedBooking, price: text})}
      />
      
      <TextInput
        style={styles.modalInput}
        placeholder="Number"
        keyboardType="phone-pad"
        value={editedBooking?.phone || ''}
        onChangeText={(text) => setEditedBooking({...editedBooking, phone: text})}
      />
      
      <View style={styles.modalButtonRow}>
        <TouchableOpacity 
          style={styles.modalCancelButton}
          onPress={() => setEditModalVisible(false)}
        >
          <Text style={styles.modalButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.modalUpdateButton}
          onPress={handleUpdateBooking}
        >
          <Text style={styles.modalButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

        {/* Edit Profile Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={editProfileModalVisible}
          onRequestClose={() => setEditProfileModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              
              <TextInput
                style={styles.modalInput}
                placeholder="Name"
                value={editedProfile?.name}
                onChangeText={(text) => setEditedProfile({...editedProfile, name: text})}
              />
              
              <TextInput
                style={styles.modalInput}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={editedProfile?.phone}
                onChangeText={(text) => setEditedProfile({...editedProfile, phone: text})}
              />
              
              
              <View style={styles.modalButtonRow}>
                <TouchableOpacity 
                  style={styles.modalCancelButton}
                  onPress={() => setEditProfileModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.modalUpdateButton}
                  onPress={handleUpdateProfile}
                >
                  <Text style={styles.modalButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
  
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 20,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 15,
    elevation: 3,
    height: 180,
  },
  profileImage: {
    width: 120,
    height: 170,
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
  addIndoorButton: {
    backgroundColor: "#7a67ff",
    margin: 10,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 40,
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
    fontSize: 16,
    color: "#000",
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
    backgroundColor: "#D51339",
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
    borderColor: "#000",
    borderWidth:1,
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 15,
    marginTop:10,
  },
  LogoutBtn:{
    color: "#000",
    fontSize: 15,
    fontWeight: "bold",
    backgroundColor:'transparent',
  },
  noBookings: {
    alignItems: 'center',
    marginTop: 20,
  },
  noBookingsText: {
    fontSize: 16,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  modalUpdateButton: {
    backgroundColor: '#7a67ff',
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  profileButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  editProfileButton: {
    backgroundColor: "#7a67ff",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    marginTop:10,
  },
  editProfileText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  addAndViewIndoorButtonContainer:{
    flexDirection: "row",
    justifyContent: "space-evenly",
  }
});

export default Profile;