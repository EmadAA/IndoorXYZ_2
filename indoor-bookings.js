import { getAuth } from 'firebase/auth';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from './Config/Firebase';

// Create a new indoor booking document
export const createIndoorBooking = async (bookingData) => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) {
      console.error('User not authenticated.');
      return;
    }

    // Add the ownerId field to the booking data
    const fullBookingData = { ...bookingData, ownerId: userId };

    const indoorBookingsRef = collection(db, 'indoorBookings');
    const newBookingDoc = await addDoc(indoorBookingsRef, fullBookingData);

    console.log('New indoor booking created:', newBookingDoc.id);
    return newBookingDoc.id;
  } catch (error) {
    console.error('Error creating indoor booking:', error);
    throw error;
  }
};

// Fetch indoor bookings for the current owner
export const fetchOwnerIndoorBookings = async () => {
  try {
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) {
      console.error('User not authenticated.');
      return [];
    }

    const indoorBookingsRef = collection(db, 'indoorBookings');
    const ownerBookingsQuery = query(indoorBookingsRef, where('ownerId', '==', userId));
    const querySnapshot = await getDocs(ownerBookingsQuery);

    const ownerBookings = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return ownerBookings;
  } catch (error) {
    console.error('Error fetching owner indoor bookings:', error);
    throw error;
  }
};

// Update an indoor booking
export const updateIndoorBooking = async (bookingId, updatedData) => {
  try {
    const indoorBookingRef = doc(db, 'indoorBookings', bookingId);
    await updateDoc(indoorBookingRef, updatedData);
    console.log('Indoor booking updated:', bookingId);
  } catch (error) {
    console.error('Error updating indoor booking:', error);
    throw error;
  }
};