import { Colors } from 'values/colors';
import { Constants } from 'values/constants';

export default styles = {
    container: {
        width: null,
        height: null,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: Colors.COLOR_BACKGROUND,
    },
    main: {
        backgroundColor: Colors.COLOR_WHITE,
        borderRadius: Constants.BORDER_RADIUS / 3,
        marginHorizontal: Constants.MARGIN16,
        marginVertical: Constants.MARGIN8,
    },
    textStatus: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Constants.MARGIN12,
        backgroundColor: Colors.COLOR_TEXT_LIGHT,
        borderBottomRightRadius: Constants.CORNER_RADIUS,
        borderBottomLeftRadius: Constants.CORNER_RADIUS,
    },
    imageBanner: {
        borderRadius: Constants.CORNER_RADIUS,
    },
    buttonCreate: {
        position: 'absolute',
        bottom: Constants.MARGIN16,
        right: Constants.MARGIN16,
        backgroundColor: Colors.COLOR_PRIMARY,
        padding: Constants.PADDING16,
        borderRadius: Constants.BORDER_RADIUS,
    },
};
