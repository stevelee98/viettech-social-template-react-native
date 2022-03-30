import database from '@react-native-firebase/database';
import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import * as commonActions from 'actions/commonActions';
import * as shopActions from 'actions/shopActions';
import * as actions from 'actions/userActions';
import FlatListCustom from 'components/flatListCustom';
import { ErrorCode } from 'config/errorCode';
import ServerPath from 'config/Server';
import BaseView from 'containers/base/baseView';
import ModalImageViewer from 'containers/common/modalImageViewer';
import chatWithType from 'enum/chatWithType';
import messageType from 'enum/messageType';
import statusType from 'enum/statusType';
import ic_attach_grey from 'images/ic_attach_grey.png';
import ic_camera_grey from 'images/ic_camera_gray.png';
import ic_picture_grey from 'images/ic_picture_grey.png';
import { localizes } from 'locales/i18n';
import { Container, Root, Text } from 'native-base';
import {
    Dimensions,
    Image,
    Keyboard,
    PermissionsAndroid,
    Platform,
    StatusBar,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Upload from 'react-native-background-upload';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import KeyboardManager from 'react-native-keyboard-manager';
import { connect } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import commonStyles from 'styles/commonStyles';
import DateUtil from 'utils/dateUtil';
import StorageUtil from 'utils/storageUtil';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import ItemChat from './itemChat';
import styles from './styles';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const MAX_IMAGE = 10;
const MAX_SIZE = 10;
const CHARACTERS =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
class ChatView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            enableLoadMore: false,
            messageText: '',
            messages: [],
            images: [],
            isShowLoading: true,
            userId: null,
            keyboardHeight: 0,
            user: null,
            isHasConversation: false,
            downloadedList: [],
            progress: 0,
        };
        const { memberChatId, conversationId, chatWith, messageContent } =
            this.props.route.params;
        this.onceQuery = Constants.PAGE_SIZE;
        this.isScrollStart = true;
        this.isSending = false;
        this.isLoadingMore = false;
        this.avatar = '';
        this.conversationId = conversationId;
        this.memberChatId = memberChatId;
        this.messageContent = messageContent;
        this.chatWith = chatWith ? chatWith : chatWithType.USER;
        this.imagesMessage = [];
        this.indexImagesMessage = 0;
        this.objectImages = '';
        this.actionValue = {
            WAITING_FOR_USER_ACTION: 0,
            ACCEPTED: 1,
            DENIED: 2,
        };
        this.otherUserIdsInConversation = [];
        this.deleted = false;
        this.firebaseRef = database();
        this.filter = {
            conversationId: null,
            content: null,
            typeMessage: messageType.NORMAL_MESSAGE,
        };
        this.firstMessageType = messageType.NORMAL_MESSAGE;
        this.fileType = null;
        this.file = [];
        this.fileReal = null;
        this.seller = null;
        this.oneMB = 1024 * 1024;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
            this.handleData();
        }
    }

    componentDidMount = async () => {
        super.componentDidMount();
        this.getSourceUrlPath();
        this.handleKeyboard();
        global.atMessage = true;
        StatusBar.setHidden(false, 'fade');
        if (this.chatWith == chatWithType.SHOP) {
            this.props.getShopDetail(this.memberChatId);
        } else {
            this.props.getSellerInfo(this.memberChatId);
        }
        await StorageUtil.retrieveItem(StorageUtil.USER_PROFILE)
            .then(user => {
                //this callback is executed when your Promise is resolved
                console.log('USER_INFO_IN_CHAT', user);
                if (!Utils.isNull(user) && user.status == statusType.ACTIVE) {
                    this.userInfo = user;
                    this.otherUserIdsInConversation = [
                        this.memberChatId,
                        user.id,
                    ];
                    this.props.checkExistConversation({
                        memberChatId: this.memberChatId,
                        chatWith: this.chatWith,
                        messageText: this.state.messageText,
                    });
                    // conversation is between user and admin (sold)
                    this.watchDeletedConversation();
                    this.handleUnseen();
                }
            })
            .catch(e => {
                this.saveException(e, 'componentDidMount');
            });
    };

    /**
     * Follow status deleted conversation
     */
    watchDeletedConversation() {
        if (!Utils.isNull(this.conversationId)) {
            this.deletedConversation = this.firebaseRef.ref(
                `conversation/c${this.conversationId}/deleted`,
            );
            this.deletedConversation.on('value', memberSnap => {
                return (this.deleted = memberSnap.val());
            });
        }
        return (this.deleted = false);
    }

    /**
     * Handle unseen
     */
    handleUnseen = () => {
        let countUnseen = 0;
        if (!Utils.isNull(this.conversationId) && this.userInfo) {
            this.firebaseRef
                .ref(
                    `members/c${this.conversationId}/u${this.userInfo.id}/number_of_unseen_messages`,
                )
                .transaction(function (value) {
                    countUnseen = value;
                    return 0;
                });
            setTimeout(() => {
                this.firebaseRef
                    .ref(
                        `chats_by_user/u${this.userInfo.id}/number_of_unseen_messages`,
                    )
                    .transaction(function (value) {
                        return value - countUnseen;
                    });
            }, 2000);
        }
    };

    /**
     * Handle keyboard
     */
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
            this.handleData();
        }
    }

    /**
     * Handle keyboard
     */
    handleKeyboard = async () => {
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this.keyboardDidShow.bind(this),
        );
        this.keyboardWillHideListener = Keyboard.addListener(
            'keyboardWillHide',
            this.keyboardWillHide.bind(this),
        );
        this.keyboardWillShowListener = Keyboard.addListener(
            'keyboardWillShow',
            this.keyboardWillShow.bind(this),
        );
        Platform.OS === 'android' ? null : KeyboardManager.setEnable(false);
    };

    /**
     * Handle show keyboard
     * @param {*} e
     */
    keyboardWillShow(e) {
        this.setState({ keyboardHeight: e.endCoordinates.height });
    }

    /**
     * Handle hide keyboard
     * @param {*} e
     */
    keyboardWillHide(e) {
        this.setState({ keyboardHeight: 0 });
    }

    /**
     * Keyboard did show
     */
    keyboardDidShow(e) {
        this.isScrollStart = true;
        this.scrollToStart();
    }

    /**
     * Scroll to end flat list
     */
    scrollToStart() {
        if (this.isScrollStart) {
            !Utils.isNull(this.flatListRef) &&
                this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
            this.handleUnseen();
        }
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.keyboardDidShowListener.remove();
        this.keyboardWillHideListener.remove();
        global.atMessage = false;
        Platform.OS === 'android' ? null : KeyboardManager.setEnable(true);
    }

    /**
     * Get all messages
     * @param {*} isLoadMore ~ true: load more is active
     */
    readFirebaseDatabase = async isLoadMore => {
        if (isLoadMore) {
            this.isLoadingMore = true;
            this.onceQuery += this.onceQuery;
            this.isScrollStart = false;
        }
        try {
            this.firebaseRef
                .ref(`messages_by_conversation/c${this.conversationId}`)
                .limitToLast(this.onceQuery)
                .on('value', messageSnap => {
                    let messages = [];
                    console.log('messagesSnap: ', messageSnap.val());
                    if (!Utils.isNull(messageSnap.val())) {
                        let lengthMessage = Math.abs(
                            this.state.messages.length -
                                messageSnap._childKeys.length,
                        );
                        this.state.enableLoadMore =
                            this.onceQuery == Constants.PAGE_SIZE &&
                            this.state.messages.length > 0
                                ? this.state.messages.length >=
                                  Constants.PAGE_SIZE
                                : !(lengthMessage < Constants.PAGE_SIZE);
                        messageSnap.forEach(itemMessage => {
                            let indexDownloaded =
                                this.state.downloadedList.findIndex(
                                    item => item.key == itemMessage.key,
                                );
                            let item = {
                                conversationId: this.conversationId,
                                key: itemMessage.key,
                                fromUserId: itemMessage.toJSON().from_user_id,
                                message: itemMessage.toJSON().content,
                                receiverSeen:
                                    itemMessage.toJSON().receiver_seen,
                                timestamp: itemMessage.toJSON().timestamp,
                                isShowAvatar: true,
                                isShowDate: true,
                                avatar: this.avatar,
                                messageType: itemMessage.toJSON().message_type,
                                receiverResourceAction:
                                    itemMessage.toJSON()
                                        .receiver_resource_action,
                                isDownload:
                                    indexDownloaded >= 0
                                        ? this.state.downloadedList[
                                              indexDownloaded
                                          ].isDownload
                                        : false,
                                downloaded:
                                    indexDownloaded >= 0
                                        ? this.state.downloadedList[
                                              indexDownloaded
                                          ].downloaded
                                        : false,
                                openPathDownloaded:
                                    indexDownloaded >= 0
                                        ? this.state.downloadedList[
                                              indexDownloaded
                                          ].openPathDownloaded
                                        : null,
                            };
                            messages.push(item);
                        });
                    }
                    this.nextIndex = 0;
                    this.nextElement = null;
                    for (let index = 0; index < messages.length; index++) {
                        const element = messages[index];
                        if (index + 1 > messages.length - 1) {
                            break;
                        } else {
                            this.nextIndex = index + 1;
                        }
                        this.nextElement = messages[this.nextIndex];
                        if (element.fromUserId !== this.userInfo.id) {
                            if (
                                element.fromUserId ===
                                this.nextElement.fromUserId
                            ) {
                                !Utils.isNull(element.isShowAvatar)
                                    ? (element.isShowAvatar = false)
                                    : null;
                            }
                        }
                        if (
                            new Date(Number(element.timestamp)).getMonth() +
                                1 ===
                                new Date(
                                    Number(this.nextElement.timestamp),
                                ).getMonth() +
                                    1 &&
                            new Date(Number(element.timestamp)).getDate() ===
                                new Date(
                                    Number(this.nextElement.timestamp),
                                ).getDate()
                        ) {
                            this.nextElement.isShowDate = false;
                        }
                    }
                    this.setState(
                        {
                            messages: messages.reverse(),
                            isShowLoading: false,
                        },
                        () => {
                            this.scrollToStart();
                        },
                    );
                    // this.handleUnseen();
                    this.isLoadingMore = false;
                });
        } catch (error) {
            this.saveException(error, 'readFirebaseDatabase');
        }
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
                    getActionSuccess(ActionEvent.CREATE_CONVERSATION)
                ) {
                    if (!Utils.isNull(data)) {
                        if (!Utils.isNull(data.conversationId)) {
                            this.conversationId = data.conversationId;
                            this.otherUserIdsInConversation = [
                                this.memberChatId,
                                this.userInfo.id,
                            ];
                            if (
                                this.firstMessageType ==
                                messageType.NORMAL_MESSAGE
                            ) {
                                this.readFirebaseDatabase();
                                // add
                                this.filter.content =
                                    this.state.messageText.trim();
                                this.filter.conversationId =
                                    this.conversationId;
                                this.props.pushMessage(this.filter);
                                this.state.messageText = '';
                            } else {
                                this.firebaseRef
                                    .ref(
                                        `chats_by_user/u${this.memberChatId}/number_of_unseen_messages`,
                                    )
                                    .transaction(function (value) {
                                        return value - 1;
                                    });
                                console.log('1');
                                this.uploadImageStepByStep();
                                console.log('2');
                                this.readFirebaseDatabase();
                                console.log('3');
                            }
                        }
                    }
                } else if (
                    this.props.action ==
                    getActionSuccess(ActionEvent.CHECK_EXIST_CONVERSATION)
                ) {
                    if (!Utils.isNull(data)) {
                        this.conversationId = data;
                        this.readFirebaseDatabase();
                        this.handleUnseen();
                        this.setState({ isHasConversation: true });
                        if (!Utils.isNull(this.messageContent)) {
                            this.onPressSendMessages(this.messageContent, null);
                        }
                    } else {
                        this.state.isShowLoading = false;
                        this.setState({ isHasConversation: false });
                        if (!Utils.isNull(this.messageContent)) {
                            this.onPressSendMessages(this.messageContent, null);
                        }
                    }
                } else if (
                    this.props.action ==
                        getActionSuccess(ActionEvent.GET_SHOP_DETAIL) ||
                    this.props.action ==
                        getActionSuccess(ActionEvent.GET_SELLER_INFO)
                ) {
                    if (!Utils.isNull(data)) {
                        this.seller = data;
                        this.avatar = data.avatarPath;
                    }
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    /**
     * Render item
     * @param {*} item
     * @param {*} index
     * @param {*} parentIndex
     * @param {*} indexInParent
     */
    renderItemChat = (item, index, parentIndex, indexInParent) => {
        if (!Utils.isNull(item)) {
            return (
                <ItemChat
                    key={index.toString()}
                    data={item}
                    index={index}
                    userId={this.userInfo.id}
                    roomId={this.roomId}
                    userAdminId={this.userAdmin.numericValue}
                    onPressSendAction={(
                        actionValue,
                        conversationId,
                        keyMessage,
                    ) => {
                        this.firebaseRef
                            .ref()
                            .update({
                                [`messages_by_conversation/c${conversationId}/${keyMessage}/receiver_resource_action`]:
                                    this.receiverResourceAction(actionValue),
                            })
                            .then(() => {
                                this.isScrollStart = false;
                                this.readFirebaseDatabase();
                            });
                    }}
                    resourceUrlPath={this.resourceUrlPath.textValue}
                    resourceUrlPathResize={this.resourceUrlPathResize.textValue}
                    downloadFile={this.handleDownloadFile}
                    openFile={this.openFile}
                    progress={this.state.progress}
                    onPressImage={this.onPressImage}
                    user={this.userInfo}
                    seller={this.seller}
                    navigation={this.props.navigation}
                />
            );
        } else {
            return <View></View>;
        }
    };

    /**
     * Download file
     */
    handleDownloadFile = (item, path, type, nameFile) => {
        if (!Utils.isNull(type) && !Utils.isNull(path)) {
            item.isDownload = true;
            let dirs =
                Platform.OS == 'ios'
                    ? RNFetchBlob.fs.dirs.DocumentDir
                    : RNFS.DownloadDirectoryPath;
            RNFetchBlob.config({
                fileCache: true,
                // addAndroidDownloads : {
                //     useDownloadManager : true, // <-- this is the only thing required
                //     // Optional, override notification setting (default to true)
                //     notification : true,
                //     // Optional, but recommended since android DownloadManager will fail when
                //     // the url does not contains a file extension, by default the mime type will be text/plain
                //     mime : type,
                //     description : 'File downloaded by download manager.',
                //     // path: `${RNFS.DownloadDirectoryPath}/${StringUtil.randomString(6, CHARACTERS)}${Math.floor(date.getTime() + date.getSeconds() / 2)}`,
                //     // mediaScannable : true,
                // },
                path: dirs + '/' + nameFile,
            })
                .fetch('GET', `${this.resourceUrlPath.textValue}/${path}`)
                .progress((received, total) => {
                    this.setState({ progress: received / total });
                })
                .then(res => {
                    // the path of downloaded file
                    item.downloaded = true;
                    item.openPathDownloaded =
                        Platform.OS === 'ios' ? res.data : res.path();
                    this.state.downloadedList.push({
                        key: item.key,
                        isDownload: item.isDownload,
                        downloaded: item.downloaded,
                        openPathDownloaded: item.openPathDownloaded,
                    });
                    this.setState({ progress: 1 });
                });
        } else {
            this.showMessage('Tải file thất bại');
        }
    };

    /**
     * Open the downloaded file
     */
    openFile = (path, type) => {
        Platform.OS === 'ios'
            ? RNFetchBlob.ios.openDocument(path)
            : RNFetchBlob.android.actionViewIntent(path, type);
    };

    /**
     * On press image
     */
    onPressImage = (images, index) => {
        this.refs.modalImageViewer.showModal(images, index);
    };

    /**
     * Receiver resource action
     * @param {*} actionValue
     */
    receiverResourceAction(actionValue) {
        if (actionValue == this.actionValue.DENIED) {
            // DENIED
            return this.actionValue.DENIED;
        } else if (actionValue == this.actionValue.ACCEPTED) {
            return this.actionValue.ACCEPTED;
        }
    }

    /**
     * Send message
     * @param {*} contentMessages
     * @param {*} contentImages // when send image. contentImages = 'path 1, path 2, ...'
     */
    onPressSendMessages = async (contentMessages, contentImages) => {
        let timestamp = DateUtil.getTimestamp();
        let typeMessage = messageType.NORMAL_MESSAGE;
        if (
            !Utils.isNull(contentMessages) ||
            !Utils.isNull(this.state.messageText) ||
            !Utils.isNull(contentImages)
        ) {
            let content = '';
            if (!Utils.isNull(contentMessages)) {
                content = contentMessages;
            } else if (!Utils.isNull(this.state.messageText)) {
                content = this.state.messageText.trim();
            } else if (
                !Utils.isNull(this.fileType) &&
                this.fileType == messageType.FILE_MESSAGE
            ) {
                content =
                    contentImages +
                    `,${this.file.name},${this.file.type},${this.formatBytes(
                        this.file.size,
                    )}`;
                typeMessage = messageType.FILE_MESSAGE;
            } else {
                content = contentImages;
                typeMessage = messageType.IMAGE_MESSAGE;
            }
            this.messageDraft = {
                conversationId: this.conversationId,
                fromUserId: this.userInfo.id,
                message: content,
                timestamp: timestamp,
                isShowAvatar: false,
                isShowDate: false,
                messageType: typeMessage,
                receiverResourceAction: 0,
                sending: 0,
            };
            var joined = [...this.state.messages, this.messageDraft];
            this.setState({ messages: joined });
            if (!Utils.isNull(this.conversationId)) {
                if (this.deleted) {
                    this.readFirebaseDatabase();
                } else {
                    try {
                        let i = 0;
                        this.otherUserIdsInConversation.forEach(userId => {
                            if (i == 0) {
                                if (this.chatWith == chatWithType.SHOP) {
                                    userId = this.seller.user.id;
                                }
                            }
                            i++;
                            let updateData = {
                                [`chats_by_user/u${Number(
                                    userId,
                                )}/_conversation/c${Number(
                                    this.conversationId,
                                )}/deleted`]: false,
                                [`chats_by_user/u${Number(
                                    userId,
                                )}/_conversation/c${Number(
                                    this.conversationId,
                                )}/last_updated_at`]: timestamp,
                                [`chats_by_user/u${Number(
                                    userId,
                                )}/_conversation/c${Number(
                                    this.conversationId,
                                )}/deleted__last_updated_at`]: `1_${timestamp}`,
                                [`chats_by_user/u${Number(
                                    userId,
                                )}/_conversation/c${Number(
                                    this.conversationId,
                                )}/last_messages`]: {
                                    content: content,
                                    timestamp: database()
                                        .getServerTime()
                                        .getTime(),
                                    message_type: typeMessage,
                                },
                                [`chats_by_user/u${Number(
                                    userId,
                                )}/_all_conversation`]: {
                                    conversation_id: Number(
                                        this.conversationId,
                                    ),
                                    from_user_id: Number(this.userInfo.id),
                                    last_updated_at: database()
                                        .getServerTime()
                                        .getTime(),
                                    last_messages: {
                                        content: content,
                                        timestamp: fdatabase()
                                            .getServerTime()
                                            .getTime(),
                                        message_type: typeMessage,
                                    },
                                },
                            };
                            this.firebaseRef.ref().update(updateData);
                            if (userId === this.userInfo.id) {
                                return;
                            }
                            this.firebaseRef
                                .ref(
                                    `members/c${Number(
                                        this.conversationId,
                                    )}/u${Number(
                                        userId,
                                    )}/number_of_unseen_messages`,
                                )
                                .transaction(function (value) {
                                    return value + 1;
                                });
                            this.firebaseRef
                                .ref(
                                    `chats_by_user/u${Number(
                                        userId,
                                    )}/number_of_unseen_messages`,
                                )
                                .transaction(function (value) {
                                    return value + 1;
                                });
                        });
                        // push new message:
                        let newMessageKey = this.firebaseRef
                            .ref(
                                `messages_by_conversation/c${Number(
                                    this.conversationId,
                                )}`,
                            )
                            .push().key;
                        this.firebaseRef.ref().update({
                            [`messages_by_conversation/c${Number(
                                this.conversationId,
                            )}/${newMessageKey}`]: {
                                from_user_id: this.userInfo.id,
                                uid: this.memberChatId,
                                content: content.trim(),
                                timestamp: database().getServerTime().getTime(),
                                message_type: typeMessage,
                                receiver_seen: true,
                                receiver_resource_action: 0,
                            },
                        });
                        // add
                        this.filter.typeMessage = typeMessage;
                        this.filter.content = content;
                        this.filter.conversationId = this.conversationId;
                        this.props.pushMessage(this.filter);
                        this.state.messageText = '';
                        this.setState({ messageText: null });
                        this.isScrollStart = true;
                        this.scrollToStart();
                        this.onceQuery = Constants.PAGE_SIZE;
                    } catch (error) {
                        this.saveException(error, 'onPressSendMessages');
                    }
                }
            } else {
                this.props.createConversation({
                    memberChatId: this.memberChatId,
                    typeMessage: typeMessage,
                    content: content,
                });
            }
        }
    };

    /**
     * Format bytes
     * @param {*} bytes
     * @param {*} decimals
     */
    formatBytes(bytes, decimals) {
        if (bytes == 0) return '0 Bytes';
        var k = 1024,
            dm = decimals <= 0 ? 0 : decimals || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return (
            parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
        );
    }

    /**
     * Take a photo
     */
    takePhoto = async () => {
        await this.launchCamera(uri => {
            this.imagesMessage.push({
                image: uri,
            });
            if (
                this.imagesMessage.length > 0 &&
                this.imagesMessage.length < MAX_IMAGE
            ) {
                this.handleImageSelected(this.imagesMessage);
            } else if (this.imagesMessage.length > MAX_IMAGE) {
                this.showMessage(
                    `Số lượng không lớn hơn ${MAX_IMAGE} hình ảnh`,
                );
            }
        });
    };

    /**
     * Choose image car
     */
    onChooseImage = async () => {
        await this.launchMultipleImageLibrary(images => {
            this.objectImages = '';
            this.indexImagesMessage = 0;
            this.imagesMessage = images;
            if (
                this.imagesMessage.length > 0 &&
                this.imagesMessage.length < MAX_IMAGE
            ) {
                this.handleImageSelected(this.imagesMessage);
            } else if (this.imagesMessage.length > MAX_IMAGE) {
                this.showMessage(
                    `Số lượng không lớn hơn ${MAX_IMAGE} hình ảnh`,
                );
            }
        }, false);
    };

    /**
     * Handle image selected
     */
    handleImageSelected = images => {
        this.setState({
            isShowLoading: true,
        });
        if (!Utils.isNull(this.conversationId)) {
            this.uploadImageStepByStep();
        } else {
            this.firstMessageType = messageType.IMAGE_MESSAGE;
            this.props.createConversation({
                memberChatId: this.memberChatId,
                typeMessage: messageType.IMAGE_MESSAGE,
                content: null,
            });
        }
    };

    /**
     * Rotate image
     */
    rotateImage(orientation) {
        let degRotation;
        switch (orientation) {
            case 90:
                degRotation = 90;
                break;
            case 270:
                degRotation = -90;
                break;
            case 180:
                degRotation = 180;
                break;
            default:
                degRotation = 0;
        }
        return degRotation;
    }

    /**
     * Upload image to server and get return path
     */
    uploadImageStepByStep() {
        let filePathUrl = '';
        if (this.firstMessageType == messageType.FILE_MESSAGE) {
            filePathUrl = this.filePickerUri;
        } else {
            filePathUrl = this.imagesMessage[this.indexImagesMessage].image;
        }
        if (Platform.OS == 'android') {
            filePathUrl = filePathUrl.replace('file://', '');
        } else {
            filePathUrl = Utils.convertLocalIdentifierIOSToAssetLibrary(
                filePathUrl,
                true,
            );
        }
        console.log('Chat View image path: ', filePathUrl);
        const options = {
            url:
                ServerPath.API_URL +
                `user/conversation/${this.conversationId}/media/upload`,
            path: filePathUrl,
            method: 'POST',
            field: 'file',
            type: 'multipart',
            headers: {
                'Content-Type': 'application/json', // Customize content-type
                'X-APITOKEN': global.token,
            },
            notification: {
                enabled: true,
                onProgressTitle: 'Đang tải lên...',
                autoClear: true,
            },
        };
        this.processUploadImage(options);
    }

    /**
     * Process Upload Image
     */
    processUploadImage(options) {
        Upload.startUpload(options)
            .then(uploadId => {
                console.log('Upload started');
                Upload.addListener('progress', uploadId, data => {
                    console.log(`Progress: ${data.progress}%`);
                });
                Upload.addListener('error', uploadId, data => {
                    console.log(`Error: ${data.error} %`);
                    this.showMessage(
                        this.fileType == messageType.FILE_MESSAGE
                            ? localizes('uploadFileError')
                            : localizes('uploadImageError'),
                    );
                    this.setState({
                        isShowLoading: false,
                    });
                });
                Upload.addListener('cancelled', uploadId, data => {
                    console.log(`Cancelled!`);
                });
                Upload.addListener('completed', uploadId, data => {
                    console.log(
                        'Completed!: ',
                        this.indexImagesMessage,
                        ' - ',
                        data,
                    );
                    if (!Utils.isNull(data.responseBody)) {
                        let result = JSON.parse(data.responseBody);
                        let pathImage = result.data;
                        console.log('Hello in chat view ' + pathImage);
                        if (
                            !Utils.isNull(this.fileType) &&
                            this.fileType == messageType.FILE_MESSAGE
                        ) {
                            this.objectImages = pathImage;
                        } else {
                            this.objectImages +=
                                pathImage +
                                (this.indexImagesMessage ==
                                this.imagesMessage.length - 1
                                    ? ''
                                    : ',');
                        }
                    }
                    if (
                        this.indexImagesMessage <
                        this.imagesMessage.length - 1
                    ) {
                        this.indexImagesMessage++;
                        const timeOut = setTimeout(() => {
                            this.uploadImageStepByStep();
                        }, 200);
                    } else {
                        console.log('this.objectImages: ', this.objectImages);
                        this.indexImagesMessage = 0;
                        // upload images done!
                        this.onPressSendMessages('', this.objectImages);
                    }
                });
            })
            .catch(err => {
                this.saveException(err, 'processUploadImage');
            });
    }

    renderRightMenu = () => {
        return (
            <View style={{ paddingRight: Constants.PADDING_XX_LARGE }}></View>
        );
    };

    render() {
        console.log('this.state.enableLoadMore', this.state.enableLoadMore);
        return (
            <Container style={styles.container}>
                <Root>
                    {this.renderHeaderView({
                        visibleBack: true,
                        title: this.seller ? this.seller.name : '',
                        iconDark: true,
                        renderRightMenu: this.renderRightMenu,
                    })}
                    <FlatListCustom
                        showsVerticalScrollIndicator={false}
                        enableLoadMore={this.state.enableLoadMore}
                        onLoadMore={() => {
                            // console.log("this.isLoadingMore", this.isLoadingMore)
                            // !this.isLoadingMore && this.readFirebaseDatabase(true)
                            this.readFirebaseDatabase(true);
                        }}
                        inverted={true}
                        onRef={ref => {
                            this.flatListRef = ref;
                        }}
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingHorizontal: Constants.PADDING8,
                        }}
                        onContentSizeChange={() => {
                            this.scrollToStart();
                        }}
                        horizontal={false}
                        data={this.state.messages}
                        renderItem={this.renderItemChat.bind(this)}
                    />
                    <View
                        style={[
                            commonStyles.viewCenter,
                            commonStyles.viewHorizontal,
                            {
                                backgroundColor: Colors.COLOR_WHITE,
                                flex: 0,
                                paddingVertical: Constants.PADDING,
                                marginBottom: this.state.keyboardHeight,
                            },
                        ]}
                    >
                        <TextInput
                            style={[
                                commonStyles.text,
                                {
                                    flex: 1,
                                    maxHeight: 100,
                                    borderRadius: Constants.CORNER_RADIUS,
                                    padding: Constants.PADDING8,
                                    marginLeft: Constants.MARGIN16,
                                },
                            ]}
                            editable={!this.state.isShowLoading}
                            selectTextOnFocus={!this.state.isShowLoading}
                            placeholder={localizes('chat.inputChat')}
                            placeholderTextColor={Colors.COLOR_DRK_GREY}
                            ref={r => (this.messageInput = r)}
                            value={this.state.messageText}
                            onChangeText={text => {
                                this.setState({ messageText: text });
                            }}
                            keyboardType="default"
                            underlineColorAndroid="transparent"
                            // returnKeyType={"send"}
                            multiline={true}
                        />
                        {Utils.isNull(this.state.messageText) ? (
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginHorizontal: Constants.MARGIN16,
                                }}
                            >
                                <TouchableOpacity
                                    activeOpacity={Constants.ACTIVE_OPACITY}
                                    style={[
                                        styles.icon,
                                        { marginLeft: Constants.MARGIN16 },
                                    ]}
                                    onPress={() => this.onAttachFile()}
                                >
                                    <Image
                                        source={ic_attach_grey}
                                        resizeMode={'cover'}
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={Constants.ACTIVE_OPACITY}
                                    style={[styles.icon]}
                                    onPress={() => this.onChooseImage()}
                                >
                                    <Image
                                        source={ic_picture_grey}
                                        resizeMode={'cover'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={Constants.ACTIVE_OPACITY}
                                    onPress={() => this.takePhoto()}
                                >
                                    <Image
                                        source={ic_camera_grey}
                                        resizeMode={'cover'}
                                    />
                                </TouchableOpacity>
                            </View>
                        ) : null}
                        {!Utils.isNull(this.state.messageText) ? (
                            <TouchableOpacity
                                activeOpacity={Constants.ACTIVE_OPACITY}
                                style={styles.iconSend}
                                onPress={() =>
                                    !this.props.isLoading &&
                                    !Utils.isNull(this.state.messageText) &&
                                    this.state.messageText.trim() !== '' &&
                                    this.onPressSendMessages()
                                }
                            >
                                <Text style={styles.textSend}>Gửi</Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                    <ModalImageViewer ref={'modalImageViewer'} />
                    {this.showLoadingBar(this.state.isShowLoading)}
                </Root>
            </Container>
        );
    }

    /**
     * Attach file
     */
    onAttachFile = async () => {
        const hasCameraPermission = await this.hasPermission(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        if (!hasCameraPermission) return;
        try {
            const result = await DocumentPicker.pick({
                type: [
                    DocumentPicker.types.pdf, // file .pdf
                    DocumentPicker.types.plainText, // file .txt
                    DocumentPicker.types.audio, // file .mp3
                    DocumentPicker.types.csv, // file .xls, .xlsx
                    DocumentPicker.types.zip, // file .zip
                    DocumentPicker.types.images, // file .png .jpg
                    DocumentPicker.types.xls,
                    DocumentPicker.types.xlsx,
                    DocumentPicker.types.doc,
                    DocumentPicker.types.docx,
                    DocumentPicker.types.ppt,
                    DocumentPicker.types.pptx,
                ],
            });

            if (result.size / this.oneMB <= MAX_SIZE) {
                this.file = result;
                const destPath = `${RNFS.TemporaryDirectoryPath}/${result.name}`;
                if (!(await RNFS.exists(destPath))) {
                    await RNFS.copyFile(result.uri, destPath);
                } else {
                    console.log('BLAH DOES NOT EXIST');
                }
                let type = result.type.split('/');
                this.filePickerUri = destPath;
                this.firstMessageType = messageType.FILE_MESSAGE;
                this.fileType = messageType.FILE_MESSAGE;
                if (type[0] == 'image') {
                    this.firstMessageType = messageType.IMAGE_MESSAGE;
                    this.fileType = messageType.IMAGE_MESSAGE;
                    this.objectImages = '';
                    this.imagesMessage = [];
                    this.imagesMessage.push({
                        image: destPath,
                    });
                }
                if (!Utils.isNull(this.conversationId)) {
                    this.uploadImageStepByStep();
                } else {
                    this.firstMessageType = messageType.FILE_MESSAGE;
                    this.props.createConversation({
                        memberChatId: this.memberChatId,
                        typeMessage: messageType.FILE_MESSAGE,
                    });
                }
            } else if (result.size === 0) {
                this.showMessage('File gửi không được rỗng');
            } else {
                this.showMessage('File có kích thước lớn hơn 10MB');
            }
        } catch (err) {
            this.saveException(err, 'onAttachFile');
        }
    };
}

const mapStateToProps = state => ({
    data: state.chat.data,
    isLoading: state.chat.isLoading,
    error: state.chat.error,
    errorCode: state.chat.errorCode,
    action: state.chat.action,
});

const mapDispatchToProps = {
    ...actions,
    ...commonActions,
    ...shopActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatView);
