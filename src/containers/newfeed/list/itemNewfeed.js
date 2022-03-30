import ImageLoader from 'components/imageLoader';
import ic_comment_black from 'images/ic_comment_black.png';
import ic_like_black from 'images/ic_like_black.png';
import ic_like_green from 'images/ic_like_green.png';
import ic_share_black from 'images/ic_share_black.png';
import ViewMoreText from 'lib/react-native-view-more-text';
import { localizes } from 'locales/i18n';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import commonStyles from 'styles/commonStyles';
import DateUtil from 'utils/dateUtil';
import StringUtil from 'utils/stringUtil';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import { Fonts } from 'values/fonts';

const MARGIN_RESOURCE = 4;
const MAX_RESOURCE = 5;

const ItemNewfeed = props => {
    const { item, index, length, onPress, gotoUser } = props;
    const [width, setWidth] = useState(Constants.MAX_WIDTH - 12);
    const [liked, setLiked] = useState(item.liked);
    const [numOfLike, setNumOfLike] = useState(item.numOfLike);
    const [isCollapsed, setCollapsed] = useState(true);
    const [videoPaused, setVideoPaused] = useState(true);
    const rViewMoreText = React.createRef();

    useEffect(() => {
        setLiked(item.liked);
        setNumOfLike(item.numOfLike);
    }, []);

    const renderContent = () => {
        return (
            <View style={styles.viewContent}>
                <ViewMoreText
                    ref={rViewMoreText}
                    numberOfLines={6}
                    renderViewMore={renderViewMore}
                    renderViewLess={renderViewLess}
                    textStyle={styles.viewMoreText}
                >
                    {item.content}
                </ViewMoreText>
            </View>
        );
    };

    const renderViewMore = onPress => {
        return (
            <Pressable
                android_ripple={Constants.ANDROID_RIPPLE}
                onPress={() => {
                    onPress();
                }}
            >
                <Text style={styles.txtViewMore}>{localizes('seeMore')}</Text>
            </Pressable>
        );
    };

    const renderViewLess = onPress => {
        return (
            <Pressable
                android_ripple={Constants.ANDROID_RIPPLE}
                onPress={onPress}
            >
                <Text style={styles.hideText}>{localizes('hide')}</Text>
            </Pressable>
        );
    };

    const renderTopItem = () => {
        return (
            <View style={styles.topItem}>
                <Pressable
                    style={{ padding: 2 }}
                    android_ripple={Constants.ANDROID_RIPPLE}
                    onPress={() => {
                        gotoUser(user.id);
                    }}
                >
                    <ImageLoader path={user.avatar} style={styles.avatar} />
                </Pressable>
                <View style={styles.contentTop}>
                    <Text
                        numberOfLines={2}
                        onPress={() => {
                            gotoUser(user.id);
                        }}
                        style={commonStyles.textBold}
                    >
                        {user.name}
                    </Text>
                    <Text style={styles.time}>
                        {DateUtil.timePostNewfeed(item.createdAt)}
                    </Text>
                </View>
            </View>
        );
    };

    const renderButton = () => {
        return (
            <View style={styles.buttonView}>
                {renderButtonLike()}
                {renderButtonComment()}
                {renderButtonShare()}
            </View>
        );
    };

    const renderButtonLike = () => {
        return (
            <View style={styles.btnContainer}>
                <Pressable
                    android_ripple={Constants.ANDROID_RIPPLE}
                    onPress={() => {
                        setLiked(!liked);
                    }}
                    style={{ padding: 2 }}
                >
                    <Image source={liked ? ic_like_green : ic_like_black} />
                </Pressable>
                <Text style={styles.number}>
                    {!Utils.isNull(numOfLike) &&
                        StringUtil.formatNumber(numOfLike)}
                </Text>
            </View>
        );
    };

    const renderButtonComment = () => {
        return (
            <View style={styles.btnContainer}>
                <Pressable
                    android_ripple={Constants.ANDROID_RIPPLE}
                    onPress={() => {
                        onPress(item);
                    }}
                    style={{ padding: 2 }}
                >
                    <Image source={ic_comment_black} />
                </Pressable>
                <Text style={styles.number}>
                    {!Utils.isNull(item.numOfComment) &&
                        StringUtil.formatNumber(item.numOfComment)}
                </Text>
            </View>
        );
    };

    const renderButtonShare = () => {
        return (
            <View style={{ alignItems: 'center' }}>
                <Pressable
                    android_ripple={Constants.ANDROID_RIPPLE}
                    onPress={() => {}}
                    style={{ padding: 2 }}
                >
                    <Image source={ic_share_black} />
                </Pressable>
            </View>
        );
    };

    const renderResource = () => {
        const lengthResources = item.resource.length;
        const numMoreResource = lengthResources - MAX_RESOURCE;
        return (
            !Utils.isNull(item.resource) && (
                <View style={styles.resourceView}>
                    {item.resource.map((resource, indexRes) => {
                        return (
                            indexRes < MAX_RESOURCE && (
                                <View
                                    key={indexRes.toString()}
                                    style={{ position: 'relative' }}
                                >
                                    <ImageLoader
                                        resizeModeType={'cover'}
                                        path={resource.url}
                                        style={[
                                            styles.resource,
                                            {
                                                width: handleWidth(indexRes),
                                                height: handleHeight(indexRes),
                                            },
                                        ]}
                                    />
                                    {numMoreResource > 0 &&
                                        indexRes == MAX_RESOURCE - 1 && (
                                            <View style={styles.viewMore}>
                                                <View
                                                    style={styles.moreResource}
                                                />
                                                <Text style={styles.numMore}>
                                                    +{numMoreResource}
                                                </Text>
                                            </View>
                                        )}
                                    <Pressable
                                        android_ripple={{
                                            color: 'rgba(255, 255, 255, 0.1)',
                                            borderless: false,
                                        }}
                                        style={{
                                            ...styles.resource,
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: handleWidth(indexRes),
                                            height: handleHeight(indexRes),
                                        }}
                                        onPress={() => {
                                            onPress(item);
                                        }}
                                    />
                                </View>
                            )
                        );
                    })}
                </View>
            )
        );
    };

    const handleWidth = i => {
        let length = !Utils.isNull(item.resource) ? item.resource.length : 0;
        if (length >= 5) {
            if (i == 0 || i == 1) {
                return width / 2 - MARGIN_RESOURCE;
            } else {
                return (
                    width / 3 -
                    (MARGIN_RESOURCE * 2 - (MARGIN_RESOURCE * 2) / 3)
                );
            }
        } else if (length == 4) {
            return width / 2 - MARGIN_RESOURCE;
        } else if (length == 3) {
            if (i == 0) {
                return width;
            } else {
                return width / 2 - MARGIN_RESOURCE;
            }
        } else if (length == 2) {
            return width / 2 - MARGIN_RESOURCE;
        } else if (length == 1) {
            return width;
        }
    };

    const handleHeight = i => {
        let length = !Utils.isNull(item.resource) ? item.resource.length : 0;
        if (length >= 5) {
            if (i == 0 || i == 1) {
                return width / 2 - MARGIN_RESOURCE;
            } else {
                return (
                    width / 3 -
                    (MARGIN_RESOURCE * 2 - (MARGIN_RESOURCE * 2) / 3)
                );
            }
        } else if (length == 4) {
            return width / 2 - MARGIN_RESOURCE;
        } else if (length == 3) {
            return width / 2 - MARGIN_RESOURCE;
        } else if (length == 2) {
            return width / 2 - MARGIN_RESOURCE;
        } else if (length == 1) {
            return width;
        }
    };

    return (
        <View key={'item_newfeed' + index} style={[styles.container]}>
            {renderTopItem()}
            {renderContent()}
            {renderResource()}
            {renderButton()}
        </View>
    );
};

const styles = {
    viewContent: {
        marginHorizontal: Constants.MARGIN12,
        marginBottom: Constants.MARGIN12,
    },
    avatar: {
        borderRadius: Constants.AVATAR_SIZE,
        height: Constants.AVATAR_SIZE,
        width: Constants.AVATAR_SIZE,
    },
    container: {
        backgroundColor: Colors.COLOR_WHITE,
        paddingVertical: Constants.PADDING8,
    },
    content: {
        paddingLeft: Constants.PADDING8,
        paddingTop: Constants.PADDING8,
    },
    moreResource: {
        backgroundColor: Colors.COLOR_BLACK_OPACITY_50,
        borderRadius: Constants.CORNER_RADIUS * 2,
        bottom: 1,
        flex: 1,
        left: 1,
        opacity: 0.5,
        position: 'absolute',
        right: 1,
        top: 1,
    },
    numMore: {
        ...commonStyles.text,
        bottom: 0,
        color: Colors.COLOR_WHITE,
        fontSize: Fonts.FONT18,
        left: 0,
        position: 'absolute',
        right: 0,
        textAlign: 'center',
        textAlignVertical: 'center',
        top: 0,
    },
    resource: {
        borderRadius: Constants.CORNER_RADIUS * 2,
        margin: MARGIN_RESOURCE,
    },
    viewMore: {
        alignItems: 'center',
        bottom: 0,
        flex: 1,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    viewMoreText: {
        ...commonStyles.text,
        textAlign: 'left',
        marginHorizontal: 0,
    },
    txtViewMore: {
        ...commonStyles.text,
        opacity: 0.6,
        marginHorizontal: 0,
    },
    hideText: { ...commonStyles.text, opacity: 0.6, marginHorizontal: 0 },
    topItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginHorizontal: Constants.MARGIN16,
        marginBottom: Constants.MARGIN8,
    },
    contentTop: {
        marginLeft: Constants.MARGIN8,
        flex: 1,
        justifyContent: 'flex-start',
    },
    userName: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    tag: {
        ...commonStyles.text,
        fontSize: Fonts.FONT12,
    },
    time: { ...commonStyles.text, fontSize: Fonts.FONT12 },
    buttonView: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginHorizontal: Constants.MARGIN16,
    },
    btnContainer: { flexDirection: 'row', alignItems: 'center' },
    number: { ...commonStyles.textXSmall, marginLeft: 8, marginTop: 4 },
    resourceView: {
        // margin: -MARGIN_RESOURCE,
        marginBottom: Constants.MARGIN8,
        position: 'relative',
        marginHorizontal: 2,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
};

export default React.memo(ItemNewfeed);
