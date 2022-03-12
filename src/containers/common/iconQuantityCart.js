import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import * as cartActions from 'actions/cartActions';
import * as commonAction from 'actions/commonActions';
import * as orderActions from 'actions/orderActions';
import { ErrorCode } from 'config/errorCode';
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import commonStyles from 'styles/commonStyles';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';

class IconQuantityCart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quantity: 0,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
            this.handleData();
        }
    }

    componentDidMount() {
        this.setState({
            quantity: global.quantityCart,
        });
    }

    /// Handle data when request
    handleData() {
        let data = this.props.data;
        if (this.props.data == 0) {
            this.state.quantity = 0;
        } else if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                switch (this.props.action) {
                    case getActionSuccess(ActionEvent.GET_QUANTITY_CART):
                        console.log('GET_QUANTITY_CART', data);
                        if (!Utils.isNull(data)) {
                            this.state.quantity = data;
                            global.quantityCart = data;
                        } else {
                            this.state.quantity = 0;
                            global.quantityCart = 0;
                        }
                        break;

                    case getActionSuccess(ActionEvent.SAVE_CART):
                    case getActionSuccess(ActionEvent.ADD_TO_CART):
                    case getActionSuccess(ActionEvent.REMOVE_ITEM_CART):
                        this.props.getQuantityCart({
                            userId: global.user?.id,
                            tempUserId: global.deviceId,
                        });
                        break;
                    default:
                        break;
                }
            }
        } else if (
            this.props.action == ActionEvent.UPDATE_QUANTITY_CART_BADGE
        ) {
            console.log('UPDATE_QUANTITY_CART_BADGE', data);
            if (!Utils.isNull(data)) {
                this.state.quantity = data;
                global.quantityCart = data;
            } else {
                this.state.quantity = 0;
                global.quantityCart = 0;
            }
        }
    }

    render() {
        const { quantity } = this.state;
        return quantity > 0 ? (
            <View
                style={[
                    styles.container,
                    {
                        width: quantity >= 10 ? 24 : 18,
                    },
                ]}
            >
                <Text style={[commonStyles.textSmall, styles.quantityNumber]}>
                    {quantity >= 100 ? '99+' : quantity}
                </Text>
            </View>
        ) : null;
    }
}

const styles = {
    container: {
        ...commonStyles.viewCenter,
        position: 'absolute',
        top: -Constants.MARGIN,
        right: 0,
        height: 18,
        borderRadius: 9,
        backgroundColor: Colors.COLOR_RED,
        borderWidth: Constants.BORDER_WIDTH,
        borderColor: Colors.COLOR_WHITE,
    },
    quantityNumber: {
        color: Colors.COLOR_WHITE,
        padding: 0,
        margin: 0,
    },
};

const mapStateToProps = state => ({
    data: state.iconQuantityCart.data,
    isLoading: state.iconQuantityCart.isLoading,
    error: state.iconQuantityCart.error,
    errorCode: state.iconQuantityCart.errorCode,
    action: state.iconQuantityCart.action,
});

const mapDispatchToProps = {
    ...orderActions,
    ...commonAction,
    ...cartActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(IconQuantityCart);
