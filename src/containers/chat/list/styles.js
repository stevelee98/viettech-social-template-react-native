import React from 'react-native';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import { Fonts } from 'values/fonts';
const { Dimensions, Platform } = React;
const { StyleSheet } = React;
const window = Dimensions.get('window');

export default {
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: Colors.COLOR_BACKGROUND,
    },
    header: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: Colors.COLOR_PRIMARY,
        paddingLeft: Constants.PADDING16,
        borderBottomWidth: 0,
    },
    title: {
        color: 'white',
    },
    input: {
        height: '100%',
        textAlignVertical: 'bottom',
        marginHorizontal: -5,
    },
    item: {
        alignItems: 'center',
        marginVertical: Constants.PADDING16,
        paddingHorizontal: Constants.PADDING8,
    },
    name: {
        fontSize: Fonts.FONT14,
        margin: 0,
    },
    price: {
        fontSize: Fonts.FONT_SIZE_X_LARGE,
        color: Colors.COLOR_PRIMARY,
        margin: 0,
    },
    checkBox: {
        backgroundColor: Colors.COLOR_WHITE,
        borderWidth: 0,
        padding: 0,
    },
    listPriceContainer: {
        flex: 1,
        paddingHorizontal: Constants.PADDING16,
        backgroundColor: Colors.COLOR_WHITE,
        padding: Constants.PADDING16 * 2,
    },
};
