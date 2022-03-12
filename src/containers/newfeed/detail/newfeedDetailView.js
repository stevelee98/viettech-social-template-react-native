import { useNavigation, useRoute } from '@react-navigation/native';
import HeaderCustom from 'components/headerCustom';
import Hr from 'components/hr';
import ImageLoader from 'components/imageLoader';
import Loading from 'components/loading';
import languageCode from 'enum/languageCode';
import ic_comment_black from 'images/ic_comment_black.png';
import ic_like_black from 'images/ic_like_black.png';
import ic_like_green from 'images/ic_like_green.png';
import ic_more_black from 'images/ic_more_black.png';
import ic_share_black from 'images/ic_share_black.png';
import { localizes } from 'locales/i18n';
import React, { useEffect, useRef, useState } from 'react';
import {
    Image,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from 'react-native';
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
} from 'react-native-popup-menu';
import commonStyles from 'styles/commonStyles';
import DateUtil from 'utils/dateUtil';
import StringUtil from 'utils/stringUtil';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import ModalComment from './comments/modalComment';
import NewfeedResources from './newdeedResources';
import styles from './styles';

const NewfeedDetailView = props => {
    const params = useRoute().params;
    const { id, callback, handleLike, detail } = params;
    const [enableLoadMore, setEnableLoadMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const [liked, setLiked] = useState(false);
    const modalImageViewer = useRef();
    const modalComment = useRef();
    const menuOptionRef = useRef();
    const navigation = useNavigation();
    const menuOption = [
        {
            name: localizes('report'),
            value: 1,
        },
    ];

    useEffect(() => {
        setTimeout(() => {
            setData(detail);
            setIsLoading(false);
            setLiked(detail.liked);
        }, 1000);
    }, []);

    const handleRefresh = () => {};

    const showImage = () => {
        modalImageViewer.current.showModal();
    };

    const renderAuthor = () => {
        return (
            <View style={styles.author}>
                <ImageLoader
                    path={Utils.isNull(data) ? '' : data.user?.avatar}
                    style={styles.avatar}
                />
                <View style={styles.authorInfo}>
                    <Text numberOfLines={5}>
                        <Text style={commonStyles.textBold}>
                            {Utils.isNull(data) ? '' : data.user?.name}
                        </Text>
                    </Text>
                    <Text style={styles.timeCreate}>
                        {Utils.isNull(data)
                            ? ''
                            : DateUtil.timePostNewfeed(data.createdAt)}
                    </Text>
                </View>
                <Pressable
                    onPress={() => {
                        menuOptionRef.current.open();
                    }}
                    android_ripple={Constants.ANDROID_RIPPLE_2}
                    style={styles.btnMenu}
                >
                    <Image source={ic_more_black} />
                </Pressable>
                <Menu
                    style={{
                        backgroundColor: Colors.COLOR_WHITE,
                    }}
                    ref={menuOptionRef}
                >
                    <MenuTrigger text="" />
                    <MenuOptions>
                        {menuOption &&
                            menuOption.map((item, index) => {
                                return (
                                    <MenuOption
                                        key={index}
                                        style={{
                                            backgroundColor: Colors.COLOR_WHITE,
                                        }}
                                        onSelect={() => {}}
                                    >
                                        <View
                                            style={{
                                                padding: Constants.PADDING8,
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    ...commonStyles.text,
                                                    color: Colors.COLOR_RED,
                                                }}
                                            >
                                                {item.name}
                                            </Text>
                                        </View>
                                    </MenuOption>
                                );
                            })}
                    </MenuOptions>
                </Menu>
            </View>
        );
    };

    const renderContentPost = () => {
        return (
            <View style={styles.content}>
                <Text style={commonStyles.text}>
                    {Utils.isNull(data) ? '-' : data.content}
                </Text>
            </View>
        );
    };

    const renderButton = () => {
        return (
            <View style={styles.btnContainer}>
                {renderButtonLike()}
                {renderButtonComment()}
                {renderButtonShare()}
            </View>
        );
    };

    const renderButtonLike = () => {
        return (
            <Pressable
                android_ripple={Constants.ANDROID_RIPPLE}
                onPress={() => {
                    setLiked(!liked);
                }}
                style={styles.btnLike}
            >
                <Image source={liked ? ic_like_green : ic_like_black} />
                <Text style={styles.txtLike}>
                    {Utils.isNull(data)
                        ? '-'
                        : StringUtil.formatNumber(data.numOfLike)}
                </Text>
            </Pressable>
        );
    };

    const renderButtonComment = () => {
        return (
            <Pressable
                onPress={() => {
                    modalComment.current.showModal();
                }}
                android_ripple={Constants.ANDROID_RIPPLE}
                style={styles.btnComment}
            >
                <Image source={ic_comment_black} />
                <Text style={styles.txtComment}>
                    {Utils.isNull(data)
                        ? '-'
                        : StringUtil.formatNumber(data.numOfComment)}
                </Text>
            </Pressable>
        );
    };

    const renderButtonShare = () => {
        return (
            <Pressable
                android_ripple={Constants.ANDROID_RIPPLE}
                onPress={() => {}}
                style={styles.btnShare}
            >
                <Image source={ic_share_black} />
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <HeaderCustom
                title={
                    Utils.isNull(data)
                        ? ''
                        : global.languageCode == languageCode.vi
                        ? `${localizes('post_of')}${data.user?.name}`
                        : `${data.user?.name}'s post`
                }
                titleStyle={commonStyles.textMediumBold}
                visibleBack={true}
                onBack={() => {
                    navigation.goBack();
                }}
            />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentStyles}
                style={{
                    flexGrow: 1,
                }}
                enableRefresh={true}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            >
                {!Utils.isNull(data) && (
                    <View
                        style={{
                            backgroundColor: Colors.COLOR_WHITE,
                            paddingTop: Constants.PADDING12,
                        }}
                    >
                        {renderAuthor()}
                        {renderContentPost()}
                        <Hr />
                        {renderButton()}
                    </View>
                )}
                {!Utils.isNull(data) && (
                    <NewfeedResources
                        onPressItem={showImage}
                        images={data.resource}
                    />
                )}
            </ScrollView>
            <ModalComment
                ref={modalComment}
                totalLike={data?.numOfLike}
                totalComment={data?.numOfComment}
            />
            <Loading visible={!refreshing && isLoading} />
        </View>
    );
};

export default NewfeedDetailView;
