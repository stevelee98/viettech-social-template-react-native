import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import { Fonts } from 'values/fonts';

export default {
    text: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT14,
    },
    textBold: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT14,
        fontWeight: '500',
    },
    textMedium: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT16,
    },
    textMediumBold: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT16,
        fontWeight: '500',
    },
    textLarge: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT18,
    },
    textLargeBold: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT18,
        fontWeight: '500',
    },
    textXLarge: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT20,
    },
    textXLargeBold: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT20,
        fontWeight: '500',
    },
    textXXLarge: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT24,
    },
    textXXLargeBold: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT24,
        fontWeight: '700',
    },
    textXSmall: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT12,
    },
    textXSmallBold: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT12,
        fontWeight: '500',
    },
    textSmall: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT10,
    },
    textSmallBold: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT10,
        fontWeight: '500',
    },
    shadowOffset: {
        elevation: Constants.ELEVATION,
        shadowOffset: {
            width: Constants.SHADOW_OFFSET_WIDTH,
            height: Constants.SHADOW_OFFSET_HEIGHT,
        },
        shadowOpacity: Constants.SHADOW_OPACITY,
        shadowColor: Colors.COLOR_BLACK_OPACITY_50,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    horizontal: { flexDirection: 'row', alignItems: 'center' },
    horizontalCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    horizontalBetween: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
};
