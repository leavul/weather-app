import { FormattedWeather, isValidWeatherResponse } from "@/src/types/weather";

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

if (__DEV__ && !API_KEY) {
    throw new Error("Missing weather API key.");
}

export async function fetchWeather({
    latitude,
    longitude
}: {
    latitude: number,
    longitude: number
}): Promise<FormattedWeather> {
    const fetchWeatherUrl = `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;

    let response: Response;

    try {
        response = await fetch(fetchWeatherUrl);
    } catch (error) {
        if (__DEV__) console.error("[fetchWeather] Unexpected fetch error:", error);
        if (error instanceof TypeError && error.message === "Network request failed") {
            throw new Error("No internet connection. Please check your network and try again.");
        }
        throw new Error("Unable to reach weather service.");
    }

    if (!response.ok) {
        if (__DEV__) console.error("[fetchWeather] Bad response:", response.status, response.statusText);
        switch (response.status) {
            // 401: invalid or missing API key
            // 500/503: OpenWeatherMap is down or having issues on their end
            case 401:
            case 500:
            case 503:
                throw new Error("Weather service is unavailable. Please try again later.");
            // 404: the coordinates didn't match any known location
            case 404:
                throw new Error("Could not find weather for your location.");
            // 429: free tier rate limit hit
            case 429:
                throw new Error("Too many requests. Please wait a moment and try again.");
            default:
                throw new Error("Something went wrong. Please try again.");
        }
    }

    let data: unknown;
    try {
        data = await response.json();
    } catch (error) {
        if (__DEV__) console.error("[fetchWeather] Failed to parse JSON:", error);
        throw new Error("Something went wrong. Please try again.");
    }

    if (!isValidWeatherResponse(data)) {
        if (__DEV__) console.error("[fetchWeather] Unexpected response shape:", data);
        throw new Error("Unexpected weather response shape. Please try again.");
    }

    return {
        weatherCondition: data.weather[0].main,
        temperature: data.main.temp,
        city: data.name,
        sunrise: data.sys.sunrise * 1000,
        sunset: data.sys.sunset * 1000,
    };
}
