import { useMediaQuery } from 'react-responsive';
import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Layout } from './Layout';
import { Login } from './Login';

export function App() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=209e499711c840c495f32d6fcf8017bf`);
          const data = await response.json();
          const { city, country } = data.results[0].components;
          setLocation(`${city}, ${country}`);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // const isMobile = useMediaQuery({ query: '(max-width: 425px)' });
  const isMobile = true
  if (isMobile) {
    return (
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    );
  }
};
