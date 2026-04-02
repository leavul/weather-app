import { Animations } from '@/src/constants/animations';
import { StatusStyles } from '@/src/styles/status-styles';
import { Text } from 'react-native';
import AppLottie from './app-lottie';

type AppLoadingProps = {
    title?: string
}
export default function AppLoading({ title }: AppLoadingProps) {
    return (
        <>
            <AppLottie source={Animations.loading} />

            {title && <Text style={StatusStyles.statusText}>{title}</Text>}
        </>
    )
}