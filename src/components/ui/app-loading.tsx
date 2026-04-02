import AppLottie from '@/src/components/ui/app-lottie';
import AppText from '@/src/components/ui/app-text';
import { Animations } from '@/src/constants/animations';
import { StatusStyles } from '@/src/styles/status-styles';

type AppLoadingProps = {
    title?: string
}
export default function AppLoading({ title }: AppLoadingProps) {
    return (
        <>
            <AppLottie source={Animations.loading} />

            {title && <AppText style={StatusStyles.statusText}>{title}</AppText>}
        </>
    )
}