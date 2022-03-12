import database from '@react-native-firebase/database';
import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import * as commonActions from 'actions/commonActions';
import * as actions from 'actions/userActions';
import DialogCustom from 'components/dialogCustom';
import FlatListCustom from 'components/flatListCustom';
import HeaderCustom from 'components/headerCustom';
import TextInputCustom from 'components/textInputCustom';
import { ErrorCode } from 'config/errorCode';
import BaseView from 'containers/base/baseView';
import chatWithType from 'enum/chatWithType';
import ic_playlist_add_check_grey from 'images/ic_playlist_add_check_grey.png';
import ic_search_gray from 'images/ic_search_gray.png';
import { localizes } from 'locales/i18n';
import { Container, Root } from 'native-base';
import React from 'react';
import {
    Image,
    Keyboard,
    RefreshControl,
    TouchableOpacity,
    View
} from 'react-native';
import { connect } from 'react-redux';
import StorageUtil from 'utils/storageUtil';
import StringUtil from 'utils/stringUtil';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import ItemListChat from './itemListChat';
import styles from './styles';

class ListChatView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            isShowLoading: true,
            refreshing: false,
            enableRefresh: true,
            enableLoadMore: false,
            isLoadingMore: false,
            searchString: null,
            isAlertDelete: false,
            itemSelected: null,
            mainConversation: [],
            showNoData: false,
        };
        this.conversationIds = [];
        this.conversations = [];
        this.userId = null;
        this.onBackConversation = null;
    }

    async componentDidMount() {
        super.componentDidMount();
        this.getProfile();
    }

    UNSAFE_componentWillReceiveProps = nextProps => {
        if (nextProps != this.props) {
            this.props = nextProps;
            this.handleData();
        }
    };

    /**
     * read conversations on firebase
     * @param {*} usersKey (~ array contain userKey) is used when search
     */
    readDataListChat = async usersKey => {
        try {
            database()
                .ref(`chats_by_user/u${this.userId}/_conversation`)
                .orderByChild('deleted__last_updated_at')
                .startAt(`1_`)
                .endAt(`1_\uf8ff`)
                .limitToLast(5000)
                .once('value', conversationSnap => {
                    const conversationValue = conversationSnap.val();
                    console.log('conversationValue: ', conversationValue);
                    let conversationIdPinChat = null;
                    this.conversationIds = [];
                    if (!Utils.isNull(conversationValue)) {
                        conversationSnap.forEach(element => {
                            this.conversationIds.push(
                                parseInt(
                                    StringUtil.getNumberInString(element.key),
                                ),
                            );
                        });
                        this.conversationIds.reverse();
                    }
                    this.getInformationMemberChat();
                    // if (this.userId != global.userAdminId) {
                    //     this.props.checkExistConversationListChat({ userMemberChatId: global.userAdminId});
                    // } else {
                    //     this.getInformationMemberChat();
                    // }
                });
        } catch (error) {
            this.saveException(error, 'readDataListChat');
        }
    };

    /**
     * Get information member chat (name, avatarPath)
     */
    getInformationMemberChat() {
        if (this.conversationIds.length > 0) {
            this.props.getMemberOfConversation({
                conversationIds: this.conversationIds,
            });
        } else {
            this.setState({ isLoading: false });
            if (!Utils.isNull(this.itemChatAdmin)) {
                this.conversations.splice(0, 0, this.itemChatAdmin);
                this.itemChatAdmin = null;
            }
            this.state.mainConversation = this.conversations;
            // add information conversation
            this.getInformationConversation();
        }
    }

    /**
     * Get valueLastMessage and valueUnseen
     */
    getInformationConversation = async () => {
        this.setState({
            refreshing: false,
            isLoadingMore: false,
            mainConversation: this.conversations,
            isShowLoading: false,
            showNoData: true,
        });
        this.conversations = [];
    };

    /**
     * Handle data when request
     */
    handleData() {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (
                    this.props.action ==
                    getActionSuccess(ActionEvent.GET_MEMBER_OF_CONVERSATION)
                ) {
                    this.conversations = data;
                    if (!Utils.isNull(this.itemChatAdmin)) {
                        this.conversations.splice(0, 0, this.itemChatAdmin);
                        this.itemChatAdmin = null;
                    }
                    this.state.mainConversation = this.conversations;
                    // add information conversation
                    this.getInformationConversation();
                } else if (
                    this.props.action ==
                    getActionSuccess(ActionEvent.DELETE_CONVERSATION)
                ) {
                } else if (
                    this.props.action ==
                    getActionSuccess(ActionEvent.SEARCH_CONVERSATION)
                ) {
                    if (!Utils.isNull(data)) {
                        this.conversations = data;
                        this.getInformationConversation();
                    } else {
                        this.conversations = [];
                        this.getInformationConversation();
                    }
                } else if (
                    this.props.action ==
                    getActionSuccess(
                        ActionEvent.CHECK_EXIST_CONVERSATION_LIST_CHAT,
                    )
                ) {
                    if (!Utils.isNull(data)) {
                        let indexPinConversationId = -1;
                        for (let i = 0; i < this.conversationIds.length; i++) {
                            if (data == this.conversationIds[i]) {
                                indexPinConversationId = i;
                                break;
                            }
                        }
                        if (indexPinConversationId != -1) {
                            Utils.arrayMoveIndex(
                                this.conversationIds,
                                indexPinConversationId,
                                0,
                            );
                        }
                    } else {
                        // this.props.createConversationListChat({
                        //     userMemberChatId: this.pinChatUserId,
                        //     typeMessage: messageType.NORMAL_MESSAGE
                        // })
                        this.itemChatAdmin = {
                            userId: global.userAdminId,
                            avatarPath: global.adminPath,
                            name: global.nameMemberChat,
                        };
                    }
                    this.getInformationMemberChat();
                } else if (
                    this.props.action ==
                    getActionSuccess(ActionEvent.CREATE_CONVERSATION)
                ) {
                    if (!Utils.isNull(data)) {
                        // this.conversationIds.splice(0, 0, data.conversationId);
                        // this.getInformationConversation();
                        this.readDataListChat();
                    }
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    /**
     * Get more testing
     */
    getMoreTesting = () => {
        if (this.isLoadMore) {
            this.isLoadMore = false;
            global.pageConversation += 10;
            this.readDataListChat();
        }
    };

    componentWillUnmount() {
        super.componentWillUnmount();
        !Utils.isNull(this.realTime) && this.realTime.off();
    }

    //onRefreshing
    handleRefresh = () => {
        this.setState({
            refreshing: true,
            enableLoadMore: false,
        });
        this.readDataListChat();
    };

    /**
     * Search user chat
     * @param {*} str
     */
    onSearch(str) {
        // if (!Utils.isNull(str)) {
        const self = this;
        if (self.state.typingTimeout) {
            clearTimeout(self.state.typingTimeout);
        }
        self.setState({
            searchString: str,
            typingTimeout: setTimeout(() => {
                this.props.searchConversation({
                    paramsSearch: str,
                });
            }, 1000),
        });
        // }
        //  else {
        //     this.readDataListChat();
        // }
    }

    render() {
        return (
            <Container
                style={[
                    styles.container,
                    { backgroundColor: Colors.COLOR_WHITE },
                ]}
            >
                <Root>
                    <HeaderCustom
                        visibleBack={true}
                        onBack={this.onBack}
                        gradient={true}
                        backgroundColor={true}
                        renderRightMenu= {this.renderReadAll}
                        titleStyle={{ color: Colors.COLOR_WHITE }}
                    />
                    <FlatListCustom
                        contentContainerStyle={{
                            paddingVertical: Constants.PADDING8,
                            paddingBottom: Constants.PADDING_XX_LARGE,
                        }}
                        horizontal={false}
                        ListHeaderComponent={this.renderSearch}
                        data={this.state.mainConversation}
                        itemPerCol={1}
                        renderItem={this.renderItemListChat}
                        showsVerticalScrollIndicator={false}
                        enableRefresh={this.state.enableRefresh}
                        refreshControl={
                            <RefreshControl
                                progressViewOffset={
                                    Constants.HEIGHT_HEADER_OFFSET_REFRESH
                                }
                                refreshing={this.state.refreshing}
                                onRefresh={this.handleRefresh}
                            />
                        }
                        isShowEmpty={this.state.showNoData}
                        textForEmpty={'Không có dữ liệu'}
                        styleEmpty={{
                            marginTop: Constants.MARGIN8,
                        }}
                        isShowImageEmpty={true}
                    />
                    {this.state.isLoadingMore || this.state.refreshing
                        ? null
                        : this.showLoadingBar(this.state.isShowLoading)}
                    {this.renderDialogDelete()}
                </Root>
            </Container>
        );
    }

    /**
     * Render dialog delete conversation
     */
    renderDialogDelete() {
        const { itemSelected } = this.state;
        return (
            <DialogCustom
                visible={this.state.isAlertDelete}
                isVisibleTitle={true}
                isVisibleContentText={true}
                isVisibleTwoButton={true}
                contentTitle={localizes('confirm')}
                textBtnOne={localizes('cancel')}
                textBtnTwo={localizes('delete')}
                contentText={localizes('listChatView.confirmTextChat')}
                onPressX={() => {
                    this.setState({ isAlertDelete: false });
                }}
                onPressBtnPositive={() => {
                    database()
                        .ref()
                        .update({
                            [`members/c${itemSelected.conversationId}/u${this.userId}/deleted_conversation`]: true,
                            [`chats_by_user/u${this.userId}/_conversation/c${itemSelected.conversationId}/deleted`]: true,
                            [`chats_by_user/u${this.userId}/_conversation/c${itemSelected.conversationId}/deleted__last_updated_at`]:
                                '0_0',
                            [`conversation/c${itemSelected.conversationId}/deleted`]: true,
                        })
                        .then(() => {
                            this.handleUnseen();
                            this.readDataListChat();
                            // update DB
                            // + set conversation.status = 2 (suspended)
                            // + set conversation_member.deleted_conversation = true (with me id)
                            this.props.deleteConversation(
                                itemSelected.conversationId,
                            );
                            this.setState({
                                isAlertDelete: false,
                            });
                            this.onBackConversation
                                ? this.onBackConversation()
                                : null;
                        });
                }}
            />
        );
    }

    /**
     * Handle unseen
     */
    handleUnseen = () => {
        const { itemSelected } = this.state;
        let countUnseen = 0;
        if (!Utils.isNull(itemSelected.conversationId)) {
            database()
                .ref(
                    `members/c${itemSelected.conversationId}/u${this.userId}/number_of_unseen_messages`,
                )
                .transaction(function (value) {
                    countUnseen = value;
                    return 0;
                });
            database()
                .ref(`chats_by_user/u${this.userId}/number_of_unseen_messages`)
                .transaction(function (value) {
                    return value - countUnseen;
                });
        }
    };

    /**
     * Render item
     * @param {*} item
     * @param {*} index
     * @param {*} parentIndex
     * @param {*} indexInParent
     */
    renderItemListChat = (item, index, parentIndex, indexInParent) => {
        return (
            <ItemListChat
                key={index.toString()}
                data={this.state.mainConversation}
                item={item}
                index={index}
                onPressItemChat={() => {
                    // this.props.navigation.navigate('Chat', {
                    //     userMember: {
                    //         id: item.userId,
                    //         name: item.name,
                    //         avatarPath: item.avatarPath,
                    //     },
                    //     conversationId: item.conversationId,
                    // });
                    if (Utils.isNull(item.shop)) {
                        this.props.navigation.navigate('Chat', {
                            memberChatId: item.userId,
                            chatWith: chatWithType.USER,
                            conversationId: item.conversationId,
                        });
                    } else {
                        this.props.navigation.navigate('Chat', {
                            memberChatId: item.shop.id,
                            chatWith: chatWithType.SHOP,
                            conversationId: item.conversationId,
                        });
                    }
                }}
                onPressDeleteItem={() => {
                    this.setState({ isAlertDelete: true, itemSelected: item });
                }}
                resourcePathResize={this.resourceUrlPathResize.textValue}
                resourcePath={this.resourceUrlPath.textValue}
                userId={this.userId}
                pinChatUserId={global.userAdminId}
            />
        );
    };

    /**
     * Render read all
     */
    renderSearch = () => {
        return (
            <TextInputCustom
                onRef={r => (this.phone = r)}
                isInputNormal={true}
                placeholder={localizes('listChatView.search')}
                onSubmitEditing={() => {
                    this.onSearch(this.searchText);
                    Keyboard.dismiss();
                }}
                onChangeText={content => {
                    this.searchText = content;
                    this.onSearch(this.searchText);
                }}
                returnKeyType={'search'}
                contentRight={ic_search_gray}
                onPressRight={this.managePasswordVisibility}
            />
        );
    };

    /**
     * Render read all
     */
    renderReadAll = () => {
        return (
            <View
                style={{
                    alignItems: 'flex-end',
                    paddingHorizontal: Constants.PADDING16,
                    paddingVertical: Constants.PADDING8,
                }}
            >
                <TouchableOpacity
                    style={{}}
                    onPress={() => {
                        this.readAllChat();
                    }}
                >
                    <Image
                        source={ic_playlist_add_check_grey}
                        resizeMode={'contain'}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    /**
     * Read all chat
     */
    readAllChat = () => {
        database()
            .ref(`chats_by_user/u${this.userId}/_conversation`)
            .orderByChild('deleted__last_updated_at')
            .startAt(`1_`)
            .endAt(`1_\uf8ff`)
            .limitToLast(5000)
            .once('value', conversationSnap => {
                if (!Utils.isNull(conversationSnap)) {
                    conversationSnap.forEach(element => {
                        let conversationId = StringUtil.getNumberInString(
                            element.key,
                        );
                        database()
                            .ref(
                                `members/c${conversationId}/u${Number(
                                    this.userId,
                                )}/number_of_unseen_messages`,
                            )
                            .set(0);
                    });
                    database()
                        .ref(
                            `chats_by_user/u${Number(
                                this.userId,
                            )}/number_of_unseen_messages`,
                        )
                        .set(0);
                }
            });
    };

    /**
     * Get profile user
     */
    getProfile = () => {
        StorageUtil.retrieveItem(StorageUtil.USER_PROFILE)
            .then(user => {
                if (!Utils.isNull(user)) {
                    this.props.getUserProfile(user.id);
                    this.userId = user.id;
                    this.realTime = database().ref(
                        `chats_by_user/u${user.id}/_all_conversation`,
                    );
                    this.realTime.on('value', snap => {
                        this.readDataListChat();
                    });
                }
            })
            .catch(error => {
                this.saveException(error, 'componentWillMount');
            });
    };
}

const mapStateToProps = state => ({
    data: state.listChat.data,
    isLoading: state.listChat.isLoading,
    error: state.listChat.error,
    errorCode: state.listChat.errorCode,
    action: state.listChat.action,
});

const mapDispatchToProps = {
    ...actions,
    ...commonActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(ListChatView);
