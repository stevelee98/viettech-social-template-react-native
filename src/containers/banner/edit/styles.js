import commonStyles from 'styles/commonStyles';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import { Fonts } from 'values/fonts';

export default {
    container: {
        width: null,
        height: null,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: Colors.COLOR_WHITE,
    },

    scrollContainer: {
        flex: 1,
    },

    scrollContentContainer: {
        flexGrow: 1,
    },

    btnAddImages: {
        ...commonStyles.viewCenter,
        borderRadius: Constants.CORNER_RADIUS,
        borderStyle: 'dashed',
        borderColor: Colors.COLOR_GREY_LIGHT,
        width: Constants.MAX_WIDTH - 32,
        height: (Constants.MAX_WIDTH * 9) / 16,
        borderWidth: Constants.BORDER_WIDTH + 1,
        marginHorizontal: Constants.MARGIN16,
    },

    btnAddDesktopImages: {
        ...commonStyles.viewCenter,
        borderRadius: Constants.CORNER_RADIUS,
        borderStyle: 'dashed',
        borderColor: Colors.COLOR_GREY_LIGHT,
        width: Constants.MAX_WIDTH - 32,
        height: (Constants.MAX_WIDTH * 5) / 16,
        borderWidth: Constants.BORDER_WIDTH + 1,
        marginHorizontal: Constants.MARGIN16,
    },

    containerChooseImages: {
        // margin: Constants.MARGIN16
    },

    imageSize: {
        width: Constants.MAX_WIDTH - 32,
        height: (Constants.MAX_WIDTH * 9) / 16,
        borderRadius: Constants.CORNER_RADIUS,
        borderStyle: 'dashed',
        borderColor: Colors.COLOR_GREY_LIGHT,
        position: 'relative',
    },

    imageDesktopSize: {
        width: Constants.MAX_WIDTH - 32,
        height: (Constants.MAX_WIDTH * 5) / 16,
        borderRadius: Constants.CORNER_RADIUS,
        borderStyle: 'dashed',
        borderColor: Colors.COLOR_GREY_LIGHT,
        position: 'relative',
    },

    titleChooseImages: {
        ...commonStyles.textMedium,
        color: Colors.COLOR_TEXT_LIGHT,
        marginTop: Constants.MARGIN16 - Constants.MARGIN,
        marginHorizontal: Constants.MARGIN16,
    },
    titleInfoBox: {
        flexDirection: 'row',
        marginBottom: Constants.MARGIN12,
        alignItems: 'center',
    },
    infoTitle: {
        ...commonStyles.textMedium,
        flex: 1,
        color: Colors.COLOR_TEXT_LIGHT,
    },
    txtAction: {
        ...commonStyles.text,
        flex: 1,
    },
    actionTitle: {
        ...commonStyles.textMedium,
        color: Colors.COLOR_TEXT_LIGHT,
        padding: Constants.PADDING8,
    },
    btnPost: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    validateImages: {
        ...commonStyles.text,
        fontSize: Fonts.FONT_SIZE_X_SMALL,
        color: Colors.COLOR_RED,
        marginHorizontal: Constants.MARGIN16,
    },
    checkBox: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        margin: 0,
        padding: 0,
        flex: 0.15,
    },
    actionBox: {
        marginVertical: Constants.MARGIN16,
        marginHorizontal: Constants.MARGIN16,
        borderRadius: Constants.CORNER_RADIUS,
        borderWidth: Constants.BORDER_WIDTH,
        borderColor: Colors.COLOR_BACKGROUND,
    },
    infoBox: {
        marginTop: Constants.MARGIN12 * 2,
        paddingVertical: Constants.MARGIN16,
        marginHorizontal: Constants.MARGIN16,
        borderTopWidth: Constants.BORDER_WIDTH,
        borderColor: Colors.COLOR_BACKGROUND,
    },
    txtTitleBanner: {
        ...commonStyles.textMedium,
        marginHorizontal: Constants.MARGIN16,
        marginVertical: Constants.MARGIN12,
    },
    txtStatus: {
        ...commonStyles.textMedium,
        flex: 1,
        color: Colors.COLOR_BLUE_LIGHT,
    },
    txtActionType: {
        ...commonStyles.textMedium,
        flex: 1,
    },
    contentInput: {
        marginBottom: Constants.PADDING_XX_LARGE * 2,
        flex: 1,
    },
    sourceAtt: {
        type: 'resize',
        width: 500,
        // height: Constants.AVATAR_WIDTH_HEIGHT
    },
};
