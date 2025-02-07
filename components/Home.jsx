import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../Config/Firebase';
import BottomNavbar from './BottomNavbar';
import SearchSection from './SearchSection';

const Home = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef);
      const querySnapshot = await getDocs(q);

      const bookingsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        location: doc.data().location || 'Location not specified',
        name: doc.data().name || 'Unnamed',
        price: doc.data().price || '0',
        phone: doc.data().phone || 'N/A',
        date: doc.data().date || '',
        status: doc.data().status || 'Available',
      }));

      setBookings(bookingsList);
      setFilteredBookings(bookingsList);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSearch = (searchParams) => {
    const { location, costPerHour } = searchParams;
    
    let filtered = [...bookings];

    // Filter by location if provided
    if (location) {
      filtered = filtered.filter(booking => 
        booking.location.toLowerCase().includes(location)
      );
    }

    // Filter by cost if provided
    if (costPerHour > 0) {
      filtered = filtered.filter(booking => {
        const bookingPrice = parseInt(booking.price) || 0;
        return bookingPrice <= costPerHour;
      });
    }

    setFilteredBookings(filtered);
  };

  const handleNavigateToBooking = (bookingId) => {
    navigation.navigate('Booking', { bookingId });
  };

  const renderBooking = ({ item }) => {
    const imageSource = item.image
      ? { uri: item.image }
      : require('../assets/turf.jpg');
  
    return (
      <View style={styles.playgroundCard}>
        <Image source={imageSource} style={styles.playgroundImage} />
        <View style={styles.playgroundDetails}>
          <View style={styles.infoLeft}>
            <Text style={styles.locationText}>{item.location}</Text>
            <Text style={styles.priceText}>{item.price} / Hour</Text>
          </View>
          <View style={styles.infoRight}>
            <Text style={styles.nameText}>{item.name}</Text>
            <TouchableOpacity
              style={styles.bookNowButton}
              onPress={() => handleNavigateToBooking(item.id)}
            >
              <Text style={styles.bookNowButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View>
      <View style={styles.searchSection}>
        <SearchSection onSearch={handleSearch} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>
          INDOOR <Text style={styles.logoHighlight}>XYZ</Text>
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : filteredBookings.length === 0 ? (
        <Text style={styles.noPlaygroundsText}>No bookings available</Text>
      ) : (
        <FlatList
          data={filteredBookings}
          renderItem={renderBooking}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.playgroundsSection}
        />
      )}

      <BottomNavbar activeTab={activeTab} setActiveTab={setActiveTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // marginTop: 50,
    paddingTop:50,
    width: '100%',
  },
  header: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoHighlight: {
    color: '#7A67FF',
  },
  menuIcon: {
    fontSize: 24,
  },
  searchSection: {
  marginBottom: 20,
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  filterText: {
    fontSize: 15,
    backgroundColor: '#ddd',
    paddingHorizontal: 20,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
    color: '#333',
  },
  activeFilter: {
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#7A67FF',
  },
  playgroundsSection: {
    paddingHorizontal: 20,
  },
  playgroundCard: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    marginBottom: 25,
    height: 380,
    overflow: 'hidden',
  },
  playgroundImage: {
    width: '100%',
    height: 230,
  },
  playgroundDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    height: 85,
  },
  infoLeft: {
    alignItems: 'flex-start',
    flex: 1,
  },
  infoRight: {
    alignItems: 'flex-end',
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    color: '#777',
    marginTop: 5,
    marginBottom: -8,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  priceText: {
    fontSize: 22,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 20,
  },
  loader: {
    marginVertical: 20,
  },
  noPlaygroundsText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#666',
  },
  bookNowButton: {
    backgroundColor: '#7A67FF',  
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  bookNowButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Home;