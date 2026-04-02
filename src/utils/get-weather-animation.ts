import { Animations } from "../constants/animations";

// Method to get the weather animation file based on the weather condition and whether it is day or night
export function getWeatherAnimation(condition: string, sunrise: number, sunset: number): any {
    const currentTime = Date.now();
     // Determine if it's day or night based on the current time and the sunrise/sunset times
    const isDayTime = currentTime > sunrise && currentTime < sunset;

    const weatherCondition = condition.toLowerCase()

    // Switch case based on the weather condition to return the appropriate animation file
    switch (weatherCondition) {
        case 'clouds':
            return isDayTime ? Animations.cloudDay : Animations.cloudNight;

        case 'mist':
        case 'smoke':
        case 'haze':
        case 'dust':
        case 'fog':
        case 'sand':
        case 'ash':
        case 'squall':
        case 'tornado':
            return Animations.mist;

        case 'rain':
        case 'drizzle':
            return isDayTime ? Animations.rainDay : Animations.rainNight;

        case 'thunderstorm':
            return Animations.thunderstorm

        case 'snow':
            return Animations.snow

        default:
            return isDayTime ? Animations.clearDay : Animations.clearNight;
    }
}
