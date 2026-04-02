import { FormattedWeather, WeatherApiResponse } from "@/src/types/weather";

const BASE_URL = "https://api.openweathermap.org/data/2.5";
// TODO: Move this API call behind a backend/serverless route so the weather API key is not exposed in the client bundle.
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
        typeof weatherData.sys?.sunrise === "number" &&
        typeof weatherData.sys?.sunset === "number" &&
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

    const apiUrl = `${BASE_URL}/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;

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
        weatherCondition: data.weather[0].main,
        temperature: data.main.temp,
        city: data.name,
        sunrise: data.sys.sunrise * 1000,
        sunset: data.sys.sunset * 1000,
    };
}
