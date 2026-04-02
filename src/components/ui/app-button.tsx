import { Colors, Radius, Spacing } from '@/src/constants/theme'
import { Pressable, PressableProps, StyleSheet } from 'react-native'
import AppText from './app-text'

export default function AppButton({ style, children, ...otherProps }: PressableProps) {
    return (
        <Pressable
            style={(state) => [
                styles.container,
                state.pressed && styles.pressed,
                typeof style === 'function' ? style(state) : style,
            ]}
            {...otherProps}
        >
            {typeof children === 'string' ? (
                <AppText style={styles.textChildren}>{children}</AppText>
            ) : (
                children
            )}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingVertical: Spacing.three,
        paddingHorizontal: Spacing.four,
        backgroundColor: Colors.surface,
        borderRadius: Radius.md
    },

    pressed: {
        opacity: 0.75,
    },

    textChildren: {
        fontSize: 22,
        letterSpacing: 1.5,
        color: Colors.text,
        textAlign: 'center'
    }
})