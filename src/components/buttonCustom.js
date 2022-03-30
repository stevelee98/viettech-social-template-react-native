import { Image, Pressable, StyleSheet, Text } from 'react-native';
import commonStyles from 'styles/commonStyles';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';

const ButtonCustom = ({
    title,
    onPress,
    leftIcon,
    rightIcon,
    styleTitle,
    style,
    noShadow = true,
    leftIconStyle,
    disabled = false,
}) => {
    return (
        <Pressable
            disabled={disabled}
            onPress={onPress}
            style={[
                !noShadow && {
                    ...commonStyles.shadowOffset,
                },
                styles.container,
                style,
            ]}
            android_ripple={Constants.ANDROID_RIPPLE}
        >
            {!Utils.isNull(leftIcon) && (
                <Image source={leftIcon} style={leftIconStyle} />
            )}
            {!Utils.isNull(title) && (
                <Text
                    style={[
                        commonStyles.textBold,
                        { color: Colors.COLOR_WHITE },
                        styleTitle,
                    ]}
                >
                    {title}
                </Text>
            )}
            {!Utils.isNull(rightIcon) && <Image source={rightIcon} />}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.COLOR_PRIMARY,
        borderRadius: Constants.CORNER_RADIUS * 2,
        paddingVertical: Constants.PADDING12,
        alignItems: 'center',
    },
});

export default ButtonCustom;
