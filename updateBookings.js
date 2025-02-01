const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

const db = admin.firestore();

const updateBookings = async () => {
  const bookingsSnapshot = await db.collection("bookings").get();

  bookingsSnapshot.forEach(async (doc) => {
    const bookingId = doc.id;
    const bookingData = doc.data();

    // Map booking to a specific user ID (you need to replace this with your logic)
    const userId = "8HkVIsZ0aObtruqtSN7lGvVi8Rs2"; // Replace with actual user ID logic

    try {
      await doc.ref.update({ userId });
      console.log(`Updated booking ${bookingId} with userId: ${userId}`);
    } catch (error) {
      console.error(`Error updating booking ${bookingId}:`, error);
    }
  });

  console.log("All bookings updated successfully!");
};

updateBookings();
