import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../Config/Firebase";

 function BookingScreen() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter Indoor name");
      return false;
    }
    if (!phone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return false;
    }
    if (!location.trim()) {
      Alert.alert("Error", "Please enter the location");
      return false;
    }
    if (!price.trim()) {
      Alert.alert("Error", "Please enter the price");
      return false;
    }
    return true;
  };

  const onChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === "ios");
    if (selectedDate) setDate(selectedDate);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    // Check if user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert("Error", "You must be logged in to make a booking");
      return;
    }

    setIsLoading(true);

    try {
      // Booking data with user ID and additional fields
      const bookingData = {
        name,
        phone,
        location,
        price: parseFloat(price),
        date: date.toISOString(),
        createdAt: new Date().toISOString(),
        userId: currentUser.uid,
        userEmail: currentUser.email,
        status: 'pending', // For booking status tracking
        paymentStatus: 'unpaid', // For payment tracking
        bookingReference: `BK${Date.now()}`, // Unique booking reference
      };

      // Add to user-specific subcollection
      const userBookingsRef = collection(db, `users/${currentUser.uid}/bookings`);
      const docRef = await addDoc(userBookingsRef, bookingData);

      // Also add to main bookings collection with user reference
      const mainBookingsRef = collection(db, "bookings");
      await addDoc(mainBookingsRef, {
        ...bookingData,
        bookingId: docRef.id,
      });

      Alert.alert(
        "Success",
        "Booking added successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              // Clear form after successful submission
              setName("");
              setPhone("");
              setLocation("");
              setPrice("");
              setDate(new Date());
            },
          },
        ]
      );
    } catch (error) {
      console.error("Error adding booking:", error);
      Alert.alert(
        "Error",
        "Failed to add booking. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/play.jpg")} style={styles.image} />

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Indoor Name"
          value={name}
          onChangeText={setName}
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Bkash Number"
          value={phone}
          keyboardType="phone-pad"
          onChangeText={setPhone}
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
          editable={!isLoading}
        />

        <TextInput
          style={styles.input}
          placeholder="Price Per Hour"
          value={price}
          keyboardType="numeric"
          onChangeText={setPrice}
          editable={!isLoading}
        />

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Add Now</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 200,
  },
  form: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#c4c4c4",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
  },
  placeholder: {
    color: "#c4c4c4",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#7A67FF",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default BookingScreen;