import React from 'react-native';
import commonStyles from 'styles/commonStyles';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import { Fonts } from 'values/fonts';

const { StyleSheet } = React;

export default {
    container: {
        width: null,
        height: null,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    buttonLogin: {
        marginBottom: 15,
        backgroundColor: Colors.COLOR_PRIMARY,
        borderRadius: Constants.CORNER_RADIUS,
        paddingTop: Constants.PADDING8,
        paddingBottom: Constants.PADDING8,
    },
    inputLogin: {
        marginLeft: Constants.MARGIN36,
        marginRight: Constants.MARGIN36,
        marginBottom: Constants.MARGIN8,
    },
    staticComponent: {
        marginBottom: Constants.MARGIN16 * 2,
    },
    images: {
        marginLeft: 8,
        marginRight: 8,
        marginTop: 8,
        marginBottom: 2,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
    },
    textForgotPass: {
        fontSize: Fonts.FONT_SIZE_XX_SMALL,
        textAlign: 'right',
        padding: Constants.PADDING,
        margin: 0,
    },
    viewInputPass: {
        justifyContent: 'center',
        position: 'relative',
    },
    buttonViewPass: {
        position: 'absolute',
        right: Constants.PADDING8 * 3,
        justifyContent: 'center',
        opacity: 0.5,
    },
    viewForgotPass: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: Constants.MARGIN16 - Constants.MARGIN,
    },
    viewSplit: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: Constants.PADDING,
        marginHorizontal: Constants.MARGIN16,
        marginVertical: Constants.MARGIN_XX_LARGE,
    },
    line: {
        backgroundColor: Colors.COLOR_BLACK_OPACITY_50,
        width: (Constants.MAX_WIDTH - Constants.MARGIN_XX_LARGE - 100) / 2,
        height: 1,
    },
    viewLoginSocial: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: Constants.MARGIN16,
    },
    buttonSocial: {
        ...commonStyles.shadowOffset,
        backgroundColor: Colors.COLOR_WHITE,
        flexDirection: 'row',
        borderRadius: Constants.CORNER_RADIUS,
        padding: Constants.PADDING8,
        alignItems: 'center',
        justifyContent: 'center',
        width: Constants.MAX_WIDTH - Constants.MARGIN_XX_LARGE,
    },
    buttonRegister: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    textSocial: {
        ...commonStyles.textBold,
        color: Colors.COLOR_BLACK,
        marginLeft: Constants.MARGIN16,
    },

    title: {
        ...commonStyles.textBold,
        fontSize: Fonts.FONT_SIZE_XX_LARGE,
        color: Colors.COLOR_PRIMARY,
        marginHorizontal: Constants.MARGIN16,
    },
    top: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: Constants.PADDING16
    },
    btnTerm: {
        marginBottom: Constants.MARGIN8,
        alignSelf: 'center',
    },
};
