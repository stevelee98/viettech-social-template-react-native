import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import { Colors } from 'values/colors';

const Hr = props => {
    const {
        style,
        height = 1,
        width = '100%',
        color = Colors.COLOR_BACKGROUND,
    } = props;
    return (
        <View
            style={[
                {
                    backgroundColor: color,
                    height: height,
                    width: width,
                },
                style,
            ]}
        />
    );
};
export default Hr;

Hr.propTypes = {
    height: PropTypes.number,
    color: PropTypes.string,
};
