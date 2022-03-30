import commonStyles from 'styles/commonStyles';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import { Fonts } from 'values/fonts';

export default styles = {
    container: {
        width: null,
        height: null,
        flex: 1,
        flexGrowth: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: Colors.COLOR_BACKGROUND,
    },
    textInput: {
        ...commonStyles.text,
        color: Colors.COLOR_WHITE,
    },
    main: {
        backgroundColor: Colors.COLOR_WHITE,
        borderBottomColor: Colors.COLOR_BACKGROUND,
        borderBottomWidth: 1,
        paddingVertical: Constants.PADDING8,
        paddingHorizontal: Constants.PADDING16,
        marginVertical: Constants.MARGIN8,
    },
    commentDock: {
        elevation: Constants.ELEVATION,
        shadowOffset: {
            width: Constants.SHADOW_OFFSET_WIDTH,
            height: Constants.SHADOW_OFFSET_HEIGHT,
        },
        shadowOpacity: Constants.SHADOW_OPACITY,
        shadowColor: Colors.COLOR_GREY_LIGHT,
        width: Constants.MAX_WIDTH,
        flexDirection: 'column',
        backgroundColor: Colors.COLOR_WHITE,
        padding: Constants.PADDING,
        height: 160,
    },
    contentCommentStyles: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flexDirection: 'row',
    },
    avatarBtn: {
        borderRadius: Constants.BORDER_RADIUS,
    },
    avatarComment: {
        borderRadius: Constants.BORDER_RADIUS,
    },
    commentContent: {
        backgroundColor: Colors.COLOR_BACKGROUND,
        borderRadius: Constants.CORNER_RADIUS * 3,
        paddingVertical: Constants.PADDING8,
        paddingHorizontal: Constants.PADDING16,
    },
    txtTimeComment: {
        ...commonStyles.textXSmall,
        fontSize: Fonts.FONT12,
        color: Colors.COLOR_DRK_GREY,
        margin: Constants.MARGIN,
        marginLeft: Constants.MARGIN12,
    },
    bottomComment: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    contentView: {
        flex: 1,
        justifyContent: 'flex-start',
        marginLeft: Constants.MARGIN8,
    },
    contentChildView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentContentChild: {
        borderRadius: Constants.CORNER_RADIUS * 3,
        paddingHorizontal: Constants.PADDING12,
    },
    avatarCommentChild: {
        width: Constants.AVATAR_CHILD_COMMENT,
        height: Constants.AVATAR_CHILD_COMMENT,
        borderRadius: Constants.BORDER_RADIUS,
    },
    txtChildComment: {
        ...commonStyles.textXSmall,
        flex: 1,
        marginLeft: Constants.MARGIN8,
    },
    contentCommentChildStyles: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    authorChildComment: {
        ...commonStyles.textBold,
        fontSize: Fonts.FONT12,
        marginLeft: Constants.MARGIN8,
    },
    listCmt: {
        flex: 1,
    },
};
