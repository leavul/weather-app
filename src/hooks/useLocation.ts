import * as Location from 'expo-location';
import { useCallback, useState } from 'react';

type PermissionStatus = {
    isLoading: boolean
    errorMessage: string | null
    canAskForPermissionAgain: boolean | null
}

type LocationState = {
    latitude: number | null;
    longitude: number | null;
};

export const useLocation = () => {
    const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>({
        isLoading: false,
        errorMessage: null,
        canAskForPermissionAgain: null
    });
    const [location, setLocation] = useState<LocationState>({
        latitude: null,
        longitude: null,
    });

    const getCurrentLocation = useCallback(async () => {
        setPermissionStatus((currentState) => {
            return { ...currentState, isLoading: true, errorMessage: null }
        })

        try {
            const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                const message = 'Permission to access location was denied';
                setPermissionStatus((currentState) => {
                    return { ...currentState, canAskForPermissionAgain: canAskAgain, errorMessage: message }
                })
                return;
            }

            const { coords } = await Location.getCurrentPositionAsync();
            setLocation({
                latitude: coords.latitude,
                longitude: coords.longitude,
            });
        } catch (error) {
            const message = 'Unable to get your current location right now.';
            setPermissionStatus((currentState) => {
                return { ...currentState, canAskForPermissionAgain: true, errorMessage: message }
            })
        } finally {
            setPermissionStatus((currentState) => {
                return { ...currentState, isLoading: false }
            })
        }
    }, []);

    return {
        permissionStatus,
        getCurrentLocation,
        location
    };
};
