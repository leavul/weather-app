import { fetchWeather } from '@/src/api/weatherApi';
import AppButton from '@/src/components/ui/app-button';
import AppLoading from '@/src/components/ui/app-loading';
import AppLottie from '@/src/components/ui/app-lottie';
import { Animations } from '@/src/constants/animations';
import { Colors, Spacing } from '@/src/constants/theme';
import { StatusStyles } from '@/src/styles/status-styles';
import { FormattedWeather } from '@/src/types/weather';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const cannotGetUserLocationMessage = 'We were unable to retrieve weather information for your location. Please try again.';

type WeatherStatus = "idle" | "loading" | "success" | "error";

type WeatherState = {
    status: WeatherStatus;
    weatherInformation: FormattedWeather | null
    errorMessage: string | null;
}

type WeatherInformationProps = {
    location: {
        latitude: number;
        longitude: number;
    }
}
export default function WeatherInformation({ location }: WeatherInformationProps) {
    const [weatherState, setWeatherState] = useState<WeatherState>({
        status: 'idle',
        errorMessage: null,
        weatherInformation: null
    });

    const handleFetchWeather = useCallback(async () => {
        setWeatherState({
            status: "loading",
            weatherInformation: null,
            errorMessage: null,
        });

        try {
            const weatherInformation = await fetchWeather({
                latitude: location.latitude,
                longitude: location.longitude
            })

            setWeatherState({
                status: "success",
                weatherInformation,
                errorMessage: null,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : cannotGetUserLocationMessage;

            setWeatherState({
                status: "error",
                weatherInformation: null,
                errorMessage: message,
            });
        }
    }, [location.latitude, location.longitude]);

    useEffect(() => {
        handleFetchWeather();
    }, [handleFetchWeather]);

    if (weatherState.status === "loading") {
        return (
            <View style={styles.container}>
                <AppLoading title='Getting your location Weather...' />
            </View>
        );
    }

    if (weatherState.status === "error") {
        return (
            <View style={styles.container}>
                <AppLottie source={Animations.error} />

                <Text style={StatusStyles.statusText}>{weatherState.errorMessage}</Text>

                <AppButton style={StatusStyles.statusButton} onPress={handleFetchWeather}>Fetch Weather Again</AppButton>
            </View>
        );
    }

    const weatherInformation = weatherState.weatherInformation;
    if (weatherState.status === "success" && weatherInformation) {
        return (
            //TODO: App UI
            <View style={styles.container}>
                <Text style={StatusStyles.statusText}>{weatherInformation.city}</Text>
                <Text style={StatusStyles.statusText}>{weatherInformation.weather}</Text>
                <Text style={StatusStyles.statusText}>{weatherInformation.temp}</Text>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <AppLoading title='Preparing weather information...' />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.background,
        padding: Spacing.four,
    },
});
