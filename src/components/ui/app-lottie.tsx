import LottieView from "lottie-react-native";

type AppLottieProps = {
    source: any
}
export default function AppLottie({ source }: AppLottieProps) {
    return (
        <LottieView
            source={source}
            style={{ width: "100%", height: "50%" }}
            autoPlay
            loop
        />
    )
}