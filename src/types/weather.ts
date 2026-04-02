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
