import FlatListCustom from 'components/flatListCustom';
import ImageLoader from 'components/imageLoader';
import ImageDefaultType from 'enum/imageDefaultType';
import messageType from 'enum/messageType';
import ic_document_red from 'images/ic_document_red.png';
import ic_download_grey from 'images/ic_download_grey.png';
import React,{ PureComponent } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import * as Progress from 'react-native-progress';
import commonStyles from 'styles/commonStyles';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import { Fonts } from 'values/fonts';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const PADDING_BUTTON = Constants.PADDING16 - 4;

class ItemChat extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
        };
        this.imageUrls = [];
        this.W_H_SPECIAL = 36;
        this.actionValue = {
            WAITING_FOR_USER_ACTION: 0,
            ACCEPTED: 1,
            DENIED: 2,
        };
        this.maxImage = 4;
    }

    UNSAFE_componentWillReceiveProps = nextProps => {
        if (this.props != nextProps) {
            this.props = nextProps;
            this.setState({
                progress: nextProps.progress,
            });
        }
    };

    /**
     * Open modal display images
     */
    toggleModal() {
        this.setState({
            isModalOpened: !this.state.isModalOpened,
        });
    }

    render() {
        const { data, index, userAdminId, onPressSendAction, resourceUrlPath } =
            this.props;
        let parseItem = {
            conversationId: data.conversationId,
            key: data.key,
            from: data.fromUserId,
            content: data.message,
            createdAt: data.timestamp,
            isShowAvatar: data.isShowAvatar,
            isShowDate: data.isShowDate,
            avatar: !Utils.isNull(data.avatar) ? data.avatar : '',
            messageType: data.messageType,
            receiverResourceAction: data.receiverResourceAction,
            tokenImage: data.tokenImage,
            sending: data.sending,
            isDownload: data.isDownload,
            downloaded: data.downloaded,
            openPathDownloaded: data.openPathDownloaded,
        };
        const date = new Date(parseInt(parseItem.createdAt));
        this.hours = date.getHours();
        this.minutes = date.getMinutes();
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1;
        this.day = date.getDate();
        this.imageUrls = [];
        if (parseItem.messageType == messageType.IMAGE_MESSAGE) {
            String(parseItem.content)
                .split(',')
                .forEach(pathImage => {
                    this.imageUrls.push({
                        path:
                            resourceUrlPath +
                            '/' +
                            pathImage +
                            '?token=' +
                            parseItem.tokenImage,
                    });
                });
        } else if (parseItem.messageType == messageType.FILE_MESSAGE) {
            let file = parseItem.content.split(',');
            this.pathFile = file[0];
            this.nameFile = file[1];
            this.typeFile = file[2];
            this.sizeFile = file[3];
        }
        return (
            <View style={{ flex: 1, paddingHorizontal: Constants.PADDING8 }}>
                {parseItem.isShowDate ? (
                    <View
                        style={{
                            alignItems: 'center',
                            marginVertical: Constants.MARGIN8,
                        }}
                    >
                        <Text style={[commonStyles.textSmall]}>
                            {this.day < 10 ? `0${this.day}` : this.day}/
                            {this.month < 10 ? `0${this.month}` : this.month}/
                            {this.year}
                        </Text>
                    </View>
                ) : null}
                {parseItem.messageType == messageType.NORMAL_MESSAGE &&
                    this.renderItemChat(parseItem)}
                {parseItem.messageType == messageType.IMAGE_MESSAGE &&
                    this.renderListImage(parseItem)}
                {parseItem.messageType == messageType.FILE_MESSAGE &&
                    this.renderFile(parseItem)}
            </View>
        );
    }

    /**
     * Render file
     */
    renderFile = parseItem => {
        const { data, openFile } = this.props;
        return (
            <View
                style={[
                    commonStyles.viewHorizontal,
                    {
                        flex: 0,
                        marginBottom: Constants.MARGIN8,
                        justifyContent:
                            parseItem.from !== this.props.userId
                                ? 'flex-start'
                                : 'flex-end',
                        alignItems: 'center',
                    },
                ]}
            >
                <View
                    style={[
                        commonStyles.viewHorizontal,
                        { flex: 0, alignItems: 'flex-end' },
                    ]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.gotoMemberInfo();
                        }}
                    >
                        {this.renderAvatar(parseItem)}
                    </TouchableOpacity>
                    <View
                        style={[
                            parseItem.from !== this.props.userId
                                ? styles.member
                                : styles.userFile,
                        ]}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Image source={ic_document_red} />
                            <Text
                                numberOfLines={1}
                                style={[
                                    commonStyles.text,
                                    {
                                        fontSize: Fonts.FONT16,
                                        maxWidth: width * 0.3,
                                        color:
                                            parseItem.from !== this.props.userId
                                                ? Colors.COLOR_TEXT
                                                : Colors.COLOR_WHITE,
                                        marginBottom: 0,
                                        marginTop: 0,
                                    },
                                ]}
                            >
                                {this.nameFile}
                            </Text>
                            <TouchableOpacity
                                disabled={parseItem.downloaded}
                                style={{
                                    marginHorizontal: Constants.MARGIN8,
                                }}
                                onPress={() => {
                                    this.state.progress = 0;
                                    this.props.downloadFile(
                                        data,
                                        this.pathFile,
                                        this.typeFile,
                                        this.nameFile,
                                    );
                                }}
                            >
                                {/* {!isDownload ? <Image source={ic_download_grey} /> : <ActivityIndicator size="small" color= {Colors.COLOR_WHITE} />}  */}
                                {!parseItem.isDownload ? (
                                    <Image source={ic_download_grey} />
                                ) : parseItem.downloaded ? (
                                    <Text
                                        style={
                                            parseItem.from !== this.props.userId
                                                ? styles.openFileMember
                                                : styles.openFile
                                        }
                                        onPress={() =>
                                            openFile(
                                                parseItem.openPathDownloaded,
                                                this.typeFile,
                                            )
                                        }
                                    >
                                        Mở
                                    </Text>
                                ) : (
                                    <Progress.Circle
                                        color={Colors.COLOR_BLUE_LIGHT}
                                        style={styles.progress}
                                        progress={this.state.progress}
                                        size={30}
                                        indeterminate={false}
                                        showsText={true}
                                    />
                                )}
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                style={[
                                    commonStyles.textSmall,
                                    {
                                        color:
                                            parseItem.from !== this.props.userId
                                                ? Colors.COLOR_GRAY
                                                : Colors.COLOR_WHITE,
                                        fontSize: Fonts.FONT_SIZE_X_SMALL,
                                        marginBottom: 0,
                                    },
                                ]}
                            >
                                {this.hours < 10
                                    ? `0${this.hours}`
                                    : this.hours}
                                :
                                {this.minutes < 10
                                    ? `0${this.minutes}`
                                    : this.minutes}
                            </Text>
                            <View style={styles.dots} />
                            <Text
                                style={[
                                    commonStyles.text,
                                    {
                                        color:
                                            parseItem.from !== this.props.userId
                                                ? Colors.COLOR_GRAY
                                                : Colors.COLOR_WHITE,
                                        fontSize: Fonts.FONT_SIZE_X_SMALL,
                                        marginBottom: 0,
                                    },
                                ]}
                            >
                                {this.sizeFile}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    /**
     * Render list image
     */
    renderListImage = parseItem => {
        return (
            <View
                style={[
                    {
                        flex: 1,
                        marginBottom: Constants.MARGIN8,
                    },
                ]}
            >
                <View
                    style={[
                        commonStyles.viewHorizontal,
                        {
                            justifyContent:
                                parseItem.from !== this.props.userId
                                    ? 'flex-start'
                                    : 'flex-end',
                            alignItems: 'flex-end',
                        },
                    ]}
                >
                    {this.renderAvatar(parseItem)}
                    <FlatListCustom
                        contentContainerStyle={{ flex: 1 }}
                        style={{ width: (width / 4) * 2 }}
                        horizontal={false}
                        data={this.imageUrls}
                        itemPerRow={2}
                        renderItem={this.renderItemImage}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
                {parseItem.from == this.props.userAdminId &&
                    this.renderAcceptImage(parseItem)}
            </View>
        );
    };

    /**
     * Render accept image
     */
    renderAcceptImage = parseItem => {
        return (
            <View
                style={[
                    commonStyles.viewHorizontal,
                    {
                        flex: 0,
                        borderRadius: Constants.CORNER_RADIUS,
                        backgroundColor: Colors.COLOR_WHITE,
                    },
                ]}
            >
                {/* {
                    Utils.isNull(parseItem.receiverResourceAction) || parseItem.receiverResourceAction == this.actionValue.WAITING_FOR_USER_ACTION ?
                        <View style={[commonStyles.viewHorizontal, { flex: 0 }]} >
                            <TouchableOpacity
                                onPress={() => {
                                    onPressSendAction(this.actionValue.DENIED, parseItem.conversationId, parseItem.key)
                                }}
                                style={[styles.buttonSpecial, {
                                    borderBottomRightRadius: 0,
                                    borderTopRightRadius: 0
                                }]}>
                                <Text style={commonStyles.text} >TỪ CHỐI</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    onPressSendAction(this.actionValue.ACCEPTED, parseItem.conversationId, parseItem.key)
                                }}
                                style={[styles.buttonSpecial, {
                                    borderBottomLeftRadius: 0,
                                    borderTopLeftRadius: 0
                                }]}>
                                <Text style={commonStyles.text} >ÐỒNG Ý</Text>
                            </TouchableOpacity>
                        </View>
                        : <View>
                            {
                                parseItem.receiverResourceAction === this.actionValue.DENIED ?
                                    <Text style={[commonStyles.textSmall, { marginVertical: Constants.MARGIN8 }]} >BẠN ÐÃ TỪ CHỐI</Text>
                                    : <Text style={[commonStyles.textSmall, { marginVertical: Constants.MARGIN8 }]} >BẠN ÐÃ ÐỒNG Ý</Text>
                            }
                        </View>
                } */}
            </View>
        );
    };

    /**
     * Render item chat
     */
    renderItemChat = parseItem => {
        return (
            <View
                style={[
                    commonStyles.viewHorizontal,
                    {
                        flex: 0,
                        marginBottom: Constants.MARGIN8,
                        justifyContent:
                            parseItem.from !== this.props.userId
                                ? 'flex-start'
                                : 'flex-end',
                        alignItems: 'center',
                    },
                ]}
            >
                {/* {
                    parseItem.sending == 0
                        ? <Text style={[commonStyles.textSmall, { color: Colors.COLOR_DRK_GREY }]} >Đang gửi...</Text>
                        : null
                } */}
                <View
                    style={[
                        commonStyles.viewHorizontal,
                        { flex: 0, alignItems: 'flex-end' },
                    ]}
                >
                    <TouchableOpacity
                        onPress={() => {
                            this.gotoMemberInfo();
                        }}
                    >
                        {this.renderAvatar(parseItem)}
                    </TouchableOpacity>
                    <View
                        style={[
                            parseItem.from !== this.props.userId
                                ? styles.member
                                : styles.user,
                        ]}
                    >
                        <Text
                            style={[
                                commonStyles.text,
                                {
                                    fontSize: Fonts.FONT16,
                                    maxWidth: width * 0.65,
                                    color:
                                        parseItem.from !== this.props.userId
                                            ? Colors.COLOR_TEXT
                                            : Colors.COLOR_WHITE,
                                    marginBottom: 0,
                                    marginTop: 0,
                                },
                            ]}
                        >
                            {parseItem.content}
                        </Text>
                        <Text
                            style={[
                                commonStyles.textSmall,
                                {
                                    color:
                                        parseItem.from !== this.props.userId
                                            ? Colors.COLOR_GRAY
                                            : Colors.COLOR_WHITE,
                                    fontSize: Fonts.FONT_SIZE_X_SMALL,
                                    marginBottom: 0,
                                },
                            ]}
                        >
                            {this.hours < 10 ? `0${this.hours}` : this.hours}:
                            {this.minutes < 10
                                ? `0${this.minutes}`
                                : this.minutes}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    /**
     * Render avatar
     */
    renderAvatar = parseItem => {
        const { resourceUrlPath } = this.props;
        let hasHttp =
            !Utils.isNull(parseItem.avatar) &&
            parseItem.avatar.indexOf('http') != -1;
        let image = hasHttp
            ? parseItem.avatar
            : resourceUrlPath + '/' + parseItem.avatar;
        return (
            <View>
                {parseItem.from !== this.props.userId &&
                parseItem.isShowAvatar ? (
                    <View
                        style={{
                            width: this.W_H_SPECIAL,
                            height: this.W_H_SPECIAL,
                            borderRadius: this.W_H_SPECIAL / 2,
                            overflow: 'hidden',
                            marginRight: Constants.MARGIN8,
                        }}
                    >
                        <ImageLoader
                            style={{
                                width: this.W_H_SPECIAL,
                                height: this.W_H_SPECIAL,
                                borderRadius: this.W_H_SPECIAL / 2,
                            }}
                            resizeModeType={'cover'}
                            path={image}
                            imageDefaultType={ImageDefaultType.AVATAR}
                        />
                    </View>
                ) : null}
                {!parseItem.isShowAvatar ? (
                    <View
                        style={{
                            width: this.W_H_SPECIAL,
                            height: this.W_H_SPECIAL,
                            marginRight: Constants.MARGIN8,
                        }}
                    >
                        <Text style={{ color: 'transparent' }}>a</Text>
                    </View>
                ) : null}
            </View>
        );
    };

    /**
     * Render item flat list
     */
    renderItemImage = (item, index, parentIndex, indexInParent) => {
        const { onPressImage } = this.props;
        let numMoreImage = this.imageUrls.length - this.maxImage;
        return (
            index < 4 && (
                <View style={{ position: 'relative' }}>
                    <TouchableOpacity
                        onPress={() => onPressImage(this.imageUrls, index)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            ...this.getStyleImage(index),
                        }}
                    >
                        <ImageLoader
                            style={[this.getStyleImage(index)]}
                            resizeModeType={'cover'}
                            path={item.path}
                        />
                        {numMoreImage > 0 && index == this.maxImage - 1 && (
                            <View style={styles.moreImage}>
                                <Text style={styles.numMore}>
                                    +{numMoreImage}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            )
        );
    };

    /**
     * Get style image
     */
    getStyleImage = index => {
        let length = this.imageUrls.length;
        if (length == 1) {
            return styles.imageChatOdd;
        } else if (length == 2 || length >= 4) {
            return styles.imageChat;
        } else if (length == 3) {
            if (index == 2) {
                return styles.imageChatOdd;
            } else {
                return styles.imageChat;
            }
        }
    };

    /**
     * Go to member info
     */
    gotoMemberInfo = () => {
        let { seller } = this.props;
        //If seller is not user then go to shop info
        if (seller && !seller.userType) {
            this.props.navigation.navigate('ShopIntro', {
                shopId: this.props.seller.id,
            });
        }
    };
}

const styles = StyleSheet.create({
    user: {
        margin: 0,
        padding: Constants.PADDING8,
        backgroundColor: Colors.COLOR_PRIMARY,
        borderBottomLeftRadius: Constants.CORNER_RADIUS,
        borderTopLeftRadius: Constants.CORNER_RADIUS,
        borderTopRightRadius: Constants.CORNER_RADIUS,
    },
    userFile: {
        margin: 0,
        padding: Constants.PADDING8,
        backgroundColor: Colors.COLOR_PRIMARY_LIGHT,
        borderBottomLeftRadius: Constants.CORNER_RADIUS,
        borderTopLeftRadius: Constants.CORNER_RADIUS,
        borderTopRightRadius: Constants.CORNER_RADIUS,
    },
    member: {
        margin: 0,
        padding: Constants.PADDING8,
        backgroundColor: Colors.COLOR_WHITE,
        borderBottomRightRadius: Constants.CORNER_RADIUS,
        borderTopLeftRadius: Constants.CORNER_RADIUS,
        borderTopRightRadius: Constants.CORNER_RADIUS,
    },
    memberFile: {
        margin: 0,
        padding: Constants.PADDING8,
        backgroundColor: Colors.COLOR_WHITE,
        borderColor: Colors.COLOR_PRIMARY_LIGHT,
        borderWidth: Constants.BORDER_WIDTH,
        borderBottomRightRadius: Constants.CORNER_RADIUS,
        borderTopLeftRadius: Constants.CORNER_RADIUS,
        borderTopRightRadius: Constants.CORNER_RADIUS,
    },
    image: {
        backgroundColor: Colors.COLOR_WHITE,
        borderRadius: Constants.CORNER_RADIUS,
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight: Constants.PADDING16,
    },
    buttonSpecial: {
        paddingHorizontal: Constants.PADDING16,
        paddingVertical: Constants.PADDING8,
    },
    imageChat: {
        width: width / 4,
        height: ((width / 4) * 2) / 3,
        borderWidth: Constants.BORDER_WIDTH,
        borderColor: Colors.COLOR_BACKGROUND,
    },
    imageChatOdd: {
        width: width / 2,
        height: ((width / 2) * 2) / 3,
        borderWidth: Constants.BORDER_WIDTH,
        borderColor: Colors.COLOR_BACKGROUND,
    },
    moreImage: {
        ...commonStyles.viewCenter,
        backgroundColor: Colors.COLOR_PLACEHOLDER_TEXT_DISABLE,
        position: 'absolute',
        top: 1,
        right: 1,
        left: 1,
        bottom: 1,
    },
    numMore: {
        ...commonStyles.text,
        color: Colors.COLOR_WHITE,
    },
    dots: {
        width: 4,
        height: 4,
        backgroundColor: Colors.COLOR_BACKGROUND,
        borderRadius: Constants.BORDER_RADIUS,
        margin: Constants.MARGIN / 2,
        marginTop: 8,
    },
    progress: {
        margin: 2,
    },
    openFile: {
        ...commonStyles.textMedium,
        margin: 0,
        padding: Constants.PADDING,
        paddingLeft: Constants.PADDING + 2,
        borderWidth: Constants.BORDER_WIDTH,
        borderRadius: Constants.CORNER_RADIUS,
        borderColor: Colors.COLOR_WHITE,
        color: Colors.COLOR_WHITE,
    },
    openFileMember: {
        ...commonStyles.textMedium,
        margin: 0,
        padding: Constants.PADDING,
        paddingLeft: Constants.PADDING + 2,
        borderWidth: Constants.BORDER_WIDTH,
        borderRadius: Constants.CORNER_RADIUS,
        borderColor: Colors.COLOR_PRIMARY,
        color: Colors.COLOR_PRIMARY,
    },
});

export default ItemChat;
