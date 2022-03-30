import commonStyles from 'styles/commonStyles';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';

export default styles = {
    container: {
        flex: 1,
        backgroundColor: Colors.COLOR_WHITE,
    },
    inputText: {
        ...commonStyles.textMedium,
        margin: 0,
        padding: 0,
        textAlignVertical: 'top',
    },
    txtInputContainer: {
        borderRadius: Constants.CORNER_RADIUS * 2,
        paddingVertical: Constants.PADDING8,
        marginHorizontal: Constants.MARGIN16,
        marginTop: Constants.MARGIN16,
    },
    viewAddImage: {
        marginTop: Constants.MARGIN16,
    },
    titleChooseImage: {
        ...commonStyles.textBold,
        paddingHorizontal: Constants.PADDING16,
    },
    btnChooseImage: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Constants.CORNER_RADIUS * 2,
        borderColor: Colors.COLOR_GREY_94,
        borderWidth: 1,
        marginRight: Constants.MARGIN16,
        marginLeft: Constants.MARGIN8,
        padding: Constants.PADDING8,
    },
    viewItemImage: {
        width: 132,
        height: 132,
        borderRadius: Constants.CORNER_RADIUS,
        marginTop: Constants.MARGIN8,
        marginLeft: Constants.MARGIN8,
    },
    itemImage: {
        width: 132,
        height: 132,
        borderRadius: Constants.CORNER_RADIUS,
    },
    btnAction: {
        marginLeft: Constants.MARGIN16,
        flex: 1,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 48,
    },
    viewUser: {
        ...commonStyles.horizontal,
        paddingHorizontal: Constants.PADDING16,
    },
    properties: {
        marginLeft: Constants.MARGIN16,
    },
    namePrivacy: {
        ...commonStyles.textXSmall,
        marginLeft: Constants.MARGIN8,
    },
    privacy: {
        ...commonStyles.horizontal,
        backgroundColor: Colors.COLOR_BACKGROUND,
        paddingHorizontal: Constants.PADDING8,
        paddingVertical: Constants.PADDING - 2,
        borderWidth: 0.5,
        borderColor: Colors.COLOR_GREY_LIGHT,
        borderRadius: Constants.CORNER_RADIUS * 2,
        marginTop: Constants.MARGIN,
    },
    viewButton: {
        ...commonStyles.horizontal,
        alignItems: 'center',
        marginVertical: Constants.MARGIN16,
    },
    btnRmImg: {
        backgroundColor: Colors.COLOR_WHITE,
        position: 'absolute',
        right: 8,
        top: 8,
    },
};
