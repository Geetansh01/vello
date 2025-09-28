// Location detection utility functions

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

export const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    // Using a free geocoding service (you might want to use Google Maps API in production)
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch address');
    }
    
    const data = await response.json();
    
    return {
      address_line: `${data.locality || ''} ${data.localityInfo?.administrative?.[2]?.name || ''}`.trim(),
      city: data.city || data.locality || '',
      state: data.principalSubdivision || '',
      pincode: data.postcode || '',
      full_address: data.display_name || '',
    };
  } catch (error) {
    console.error('Error getting address from coordinates:', error);
    throw error;
  }
};

export const detectUserLocation = async () => {
  try {
    const coordinates = await getCurrentLocation();
    const address = await getAddressFromCoordinates(coordinates.latitude, coordinates.longitude);
    
    return {
      ...address,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    };
  } catch (error) {
    console.error('Error detecting user location:', error);
    throw error;
  }
};