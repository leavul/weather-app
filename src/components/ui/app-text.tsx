import { Fonts } from '@/src/constants/fonts'
import { StyleSheet, Text, TextProps } from 'react-native'

export default function AppText({ style, ...otherProps }: TextProps) {
    return <Text style={[styles.text, style]} {...otherProps} />
}

const styles = StyleSheet.create({
    text: {
        fontFamily: Fonts.BebasNeueRegular.name
    }
})