import React, { useEffect, useRef, useState } from 'react';
import {
    Image,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';
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
    containerStyle,
    noShadow = true,
    hideWhenShowKeyboard = false,
    leftIconStyle,
    androidRipple,
    disabled,
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const keyboardShowListener = useRef(null);
    const keyboardHideListener = useRef(null);

    useEffect(() => {
        keyboardShowListener.current = Keyboard.addListener(
            'keyboardDidShow',
            () => hideWhenShowKeyboard && setIsOpen(false),
        );
        keyboardHideListener.current = Keyboard.addListener(
            'keyboardDidHide',
            () => hideWhenShowKeyboard && setIsOpen(true),
        );

        return () => {
            keyboardShowListener.current.remove();
            keyboardHideListener.current.remove();
        };
    });

    return (
        isOpen && (
            <View style={(styles.container, containerStyle)}>
                <Pressable
                    disabled={disabled}
                    onPress={onPress}
                    style={[
                        commonStyles.buttonStyle,
                        !noShadow && { ...commonStyles.shadowOffset },
                        style,
                    ]}
                    android_ripple={{
                        color: Colors.COLOR_WHITE,
                        borderLess: false,
                        // radius: 100,
                        ...androidRipple,
                    }}
                >
                    {!Utils.isNull(leftIcon) && (
                        <Image source={leftIcon} style={leftIconStyle} />
                    )}
                    {!Utils.isNull(title) && (
                        <Text
                            style={[
                                commonStyles.textMedium,
                                { color: Colors.COLOR_WHITE },
                                styleTitle,
                            ]}
                        >
                            {title}
                        </Text>
                    )}
                    {!Utils.isNull(rightIcon) && <Image source={rightIcon} />}
                </Pressable>
            </View>
        )
    );
};

const styles = StyleSheet.create({
    container: {
        ...commonStyles.touchInputSpecial,
        backgroundColor: Colors.COLOR_TRANSPARENT,
        borderRadius: Constants.CORNER_RADIUS * 2,
    },
});

export default ButtonCustom;
