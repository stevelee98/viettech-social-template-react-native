import commonStyles from 'styles/commonStyles';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';

export default {
    container: {
        width: null,
        height: null,
        flex: 1,
        backgroundColor: Colors.COLOR_WHITE,
    },
    circle: {
        width: Constants.MAX_WIDTH * 1.5,
        height: Constants.MAX_WIDTH * 1.5,
        borderRadius: Constants.MAX_WIDTH,
        position: 'absolute',
        backgroundColor: Colors.COLOR_PRIMARY_LIGHT,
        bottom: -Constants.MAX_WIDTH / 3,
        left: -50,
    },
    inputForm: {
        elevation: 12,
        padding: Constants.PADDING16,
        borderRadius: 16,
        backgroundColor: Colors.COLOR_WHITE,
        alignSelf: 'center',
        width: Constants.MAX_WIDTH - 88,
        flex: 1,
    },
    signUp: {
        ...commonStyles.textBold,
        color: Colors.COLOR_WHITE,
    },
    txtBottom: {
        ...commonStyles.text,
        color: Colors.COLOR_WHITE,
    },
    bottom: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        margin: Constants.MARGIN16,
    },
    top: {
        flex: 1.5,
        marginHorizontal: Constants.MARGIN24,
        marginBottom: Constants.MARGIN24,
    },
    welcome: {
        fontSize: 44,
        fontWeight: '700',
        color: 'black',
        marginTop: 100,
    },
    loginTxt: {
        fontSize: 44,
        fontWeight: '700',
        color: 'black',
    },
    input: {
        height: 42,
        margin: 12,
        borderWidth: 1,
        padding: 12,
        borderRadius: 12,
        borderColor: '#9D9D9D',
    },
    btn: {
        backgroundColor: Colors.COLOR_PRIMARY_LIGHT,
        paddingVertical: Constants.PADDING12,
        margin: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    forgetPass: {
        ...commonStyles.textBold,
        color: Colors.COLOR_PRIMARY_LIGHT,
        alignSelf: 'center',
        justifyContent: 'center',
    },
};
