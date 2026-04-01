import * as Location from 'expo-location';
import { useCallback, useState } from 'react';

type LocationState = {
    latitude: number | null;
    longitude: number | null;
};

export const useLocation = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [location, setLocation] = useState<LocationState>({
        latitude: null,
        longitude: null,
    });

    const getCurrentLocation = useCallback(async () => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMessage('Permission to access location was denied');
                return;
            }

            const { coords } = await Location.getCurrentPositionAsync();
            setLocation({
                latitude: coords.latitude,
                longitude: coords.longitude,
            });
        } catch (error) {
            setErrorMessage('Unable to get your current location right now.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        location,
        errorMessage,
        isLoading,
        getCurrentLocation,
    };
};
