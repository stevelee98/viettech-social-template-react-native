import React from 'react-native';
import commonStyles from 'styles/commonStyles';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
const { Dimensions, Platform, StyleSheet } = React;
const window = Dimensions.get('window');

export default styles = {
    container: {
        width: null,
        height: null,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: Colors.COLOR_WHITE,
    },
    txtNameUser: {
        ...commonStyles.textBold,
    },
    txtAsk: {
        ...commonStyles.textXLarge,
    },
    inputText: {
        ...commonStyles.text,
        margin: 0,
        padding: 0,
        textAlignVertical: 'top',
        maxHeight: Constants.MAX_HEIGHT * 0.6,
    },
    txtInputContainer: {
        borderRadius: Constants.CORNER_RADIUS * 2,
        paddingVertical: Constants.PADDING8,
        marginHorizontal: Constants.MARGIN16,
        marginTop: Constants.MARGIN16,
    },
    imagePlace: {
        width: Constants.MAX_WIDTH / 3,
        height: Constants.MAX_WIDTH / 3,
        borderRadius: Constants.CORNER_RADIUS * 3,
        opacity: 0.7,
    },
    imagePlaceView: {
        width: Constants.MAX_WIDTH / 3,
        height: Constants.MAX_WIDTH / 3,
        borderRadius: Constants.CORNER_RADIUS * 3,
        marginHorizontal: Constants.MARGIN8,
        backgroundColor: Colors.COLOR_BLACK,
    },
    txtNamePlace: {
        ...commonStyles.textMediumBold,
        color: Colors.COLOR_WHITE,
        marginHorizontal: Constants.MARGIN16,
    },
    viewNamePlace: {
        position: 'absolute',
        flex: 1,
        bottom: Constants.MARGIN8,
    },
    btnChoosePlace: {
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    txtChoosePlace: {
        ...commonStyles.textBold,
        marginRight: Constants.MARGIN16,
    },
    viewChoosePlace: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    viewTitleChoosePlace: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    txtChooseOther: {
        ...commonStyles.textXSmall,
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
        width: Constants.MAX_WIDTH / 4,
        height: Constants.MAX_WIDTH / 4,
        borderRadius: Constants.CORNER_RADIUS * 2,
        borderStyle: 'dashed',
        borderColor: Colors.COLOR_GREY_94,
        borderWidth: 2,
        marginTop: Constants.MARGIN8,
        marginLeft: Constants.MARGIN16,
    },
    viewItemImage: {
        width: Constants.MAX_WIDTH / 4,
        height: Constants.MAX_WIDTH / 4,
        borderRadius: Constants.CORNER_RADIUS * 2,
        marginTop: Constants.MARGIN8,
        marginLeft: Constants.MARGIN16,
    },
    itemImage: {
        width: Constants.MAX_WIDTH / 4,
        height: Constants.MAX_WIDTH / 4,
        borderRadius: Constants.CORNER_RADIUS * 2,
    },
    btnTagPlace: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: Constants.CORNER_RADIUS * 2,
        borderStyle: 'dashed',
        borderColor: Colors.COLOR_GREY_94,
        borderWidth: 2,
        marginTop: Constants.MARGIN8,
        paddingVertical: Constants.PADDING8,
        marginHorizontal: Constants.MARGIN16,
    },
    placeTag: {
        marginTop: Constants.MARGIN8,
        borderRadius: Constants.CORNER_RADIUS,
        padding: Constants.PADDING8,
        flexGrow: 1,
        backgroundColor: Colors.COLOR_BACKGROUND,
        flexDirection: 'row',
        alignItems: 'center',
    },
    imgTag: {
        width: 50,
        height: 50,
        borderRadius: Constants.CORNER_RADIUS,
    },
    tagInfo: { flexGrow: 1, marginLeft: Constants.MARGIN16 },
    subTag: {
        ...commonStyles.textXSmall,
        color: Colors.COLOR_DRK_GREY,
        marginTop: 4,
    },
    btnRmImg: {
        position: 'absolute',
        top: 8,
        right: 8,
        borderRadius: Constants.CORNER_RADIUS,
        backgroundColor: Colors.COLOR_WHITE_OPACITY_50,
    },
    modalUpload: {
        flexGrow: 1,
        margin: 0,
        alignItems: 'center',
        justifyContent: 'center',
        width: Constants.MAX_WIDTH,
    },
    uploadContainer: {
        alignItems: 'center',
        backgroundColor: Colors.COLOR_WHITE,
        borderRadius: Constants.CORNER_RADIUS,
        width: Constants.MAX_WIDTH / 1.5,
        maxHeight: Constants.MAX_HEIGHT * 0.8,
        paddingVertical: Constants.paddingXXLarge,
        paddingHorizontal: Constants.paddingXXLarge,
    },
    txtUploading: { marginTop: Constants.MARGIN16 },
    btnAction: {
        marginHorizontal: Constants.MARGIN_X_LARGE,
        marginBottom: Constants.MARGIN_X_LARGE,
    },
    btnBorder: { borderWidth: 1, borderColor: Colors.COLOR_BLUE },
};
