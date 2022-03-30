import database from '@react-native-firebase/database';
import ImageLoader from 'components/imageLoader';
import VideoPlayer from 'components/videoPlayer';
import ImageDefaultType from 'enum/imageDefaultType';
import messageType from 'enum/messageType';
import ResourceType from 'enum/resourceType';
import ic_delete_grey from 'images/ic_delete_grey.png';
import React,{ PureComponent } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import commonStyles from 'styles/commonStyles';
import DateUtil from 'utils/dateUtil';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import { Fonts } from 'values/fonts';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const PADDING_BUTTON = Constants.PADDING16 - 4;
const WIDTH_HEIGHT_AVATAR = 48;

class ItemListChat extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            unseen: 0,
            lastMessage: {},
            deleted: false,
        };
    }

    UNSAFE_componentWillReceiveProps = nextProps => {
        if (nextProps != this.props) {
            this.props = nextProps;
            this.getUnseen();
            this.getLastMessage();
            this.getDeleted();
        }
    };

    /**
     * Get unseen
     */
    getUnseen = () => {
        const { item, userId } = this.props;
        database()
            .ref(
                `members/c${item.conversationId}/u${userId}/number_of_unseen_messages`,
            )
            .on('value', unseen => {
                if (Utils.isNull(unseen.val())) {
                    this.setState({
                        unseen: 0,
                    });
                } else {
                    this.setState({
                        unseen: unseen.val(),
                    });
                }
            });
    };

    /**
     * Get last message
     */
    getLastMessage = () => {
        const { item, userId } = this.props;
        database()
            .ref(
                `chats_by_user/u${userId}/_conversation/c${item.conversationId}`,
            )
            .on('value', lastMessage => {
                if (Utils.isNull(lastMessage.val())) {
                    this.setState({
                        lastMessage: {},
                    });
                } else {
                    this.setState({
                        lastMessage: lastMessage.val().last_messages,
                    });
                }
            });
    };

    /**
     * Get deleted
     */
    getDeleted = () => {
        const { item, userId } = this.props;
        database()
            .ref(`conversation/c${item.conversationId}/deleted`)
            .on('value', deleted => {
                if (Utils.isNull(deleted.val())) {
                    this.setState({
                        deleted: false,
                    });
                } else {
                    this.setState({
                        deleted: deleted.val(),
                    });
                }
            });
    };

    componentDidMount() {
        this.getUnseen();
        this.getLastMessage();
        this.getDeleted();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
            if (nextProps.isPressDelete) {
                this.scrollView.scrollTo({ x: 50 });
            } else {
                this.scrollView.scrollTo({ x: 0 });
            }
        }
    }

    render() {
        const {
            data,
            item,
            index,
            onPressItemChat,
            onPressDeleteItem,
            resourcePathResize,
            resourcePath,
        } = this.props;
        let parseItem = {
            lastMessage: !Utils.isNull(this.state.lastMessage)
                ? this.state.lastMessage.message_type ==
                  messageType.NORMAL_MESSAGE
                    ? this.state.lastMessage.content
                    : !Utils.isNull(this.state.lastMessage.message_type) &&
                      this.handleTypeContent(
                          this.state.lastMessage.message_type,
                      )
                : '',
            updatedAt: !Utils.isNull(this.state.lastMessage)
                ? this.state.lastMessage.timestamp
                : DateUtil.getTimestamp(),
            nameUserChat: item.shop ? item.shop.name : item.name,
            avatar: item.shop
                ? !Utils.isNull(item.shop.avatarPath)
                    ? item.shop.avatarPath
                    : ''
                : !Utils.isNull(item.avatarPath)
                ? item.avatarPath
                : '',
            unseen: this.state.unseen,
            avatarType:
                item.shop && !Utils.isNull(item.shop.avatarType)
                    ? item.shop.avatarType
                    : null,
        };
        const HEIGHT_NOT_SEEN = 20;
        const WIDTH__NOT_SEEN =
            Utils.getLength(parseInt(parseItem.unseen)) < 2 ? 20 : 28;
        const date = new Date(parseInt(parseItem.updatedAt));
        this.hours = date.getHours();
        this.minutes = date.getMinutes();
        this.seconds = date.getSeconds();
        this.year = date.getFullYear();
        this.month = date.getMonth() + 1;
        this.day = date.getDate();
        this.time =
            this.day +
            '/' +
            this.month +
            '/' +
            this.year +
            ' ' +
            this.hours +
            ':' +
            this.minutes +
            ':' +
            this.seconds;
        let marginBottom = Constants.MARGIN8;
        if (index == data.length - 1) {
            marginBottom = Constants.MARGIN16;
        }
        const styleText =
            parseItem.unseen == 0 ? commonStyles.text : commonStyles.textBold;
        let isSocial = !Utils.isNull(parseItem.avatar)
            ? parseItem.avatar.indexOf('http') != -1
                ? true
                : false
            : false;
        let avatarMemberChat = isSocial
            ? parseItem.avatar
            : resourcePathResize +
              '=' +
              parseItem.avatar +
              `&op=resize&w=${Math.floor(width)}`;
        let avatarVideo = isSocial
            ? parseItem.avatar
            : resourcePath + '/' + parseItem.avatar;
        return (
            <ScrollView
                onScroll={event => {
                    global.positionX = event.nativeEvent.contentOffset.x;
                }}
                ref={ref => (this.scrollView = ref)}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                    {
                        marginVertical: Constants.MARGIN,
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                ]}
                horizontal={true}
                style={{ flex: 1, flexDirection: 'row' }}
            >
                <TouchableOpacity
                    style={{ flex: 1, width: width }}
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    onPress={() => onPressItemChat()}
                >
                    <View
                        style={[
                            commonStyles.viewHorizontal,
                            {
                                marginHorizontal: Constants.MARGIN16,
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                            },
                        ]}
                    >
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                            }}
                        >
                            <View style={{ paddingVertical: Constants.MARGIN }}>
                                {parseItem.avatarType == ResourceType.VIDEO ? (
                                    <VideoPlayer
                                        style={{
                                            width: WIDTH_HEIGHT_AVATAR,
                                            height: WIDTH_HEIGHT_AVATAR,
                                            borderRadius:
                                                WIDTH_HEIGHT_AVATAR / 2,
                                        }}
                                        videoStyle={{
                                            width: WIDTH_HEIGHT_AVATAR,
                                            height: WIDTH_HEIGHT_AVATAR,
                                            borderRadius:
                                                WIDTH_HEIGHT_AVATAR / 2,
                                        }}
                                        source={{ uri: avatarVideo }}
                                        resizeMode="cover"
                                        paused={false}
                                        muted={true}
                                        repeat={true}
                                        showOnStart={false}
                                        disableTitle={true}
                                        disableFullscreen={true}
                                        disableTimer={true}
                                        disableSeekbar={true}
                                        disablePlayPause={true}
                                        disableVignette={true}
                                    />
                                ) : (
                                    <ImageLoader
                                        style={{
                                            width: WIDTH_HEIGHT_AVATAR,
                                            height: WIDTH_HEIGHT_AVATAR,
                                            borderRadius:
                                                WIDTH_HEIGHT_AVATAR / 2,
                                        }}
                                        resizeAtt={
                                            isSocial
                                                ? null
                                                : {
                                                      type: 'resize',
                                                      WIDTH_HEIGHT_AVATAR,
                                                  }
                                        }
                                        resizeModeType={'cover'}
                                        path={avatarMemberChat}
                                        imageDefaultType={
                                            ImageDefaultType.AVATAR
                                        }
                                    />
                                )}
                                {parseItem.unseen > 0 ? (
                                    <View
                                        style={{
                                            height: HEIGHT_NOT_SEEN,
                                            width: WIDTH__NOT_SEEN,
                                            backgroundColor: Colors.COLOR_RED,
                                            borderRadius: WIDTH__NOT_SEEN / 2,
                                            ...commonStyles.viewCenter,
                                            position: 'absolute',
                                            top: 0,
                                            right: 0,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                ...commonStyles.textSmall,
                                                color: 'white',
                                                margin: 0,
                                            }}
                                        >
                                            {parseItem.unseen}
                                        </Text>
                                    </View>
                                ) : null}
                            </View>
                            <View style={{ flexDirection: 'row', flex: 1 }}>
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'flex-start',
                                        marginLeft: Constants.MARGIN16,
                                    }}
                                >
                                    <View style={commonStyles.viewHorizontal}>
                                        <Text
                                            numberOfLines={1}
                                            style={[
                                                commonStyles.text,
                                                {
                                                    margin: 0,
                                                    flex: 1,
                                                },
                                            ]}
                                        >
                                            {parseItem.nameUserChat
                                                ? parseItem.nameUserChat.trim()
                                                : ''}
                                        </Text>
                                        <Text
                                            style={[
                                                commonStyles.text,
                                                {
                                                    alignSelf: 'flex-start',
                                                    flexDirection: 'column',
                                                    margin: 0,
                                                    fontSize:
                                                        Fonts.FONT_SIZE_XX_SMALL,
                                                    opacity: 0.6,
                                                },
                                            ]}
                                        >
                                            {DateUtil.timeAgo(
                                                DateUtil.convertFromFormatToFormat(
                                                    this.time,
                                                    DateUtil.FORMAT_DATE_TIME_SQL,
                                                    DateUtil.FORMAT_DATE_TIME_ZONE_T,
                                                ),
                                            )}
                                        </Text>
                                    </View>
                                    <View style={commonStyles.viewSpaceBetween}>
                                        <Text
                                            numberOfLines={2}
                                            style={[
                                                styleText,
                                                {
                                                    flex: 1,
                                                    fontSize:
                                                        Fonts.FONT_SIZE_XX_SMALL,
                                                    margin: 0,
                                                },
                                            ]}
                                        >
                                            {parseItem.lastMessage}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ padding: Constants.PADDING8 }}
                    onPress={() => {
                        this.scrollView.scrollTo({ x: 0 });
                        onPressDeleteItem();
                    }}
                    activeOpacity={Constants.ACTIVE_OPACITY}
                >
                    <Image source={ic_delete_grey} />
                </TouchableOpacity>
            </ScrollView>
        );
    }

    handleTypeContent = type => {
        switch (type) {
            case messageType.IMAGE_MESSAGE:
                return '[Hình ảnh]';
            case messageType.FILE_MESSAGE:
                return '[File]';
            default:
                return '';
        }
    };
}

const styles = StyleSheet.create({
    name: {
        borderRadius: Constants.CORNER_RADIUS,
        margin: 0,
        padding: Constants.PADDING8,
        backgroundColor: Colors.COLOR_WHITE,
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
});

export default ItemListChat;
