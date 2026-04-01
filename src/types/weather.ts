export type FormattedWeather = {
    weather: string,
    temp: number,
    city: string,
};

export type WeatherApiResponse = {
    weather: {
        main: string;
    }[];
    main: {
        temp: number;
    };
    name: string;
};
