import LottieView, { LottieViewProps } from "lottie-react-native";

export default function AppLottie({ source, style, ...otherProps }: LottieViewProps) {
    return (
        <LottieView
            source={source}
            style={[{ width: "100%", height: "50%" }, style]}
            autoPlay
            loop
            {...otherProps}
        />
    )
}