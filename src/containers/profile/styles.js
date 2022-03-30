import commonStyles from 'styles/commonStyles';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
export default styles = {
    container: {
        flexGrow: 1,
    },
    coverImage: {
        width: Constants.MAX_WIDTH,
        height: (Constants.MAX_WIDTH * 9) / 16,
    },
    followerNum: {
        ...commonStyles.textMediumBold,
    },
    followerTxt: {
        ...commonStyles.textXSmall,
    },
    col: {
        alignItems: 'center',
    },
    subInfo: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: Constants.MARGIN8,
    },
    avatar: {
        width: 92,
        height: 92,
        borderRadius: 92,
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        elevation: 8,
    },
    userInfo: {
        ...commonStyles.horizontalCenter,
        marginTop: Constants.MARGIN24,
    },
    userName: {
        ...commonStyles.textMediumBold,
        flex: 1,
        textAlign: 'right',
    },
    userJob: {
        ...commonStyles.textMediumBold,
        flex: 1,
    },
    description: {
        ...commonStyles.textXSmall,
        color: Colors.COLOR_TEXT_LIGHT,
        textAlign: 'center',
        marginTop: Constants.MARGIN8,
        marginHorizontal: Constants.MARGIN48,
    },
    button: {
        ...commonStyles.horizontalCenter,
        marginVertical: Constants.MARGIN24,
        justifyContent: 'space-around',
        marginHorizontal: Constants.MARGIN24,
    },
    btnFollow: {
        backgroundColor: Colors.COLOR_BLUE,
        borderRadius: Constants.BORDER_RADIUS,
        padding: Constants.PADDING12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn: {
        backgroundColor: Colors.COLOR_BACKGROUND,
        borderRadius: Constants.BORDER_RADIUS,
        padding: Constants.PADDING12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    feed: {
        ...commonStyles.textXLargeBold,
        marginBottom: Constants.MARGIN8,
        marginLeft: Constants.MARGIN16,
    },
    header: {
        position: 'absolute',
        top: 56,
        left: 16,
    },
};
