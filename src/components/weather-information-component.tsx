import { fetchWeather } from '@/src/api/weatherApi';
import AppButton from '@/src/components/ui/app-button';
import { Colors, Spacing } from '@/src/constants/theme';
import { StatusStyles } from '@/src/styles/status-styles';
import { FormattedWeather } from '@/src/types/weather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const cannotGetUserLocationMessage = 'We were unable to retrieve weather information for your location. Please try again.';

type WeatherStatus = "idle" | "loading" | "success" | "error";

type WeatherState = {
    status: WeatherStatus;
    weatherInformation: FormattedWeather | null
    errorMessage: string | null;
}

type WeatherInformationComponentProps = {
    location: {
        latitude: number;
        longitude: number;
    }
}
export default function WeatherInformationComponent({ location }: WeatherInformationComponentProps) {
    const [weatherState, setWeatherState] = useState<WeatherState>({
        status: 'idle',
        errorMessage: null,
        weatherInformation: null
    });

    useEffect(() => {
        handleFetchWeather();
    }, [location.latitude, location.longitude])

    const handleFetchWeather = async () => {
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
    }

    if (weatherState.status === "loading") {
        return (
            <View style={[styles.container]}>
                <ActivityIndicator size="large" color={Colors.text} />
                <Text style={StatusStyles.statusText}>Getting your location Weather...</Text>
            </View>
        )
    }

    if (weatherState.status === "error") {
        return (
            <View style={styles.container}>
                <View style={StatusStyles.errorIconContainer}>
                    <MaterialCommunityIcons name="weather-cloudy-alert" size={64} color={Colors.warning} />
                </View>

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
            <ActivityIndicator size="large" color={Colors.text} />

            <Text style={StatusStyles.statusText}>Preparing weather information...</Text>
        </View>
    )
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