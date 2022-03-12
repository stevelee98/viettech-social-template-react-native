import PropTypes from 'prop-types';
import React from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';

Loading.propTypes = {
    visible: PropTypes.bool,
    absolute: PropTypes.bool,
};

Loading.defaultProps = {
    visible: false,
    absolute: true,
};

const screen = Dimensions.get('screen');
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0, 0, 0, .3)',
    },
    viewNormal: {
        position: 'absolute',
        top: screen.height / 2 - 50,
        left: screen.width / 2 - 4,
        elevation: 8,
    },
});

export default function Loading(props) {
    const { visible, absolute } = props;

    const renderContent = () => {
        return (
            <View
                style={{
                    width: Constants.MAX_WIDTH,
                    height: Constants.MAX_HEIGHT,
                    flex: 1,
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...(absolute ? StyleSheet.absoluteFill : {}),
                    ...(absolute ? {} : styles.container),
                }}
            >
                <ActivityIndicator color={Colors.COLOR_PRIMARY} />
            </View>
        );
    };

    if (!visible) return <></>;
    if (absolute) return visible && renderContent();
    return (
        <View style={styles.viewNormal}>
            <ActivityIndicator color={Colors.COLOR_PRIMARY} />
        </View>
    );
}
