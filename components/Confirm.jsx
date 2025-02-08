import { useRoute } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { db } from '../Config/Firebase';
import BottomNavbar from './BottomNavbar';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';

const Confirm = () => {
  const route = useRoute();
  const bookingId = route.params?.bookingId;

  const [timeSlot, setTimeSlot] = useState({ from: null, to: null });
  const [selectedDate, setSelectedDate] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tranxID, setTranxID] = useState('');
  const [paymentType, setPaymentType] = useState('Cash On Sight');
  const [indoorCost, setIndoorCost] = useState(0);
  const [indoorName, setIndoorName] = useState('');
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const bookingRef = doc(db, 'bookings', bookingId);
      const bookingSnap = await getDoc(bookingRef);
      
      if (bookingSnap.exists()) {
        const data = bookingSnap.data();
        setBookingData(data);
        setIndoorCost(data.price || 0);
        setIndoorName(data.name || '');
      } else {
        console.log('No booking data found');
        Alert.alert('Error', 'Booking information not found');
      }
    } catch (error) {
      console.error('Failed to fetch booking details:', error);
      Alert.alert('Error', 'Failed to load booking information');
    }
  };

  const checkSlotAvailability = async (date, fromTime, toTime) => {
    try {
      const bookingsRef = collection(db, 'indoorBookings');
      const q = query(
        bookingsRef,
        where('date', '==', date),
        where('fromTime', '==', fromTime),
        where('toTime', '==', toTime),
        where('IndoorName', '==', indoorName)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.empty;
    } catch (error) {
      console.error('Error checking slot availability:', error);
      return false;
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const calculateEndTime = (startTime) => {
    const hour = parseInt(startTime.replace('am', '').replace('pm', ''));
    const isAM = startTime.includes('am');
    
    let endHour = hour + 1;
    
    if (hour === 11 && isAM) {
      return '12pm';
    } else if (hour === 12) {
      return '1pm';
    } else if (isAM) {
      return `${endHour}am`;
    } else {
      return `${endHour}pm`;
    }
  };

  const handleTimeChange = async (slot) => {
    if (selectedDate && slot.from) {
      const endTime = calculateEndTime(slot.from);
      const newTimeSlot = {
        from: slot.from,
        to: endTime
      };

      const isAvailable = await checkSlotAvailability(selectedDate, newTimeSlot.from, newTimeSlot.to);
      
      if (!isAvailable) {
        Alert.alert(
          'Time Slot Unavailable',
          `This time slot is already booked . Please choose another time or date.`,
          [{ text: 'OK' }]
        );
        return;
      }

      setTimeSlot(newTimeSlot);
    }
  };
  const handleSubmit = async () => {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
  
    // Check if phone number is empty
    if (!phone.trim()) {
      Alert.alert('Error', 'Phone number cannot be empty.');
      return;
    }
  
    // Check if phone number format is valid
    if (phone.length !== 11 || !phone.startsWith("01")) {
      Alert.alert('Error', 'Phone number must start with "01" and be exactly 11 digits.');
      return;
    }
  
    // Check if date is selected
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date.');
      return;
    }
  
    // Check if time slot is selected
    if (!timeSlot.from || !timeSlot.to) {
      Alert.alert('Error', 'Please select a valid time slot.');
      return;
    }
  
    // Check if TranxID is required and missing
    const tranxIDValidation = paymentType === 'Full Payment' ? tranxID.trim() === '' : false;
    if (tranxIDValidation) {
      Alert.alert('Error', 'Transaction ID is required for Full Payment.');
      return;
    }
  
    // Check if user is logged in
    if (!userId) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }
  
    const isAvailable = await checkSlotAvailability(selectedDate, timeSlot.from, timeSlot.to);
    if (!isAvailable) {
      Alert.alert(
        'Time Slot Unavailable',
        `This time slot was just booked for ${indoorName}. Please choose another time or date.`,
        [{ text: 'OK' }]
      );
      return;
    }
  
    const indoorBookingData = {
      date: selectedDate,
      fromTime: timeSlot.from,
      toTime: timeSlot.to,
      name: name.trim(),
      phone: phone.trim(),
      cost: indoorCost,
      tranxID: paymentType === 'Full Payment' ? tranxID.trim() : 'N/A',
      paymentType,
      userId,
      bookingId,
      createdAt: new Date().toISOString(),
      location: bookingData?.location || '',
      status: 'pending',
      userEmail: bookingData?.userEmail || '',
      bookingReference: bookingData?.bookingReference || '',
      IndoorName: indoorName
    };
  
    try {
      const docRef = await addDoc(collection(db, 'indoorBookings'), indoorBookingData);
      console.log('Booking added with ID: ', docRef.id);
      Alert.alert('Success', 'Booking Confirmed!');
    } catch (error) {
      console.error('Error confirming booking:', error);
      Alert.alert('Error', 'Error confirming booking.');
    }
  };
  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Booking Info</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Date</Text>
          <DatePicker onDateSelect={handleDateChange} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Time Slot</Text>
          <TimePicker onTimeSelect={handleTimeChange} />
          <View style={styles.timing}>
          <Text style={styles.timingText}>From: {timeSlot.from || 'Not selected'}</Text>
          <Text style={styles.timingText}>To: {timeSlot.to || 'Not selected'}</Text>
          </View>
        </View>
        <View>
          
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Your Name"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
  <TextInput
    style={styles.input}
    placeholder="Enter Your Number"
    value={phone}
    keyboardType="phone-pad"
    onChangeText={(text) => {
      // Ensure only numbers are entered
      const formattedText = text.replace(/[^0-9]/g, '');
      
      // Enforce 11-digit constraint and ensure it starts with "01"
      if (formattedText.length <= 11) {
        setPhone(formattedText);
      }

      if (formattedText.length === 11 && !formattedText.startsWith("01")) {
        Alert.alert('Invalid Number', 'Phone number must start with "01" and be exactly 11 digits.');
        setPhone(""); // Reset input if invalid
      }
    }}
  />
</View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Indoor Name</Text>
          <Text style={styles.nonEditableInput}>{"  " + indoorName}</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Indoor Cost</Text>
          <Text style={styles.nonEditableInput}>{"  " + indoorCost + " ৳"}</Text>
        </View>
        <View style={styles.inputContainer}>
          {paymentType === 'Full Payment' ? (
            <TextInput
              style={styles.input}
              placeholder="Enter TranxID"
              value={tranxID}
              onChangeText={setTranxID}
            />
          ) : (
            <Text style={styles.nonEditableInput}>TranxID not required for Cash On Sight</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Payment Type</Text>
          <View style={styles.paymentTypeContainer}>
            <TouchableOpacity
              style={[
                styles.paymentTypeCheckbox,
                paymentType === 'Cash On Sight' ? styles.selectedPaymentType : null,
              ]}
              onPress={() => {
                setPaymentType('Cash On Sight');
                setTranxID(''); // Clear TranxID when switching to Cash On Sight
              }}
            >
              <Text style={[
                styles.paymentTypeText,
                paymentType === 'Cash On Sight' && { color: '#fff' }
              ]}>Cash On Sight</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.paymentTypeCheckbox,
                paymentType === 'Full Payment' ? styles.selectedPaymentType : null,
              ]}
              onPress={() => setPaymentType('Full Payment')}
            >
              <Text style={[
                styles.paymentTypeText,
                paymentType === 'Full Payment' && { color: '#fff' }
              ]}>Full Payment</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.confirmButton} onPress={handleSubmit}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavbar />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  nonEditableInput: {
    fontSize: 16,
    padding: 10,
    color: '#555',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  confirmButton: {
    backgroundColor: '#7A67FF',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  paymentTypeCheckbox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#7A67FF',
    borderRadius: 8,
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 5,
  },
  selectedPaymentType: {
    backgroundColor: '#7A67FF',
  },
  paymentTypeText: {
    color: '#7A67FF',
    fontSize: 14,
  },
  timing: {
    
  },
  timingText:{
    fontSize: 18,

  }
});

export default Confirm;