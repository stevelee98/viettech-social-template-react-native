import commonStyles from 'styles/commonStyles';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';

export default styles = {
    container: {
        width: null,
        height: null,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: Colors.COLOR_WHITE,
    },
    chooseView: {
        ...commonStyles.viewCenter,
        height: Constants.MAX_HEIGHT / 3,
        opacity: 0.2,
    },
    desView: {
        ...commonStyles.viewHorizontal,
        alignItems: 'flex-start',
    },
    checkBox: {
        ...commonStyles.viewCenter,
        width: 18,
        height: 18,
        borderWidth: 1,
        borderRadius: 9,
        borderColor: Colors.COLOR_PRIMARY,
        marginRight: Constants.MARGIN_X_LARGE,
    },
    boxTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Constants.PADDING_LARGE,
    },
    title: {
        ...commonStyles.text,
    },
};
