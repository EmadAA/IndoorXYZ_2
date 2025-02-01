import { NavigationContainer } from '@react-navigation/native'; // Import NavigationContainer
import { useState } from 'react';
// import BookingList from './components/BookingList';
import Navigation from './Navigation'; // Import Navigation Component
// import Profile from './components/Profile';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); 
  return (
    <NavigationContainer>
      <Navigation />
      {/* <BookingList /> */}
    {/* <Profile  /> */}
    {/* <Home /> */}
    </NavigationContainer>
  );
}