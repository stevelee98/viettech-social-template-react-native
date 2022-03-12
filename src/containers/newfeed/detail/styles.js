import commonStyles from 'styles/commonStyles';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';

const AVATAR_SIZE = 36;
const AVATAR_BORDER = AVATAR_SIZE / 2;

export default styles = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: Colors.COLOR_BACKGROUND,
    },
    author: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginHorizontal: Constants.MARGIN16,
    },
    timeCreate: {
        ...commonStyles.textXSmall,
    },
    avatar: {
        borderRadius: AVATAR_SIZE,
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
    },
    infoView: {
        marginHorizontal: Constants.MARGIN8 + Constants.MARGIN,
        marginBottom: Constants.MARGIN8 + Constants.MARGIN,
    },
    poster: {
        ...commonStyles.viewHorizontal,
        alignItems: 'flex-start',
        paddingRight: Constants.PADDING,
    },
    avatarPoster: {
        width: AVATAR_SIZE,
        height: AVATAR_SIZE,
        borderRadius: AVATAR_BORDER,
        position: 'relative',
        marginRight: Constants.MARGIN,
        marginTop: Constants.MARGIN,
    },
    icon: {
        marginRight: Constants.MARGIN,
    },
    boxDesPoster: {
        ...commonStyles.viewHorizontal,
        alignItems: 'flex-start',
        marginVertical: Constants.MARGIN,
    },
    textMenu: {
        ...commonStyles.text,
        flex: 1,
    },
    commentDock: {
        elevation: Constants.ELEVATION,
        shadowOffset: {
            width: Constants.SHADOW_OFFSET_WIDTH,
            height: Constants.SHADOW_OFFSET_HEIGHT,
        },
        shadowOpacity: Constants.SHADOW_OPACITY,
        shadowColor: Colors.COLOR_GREY_LIGHT,
        flexDirection: 'column',
        backgroundColor: Colors.COLOR_WHITE,
        padding: Constants.PADDING,
        height: 160,
        borderTopWidth: Constants.DIVIDE_HEIGHT_SMALL,
        borderTopColor: Colors.COLOR_GREY,
    },
    authorInfo: {
        marginLeft: Constants.MARGIN8,
        flex: 1,
        justifyContent: 'center',
    },
    content: {
        paddingHorizontal: Constants.PADDING8,
        marginVertical: Constants.MARGIN8,
    },
    btnMenu: {
        padding: Constants.MARGIN,
        marginRight: -Constants.MARGIN,
    },
    contentStyles: {
        flexGrow: 1,
        paddingVertical: Constants.PADDING8,
    },
    itemContainer: {
        marginTop: Constants.MARGIN8,
        backgroundColor: Colors.COLOR_WHITE,
        width: Constants.MAX_WIDTH,
    },
    btnContainer: {
        flexDirection: 'row',
        flex: 1,
    },
    btnComment: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1.5,
        justifyContent: 'center',
        paddingVertical: Constants.PADDING8,
    },
    txtComment: { ...commonStyles.textXSmall, marginLeft: 8, marginTop: 4 },
    txtLike: { ...commonStyles.textXSmall, marginLeft: 8, marginTop: 4 },
    btnLike: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1.5,
        justifyContent: 'center',
        paddingVertical: Constants.PADDING8,
    },
    btnShare: {
        alignItems: 'center',
        flex: 1,
        paddingVertical: Constants.PADDING8,
    },
};
