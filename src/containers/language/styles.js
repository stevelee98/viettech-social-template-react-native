import React from 'react-native';
import commonStyles from 'styles/commonStyles';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
const { Dimensions, Platform } = React;
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const { StyleSheet } = React;

export default styles = {
    container: {
        backgroundColor: Colors.COLOR_WHITE,
        height: null,
        alignSelf: 'flex-end',
    },
    close: {
        padding: Constants.PADDING8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    unActive: {
        margin: Constants.MARGIN16,
        marginTop: 0,
        marginBottom: Constants.MARGIN8,
        padding: Constants.PADDING12,
        borderWidth: Constants.BORDER_WIDTH,
        borderRadius: Constants.CORNER_RADIUS,
        backgroundColor: Colors.COLOR_GREY,
        borderColor: Colors.COLOR_TRANSPARENT,
    },
    active: {
        margin: Constants.MARGIN16,
        marginTop: 0,
        marginBottom: Constants.MARGIN8,
        padding: Constants.PADDING12,
        borderWidth: Constants.BORDER_WIDTH,
        borderRadius: Constants.CORNER_RADIUS,
        backgroundColor: Colors.COLOR_GREEN_OPACITY,
        borderColor: Colors.COLOR_PRIMARY,
    },
    textUnActive: {
        ...commonStyles.textMediumBold,
    },
    textActive: {
        ...commonStyles.textMediumBold,
        color: Colors.COLOR_PRIMARY
    }
};
