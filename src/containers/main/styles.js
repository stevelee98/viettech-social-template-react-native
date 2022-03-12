import React from "react-native";
import { Constants } from 'values/constants';
import { Colors } from 'values/colors';
import commonStyles from "styles/commonStyles";

export default styles = {
    post: {
        ...commonStyles.shadowOffset,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.COLOR_PRIMARY,
        borderRadius: 25,
        width: 50,
        height: 50
    },
    txtBadgeCount: {
        color: 'white', fontSize: Fonts.FONT_SIZE_XX_SMALL,
        position: 'absolute', right: -4, top: -4, paddingHorizontal: 5,
        backgroundColor: 'red',
        textAlign: 'center',
        borderRadius: Constants.CORNER_RADIUS * 6
    }
};
