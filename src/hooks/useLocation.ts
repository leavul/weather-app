import * as Location from 'expo-location';
import { useCallback, useState } from 'react';

type LocationStatus = "idle" | "loading" | "success" | "error";

type PermissionState = {
    status: LocationStatus;
    errorMessage: string | null;
    canAskForPermissionAgain: boolean | null;
};

type LocationState = {
    latitude: number | null;
    longitude: number | null;
};

export const useLocation = () => {
    const [permissionStatus, setPermissionStatus] = useState<PermissionState>({
        status: 'idle',
        errorMessage: null,
        canAskForPermissionAgain: null
    });
    const [location, setLocation] = useState<LocationState>({
        latitude: null,
        longitude: null,
    });

    const getCurrentLocation = useCallback(async () => {
        setPermissionStatus({
            status: 'loading',
            errorMessage: null,
            canAskForPermissionAgain: null
        });

        setLocation({
            latitude: null,
            longitude: null
        })

        try {
            const { status, canAskAgain } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                const message = 'Permission to access location was denied';
                setPermissionStatus({
                    status: 'error',
                    canAskForPermissionAgain: canAskAgain,
                    errorMessage: message
                });
                return;
            }

            const { coords } = await Location.getCurrentPositionAsync();
            setLocation({
                latitude: coords.latitude,
                longitude: coords.longitude,
            });

            setPermissionStatus({
                status: 'success',
                canAskForPermissionAgain: canAskAgain,
                errorMessage: null
            });

        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Unable to get your current location right now.';
            setPermissionStatus({
                status: 'error',
                canAskForPermissionAgain: true,
                errorMessage: message
            });
        }
    }, []);

    return {
        permissionStatus,
        getCurrentLocation,
        location
    };
};
