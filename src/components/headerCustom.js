import { useNavigation } from '@react-navigation/native';
import ImageLoader from 'components/imageLoader';
import ic_back_green from 'images/ic_back_green.png';
import ic_back_white from 'images/ic_back_white.png';
import ic_bell_black from 'images/ic_bell_black.png';
import ic_menu_home_white from 'images/ic_menu_home_white.png';
import ic_share_white from 'images/ic_share_white.png';
import logo_text from 'images/logo_text.png';
import React from 'react';
import {
    Animated,
    Image,
    Keyboard,
    Platform,
    Pressable,
    StatusBar,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import commonStyles from 'styles/commonStyles';
import StringUtil from 'utils/stringUtil';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';

const PADDING = 6;
const HeaderCustom = props => {
    const {
        title,
        titleCenter,
        onBack,
        efHeaderTitle,
        backgroundColor = Colors.COLOR_WHITE,
        iconBack,
        bgHeaderIcon,
        titleStyle,
        user,
        gotoProfile,
        gotoNotification,
        gotoMenu,
        menuOptionButton,
        gotoShare,
        styleSearch,
        iconLeftSearch,
        onPressLeftSearch,
        renderLeftMenu,
        onTouchStart,
        placeholder,
        onRef,
        searchText,
        onChangeSearch,
        onSubmit,
        editable,
        autoFocus,
        iconRightSearch,
        onPressRightSearch,
        searchBar,
        visibleBack = true,
        renderMidMenu,
        visibleShare,
        visibleMenu,
        visibleNotification,
        renderRightMenu,
        barBackground = 'transparent',
        visibleLogo,
    } = props;

    /// render title
    const renderTitle = () => {
        return (
            <View style={styles.title}>
                <Animated.Text
                    numberOfLines={1}
                    style={[
                        commonStyles.textMediumBold,
                        titleStyle,
                        efHeaderTitle && { color: efHeaderTitle },
                    ]}
                >
                    {title}
                </Animated.Text>
            </View>
        );
    };

    /// Render back button
    const renderBack = () => {
        let icon = Utils.isNull(iconBack)
            ? !Utils.isNull(backgroundColor) &&
              backgroundColor != Colors.COLOR_WHITE
                ? ic_back_white
                : ic_back_green
            : iconBack;
        return (
            <Pressable
                android_ripple={Constants.ANDROID_RIPPLE}
                style={{
                    marginRight: Constants.MARGIN,
                }}
                onPress={() => {
                    if (onBack) onBack();
                    else useNavigation().goBack();
                }}
            >
                {renderIconAnimated(icon)}
            </Pressable>
        );
    };

    const renderAccount = () => {
        return (
            <Pressable
                android_ripple={Constants.ANDROID_RIPPLE}
                onPress={gotoProfile}
                style={styles.user}
            >
                <ImageLoader
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 32,
                        position: 'relative',
                    }}
                    path={user?.avatar}
                />
            </Pressable>
        );
    };

    const renderNotification = () => {
        return (
            <Pressable
                android_ripple={Constants.ANDROID_RIPPLE}
                style={{
                    padding: Constants.PADDING,
                    marginRight: Constants.MARGIN12,
                }}
                onPress={gotoNotification}
            >
                <Image source={ic_bell_black} />
                <View
                    style={{
                        backgroundColor: 'red',
                        width: 6,
                        height: 6,
                        borderRadius: 6,
                        position: 'absolute',
                        right: 8,
                        top: 0,
                    }}
                />
            </Pressable>
        );
    };

    const renderMenu = () => {
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={{ marginLeft: Constants.MARGIN16 }}
                onPress={gotoMenu}
            >
                {renderIconAnimated(ic_menu_home_white)}
                {menuOptionButton}
            </TouchableOpacity>
        );
    };

    // render share
    const renderShare = () => {
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={{
                    marginHorizontal: Constants.MARGIN8,
                }}
                onPress={gotoShare}
            >
                {renderIconAnimated(ic_share_white)}
            </TouchableOpacity>
        );
    };

    /// render search bar
    const renderSearchBar = () => {
        return (
            <View style={[styles.searchBar, styleSearch]}>
                {!Utils.isNull(iconLeftSearch) ? (
                    <TouchableOpacity
                        style={{
                            paddingLeft: PADDING,
                        }}
                        onPress={() => {
                            onPressLeftSearch && onPressLeftSearch();
                        }}
                    >
                        <Image
                            style={{ aspectRatio: 0.8, resizeMode: 'contain' }}
                            source={iconLeftSearch}
                        />
                    </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    style={[
                        commonStyles.viewHorizontal,
                        commonStyles.viewCenter,
                    ]}
                    onPress={() => {
                        if (onTouchStart) {
                            onTouchStart(); // with editable = fals
                        }
                    }}
                >
                    <TextInput
                        style={[
                            commonStyles.textMedium,
                            {
                                margin: 0,
                                borderRadius: 0,
                                flex: 1,
                                paddingHorizontal: Constants.PADDING16,
                                color: Colors.COLOR_TEXT,
                            },
                            {
                                paddingVertical:
                                    Platform.OS === 'android'
                                        ? 0
                                        : Constants.PADDING8,
                            },
                        ]}
                        placeholder={placeholder}
                        placeholderTextColor={Colors.COLOR_TEXT_LIGHT}
                        ref={ref => {
                            if (onRef) onRef(ref);
                        }}
                        value={searchText}
                        onChangeText={onChangeSearch}
                        onSubmitEditing={() => {
                            onSubmit && onSubmit();
                            Keyboard.dismiss();
                        }}
                        pointerEvents={onTouchStart ? 'none' : 'auto'}
                        keyboardType="default"
                        underlineColorAndroid="transparent"
                        returnKeyType={'search'}
                        blurOnSubmit={false}
                        autoCorrect={false}
                        autoFocus={autoFocus}
                        editable={editable}
                    />
                </TouchableOpacity>
                {!Utils.isNull(iconRightSearch) ? (
                    <TouchableOpacity
                        style={{
                            paddingRight: PADDING,
                        }}
                        onPress={() => {
                            onPressRightSearch && onPressRightSearch();
                        }}
                    >
                        <Image source={iconRightSearch} />
                    </TouchableOpacity>
                ) : null}
            </View>
        );
    };

    /// Render icon animated
    const renderIconAnimated = source => {
        return (
            <Animated.View
                style={{
                    ...styles.iconAnimated,
                    backgroundColor: bgHeaderIcon
                        ? bgHeaderIcon
                        : Colors.COLOR_TRANSPARENT,
                }}
            >
                <Image source={source} />
            </Animated.View>
        );
    };

    const renderLogo = () => {
        return (
            <View style={{ flex: 1 }}>
                <Image
                    style={{ width: 124, resizeMode: 'contain' }}
                    source={logo_text}
                />
            </View>
        );
    };

    return (
        <View
            style={{ ...styles.headerBody, backgroundColor: backgroundColor }}
        >
            <View
                style={{
                    height: Utils.getStatusBarHeight(),
                    width: '100%',
                }}
            />
            <View
                style={{
                    flexGrow: 1,
                    alignItems: 'center',
                    flexDirection: 'row',
                }}
            >
                {visibleBack && renderBack()}
                {visibleLogo && renderLogo()}
                {!StringUtil.isNullOrEmpty(title) && renderTitle()}
                {renderLeftMenu && renderLeftMenu()}
                {visibleNotification && renderNotification()}
                {user && renderAccount()}
                {searchBar && renderSearchBar()}
                {renderMidMenu && renderMidMenu()}
                {visibleShare && renderShare()}
                {visibleMenu && renderMenu()}
                {renderRightMenu && renderRightMenu()}
            </View>
            <StatusBar
                animated={true}
                backgroundColor={barBackground}
                barStyle={'light-content'}
                hidden={false}
                translucent={true}
            />
        </View>
    );
};

const styles = {
    headerBody: {
        height: 56 + Utils.getStatusBarHeight(),
        width: Constants.MAX_WIDTH,
        paddingHorizontal: Constants.PADDING8,
    },
    title: {
        flex: 1,
        alignItems: 'flex-start',
    },
    user: {
        alignItems: 'center',
        padding: Constants.PADDING,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: Constants.CORNER_RADIUS,
        padding: Constants.PADDING,
        backgroundColor: Colors.COLOR_WHITE,
        marginHorizontal: PADDING,
    },
    iconAnimated: {
        borderRadius: Constants.BORDER_RADIUS,
        padding: 8,
    },
};

export default HeaderCustom;
