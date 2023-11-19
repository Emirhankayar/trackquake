/* import React, { useEffect } from 'react';
import { messaging } from './firebaseConfig';

const Notification = () => {
  useEffect(() => {
    const requestNotificationPermission = async () => {
      try {
        await messaging.requestPermission();
        const token = await messaging.getToken();
        console.log('Notification permission granted.');
        console.log('FCM token:', token);
      } catch (error) {
        console.error('Error requesting notification permission:', error);
      }
    };

    const getCurrentLocation = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            resolve({ latitude, longitude });
          },
          error => {
            reject(error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      });
    };

    const checkNearbyEarthquakes = (location) => {
      // Fetch nearby earthquakes data from Firebase or any other data source
      const fetchNearbyEarthquakes = async (latitude, longitude) => {
        try {
          // Make an API call to fetch earthquake data
          const response = await fetch(
            `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`
          );
          const data = await response.json();

          // Filter earthquakes within a certain radius of the user's location
          const radiusInKm = 50; // Set the radius for proximity check (in kilometers)
          const nearbyEarthquakes = data.features.filter(earthquake =>
            isWithinRadius(latitude, longitude, earthquake.geometry.coordinates, radiusInKm)
          );

          // Check if there are any nearby earthquakes
          if (nearbyEarthquakes.length > 0) {
            // Trigger a notification or alarm to notify the user about the nearby earthquakes
            triggerNotification();
          }
        } catch (error) {
          console.error('Error fetching earthquake data:', error);
        }
      };

      // Check if the user has granted geolocation permission
      if ('geolocation' in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
          if (permissionStatus.state === 'granted') {
            getCurrentLocation().then(location => {
              checkNearbyEarthquakes(location);
            });
          }
        });
      }
    };

    const isWithinRadius = (latitude, longitude, coordinates, radiusInKm) => {
      const [earthquakeLatitude, earthquakeLongitude] = coordinates;
      const distance = calculateDistance(latitude, longitude, earthquakeLatitude, earthquakeLongitude);
      return distance <= radiusInKm;
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of the earth in km
      const dLat = deg2rad(lat2 - lat1);
      const dLon = deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km
      return distance;
    };

    const deg2rad = deg => {
      return deg * (Math.PI / 180);
    };

    const triggerNotification = () => {
      // Implement the logic to trigger a notification or alarm here
      // You can use a notification library or the Web Notification API
      // to display a notification to the user
    };

    // Request notification permission when the component mounts
    requestNotificationPermission();

    // Check for nearby earthquakes when the component mounts
    checkNearbyEarthquakes();
  }, []);

  return <div className="notification-component">Notification Component</div>;
};

export default Notification;
 */