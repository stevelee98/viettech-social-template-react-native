import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import * as userActions from 'actions/userActions';
import { ErrorCode } from 'config/errorCode';
import { Text } from 'native-base';
import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import { connect } from 'react-redux';
import commonStyles from 'styles/commonStyles';
import StorageUtil from 'utils/storageUtil';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';

class ChatUnseenIcon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            unseen: 0,
            user: {},
        };
        this.heightStatusBar =
            Platform.OS === 'ios' ? Constants.STATUS_BAR_HEIGHT : 10;
    }

    componentDidMount() {
        this.handleUnseen();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps != this.props) {
            this.handleData();
        }
    }

    /**
     * Handle data
     */
    handleData() {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                this.state.user = {};
                if (
                    this.props.action ==
                    getActionSuccess(ActionEvent.GET_USER_INFO)
                ) {
                    if (!Utils.isNull(data)) {
                        this.state.user = data;
                        this.handleMessageUnseen();
                    }
                } else if (
                    this.props.action == ActionEvent.UPDATE_NUMBER_UNSEEN
                ) {
                    this.state.unseen = data;
                }
            }
        }
    }

    /**
     * Handle number unseen
     */
    handleUnseen() {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE)
            .then(user => {
                if (!Utils.isNull(user)) {
                    this.setState({ user });
                    this.props.getUserProfile(user.id);
                } else {
                    this.state.unseen = 0;
                }
            })
            .catch(error => {
                //this callback is executed when your Promise is rejected
                console.log('Promise is rejected with error: ' + error);
            });
    }

    /**
     * Handle message unseen
     */
    handleMessageUnseen = () => {
        if (!Utils.isNull(this.state.user)) {
            try {
                database()
                    .ref(
                        `chats_by_user/u${this.state.user.id}/number_of_unseen_messages`,
                    )
                    .on('value', unseen => {
                        if (Utils.isNull(unseen.val())) {
                            this.state.unseen = 0;
                        } else {
                            this.state.unseen = unseen.val();
                        }
                    });
            } catch (error) {
                console.log('ERROR GET UNSEEN BASEVIEW: ', error);
            }
        }
    };

    render() {
        const { unseen } = this.state;
        return unseen > 0 ? (
            <View
                style={[
                    styles.container,
                    {
                        width: unseen >= 10 ? 24 : 18,
                    },
                ]}
            >
                <Text style={[commonStyles.textSmall, styles.unseenNumber]}>
                    {unseen >= 100 ? '99+' : unseen}
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
    unseenNumber: {
        color: Colors.COLOR_WHITE,
        padding: 0,
        margin: 0,
    },
};

const mapDispatchToProps = {
    ...userActions,
};

const mapStateToProps = state => ({
    data: state.iconChatUnseen.data,
    action: state.iconChatUnseen.action,
    isLoading: state.iconChatUnseen.isLoading,
    error: state.iconChatUnseen.error,
    errorCode: state.iconChatUnseen.errorCode,
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatUnseenIcon);
