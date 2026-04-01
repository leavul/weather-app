import { Colors, Radius, Spacing } from "@/src/constants/theme";
import { StyleSheet } from "react-native";

export const StatusStyles = StyleSheet.create({
    errorIconContainer: {
        width: 128,
        height: 128,
        borderRadius: Radius.full,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center'
    },

    statusText: {
        marginTop: Spacing.four,
        fontSize: 16,
        color: Colors.text,
        textAlign: "center",
    },

    statusButton: {
        marginTop: Spacing.five
    },
} as const);