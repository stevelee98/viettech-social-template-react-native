import commonStyles from 'styles/commonStyles';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';

export default {
    container: {
        width: null,
        height: null,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: Colors.COLOR_BACKGROUND,
    },
    inputStatus: {
        ...commonStyles.shadowOffset,
        flex: 1,
        marginLeft: Constants.MARGIN16,
        borderRadius: Constants.BORDER_RADIUS,
        backgroundColor: Colors.COLOR_WHITE,
        padding: Constants.PADDING8,
    },
    avatarUser: {
        borderRadius: Constants.BORDER_RADIUS,
        width: Constants.AVATAR_SIZE,
        height: Constants.AVATAR_SIZE,
    },
    viewPostStatus: {
        backgroundColor: Colors.COLOR_WHITE,
        marginTop: Constants.MARGIN8,
        paddingHorizontal: Constants.MARGIN16,
        paddingVertical: Constants.MARGIN8,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Constants.MARGIN8,
    },
};
