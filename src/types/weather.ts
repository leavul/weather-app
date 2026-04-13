export type FormattedWeather = {
    weatherCondition: string,
    temperature: number,
    city: string,
    sunrise: number,
    sunset: number,
};

export type WeatherApiResponse = {
    weather: {
        main: string;
    }[];
    main: {
        temp: number;
    };
    sys: {
        sunrise: number;
        sunset: number;
    };
    name: string;
};

export function isValidWeatherResponse(data: unknown): data is WeatherApiResponse {
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
