import { fetchWeather } from '@/src/api/weatherApi';
import AppButton from '@/src/components/ui/app-button';
import AppLoading from '@/src/components/ui/app-loading';
import AppLottie from '@/src/components/ui/app-lottie';
import AppText from '@/src/components/ui/app-text';
import { Animations } from '@/src/constants/animations';
import { Colors, Spacing } from '@/src/constants/theme';
import { StatusStyles } from '@/src/styles/status-styles';
import { FormattedWeather } from '@/src/types/weather';
import { getWeatherAnimation } from '@/src/utils/get-weather-animation';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
                    : 'Something went wrong. Please try again.';

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

                <AppText style={StatusStyles.statusText}>{weatherState.errorMessage}</AppText>

                <AppButton style={StatusStyles.statusButton} onPress={handleFetchWeather}>Fetch Weather Again</AppButton>
            </View>
        );
    }

    const weatherInformation = weatherState.weatherInformation;
    if (weatherState.status === "success" && weatherInformation) {
        const cityName = weatherInformation.city;
        const weatherCondition = weatherInformation.weatherCondition;
        const weatherAnimation = getWeatherAnimation(
            weatherCondition,
            weatherInformation.sunrise,
            weatherInformation.sunset
        );
        const temperature = Math.round(weatherInformation.temperature);
        return (
            <SafeAreaView style={styles.container}>
                <FontAwesome6 name="location-dot" size={20} color={Colors.muted} />
                <AppText style={[styles.text, styles.cityNameText]}>{cityName}</AppText>

                <View style={styles.weatherConditionContainer}>
                    <AppLottie source={weatherAnimation} />
                    <AppText style={[styles.text, styles.weatherCondition]}>{weatherCondition}</AppText>
                </View>

                <AppText style={[styles.text, styles.temperatureText]}>{temperature}°</AppText>
            </SafeAreaView>
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

    text: {
        color: Colors.muted,
        textAlign: "center",
    },
    cityNameText: {
        marginTop: Spacing.two,
        fontSize: 20,
        textTransform: "uppercase",
    },
    weatherConditionContainer: {
        flex: 1,
        width: '100%',
        justifyContent: "center",
    },
    weatherCondition: {
        fontSize: 28,
    },
    temperatureText: {
        fontSize: 52
    },
});
