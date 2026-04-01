import { FormattedWeather, WeatherApiResponse } from "@/src/types/weather";

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

function isWeatherApiResponse(data: unknown): data is WeatherApiResponse {
    if (!data || typeof data !== "object") {
        return false;
    }

    const weatherData = data as Partial<WeatherApiResponse>;

    return (
        Array.isArray(weatherData.weather) &&
        weatherData.weather.length > 0 &&
        typeof weatherData.weather[0]?.main === "string" &&
        typeof weatherData.main?.temp === "number" &&
        typeof weatherData.name === "string"
    );
}

export async function fetchWeather({
    latitude,
    longitude
}: {
    latitude: number,
    longitude: number
}): Promise<FormattedWeather> {
    if (!API_KEY) {
        throw new Error("Missing weather API key.");
    }

    const apiUrl = `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

    let response: Response;

    // TODO: Handle errors (network, API, unknown) and show proper messages to the user
    try {
        response = await fetch(apiUrl);
    } catch (error) {
        throw new Error("Unable to reach weather service.");
    }

    if (!response.ok) {
        throw new Error(`Weather request failed with status ${response.status}.`);
    }

    const data: unknown = await response.json();

    if (!isWeatherApiResponse(data)) {
        throw new Error("Unexpected weather response shape.");
    }

    return {
        weather: data.weather[0].main,
        temp: data.main.temp,
        city: data.name,
    };
}
