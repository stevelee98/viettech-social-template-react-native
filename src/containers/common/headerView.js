import ImageLoader from 'components/imageLoader';
import ic_back_green from 'images/ic_back_green.png';
import ic_cart_white from 'images/ic_cart_white.png';
import ic_chat_white from 'images/ic_chat_white.png';
import ic_menu_home_white from 'images/ic_menu_home_white.png';
import ic_notification_white from 'images/ic_notification_white.png';
import ic_share_white from 'images/ic_share_white.png';
import { Text } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    Animated,
    Image,
    Keyboard,
    Platform,
    StatusBar,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import commonStyles from 'styles/commonStyles';
import StringUtil from 'utils/stringUtil';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import ChatUnseenIcon from './chatUnseenIcon';
import IconQuantityCart from './iconQuantityCart';

const PADDING = 6;
class HeaderView extends Component {
    static propTypes = {
        //Title
        title: PropTypes.string.isRequired,
        //Handle to be called:
        //when user pressed back button
        onBack: PropTypes.func,
        //Called when countdown time has been finished
        onFinishCountDown: PropTypes.func,
        //Called when extra time has been finished
        onTick: PropTypes.func,
        titleStyle: PropTypes.object,
        isReady: PropTypes.bool,
        visibleBack: PropTypes.bool,
        visibleCart: PropTypes.bool,
        visibleChat: PropTypes.bool,
        visibleNotification: PropTypes.bool,
        visibleAccount: PropTypes.bool,
        visibleSearchBar: PropTypes.bool,
        stageSize: PropTypes.number,
        initialIndex: PropTypes.number,
        barStyle: PropTypes.string,
        barBackground: PropTypes.string,
        barTranslucent: PropTypes.bool,
        backColor: PropTypes.string,
    };

    static defaultProps = {
        onFinishCountDown: null,
        onFinishExtraTime: null,
        isReady: true,
        onTick: null,
        visibleBack: false,
        visibleCart: false,
        visibleChat: false,
        visibleNotification: false,
        visibleAccount: false,
        visibleSearchBar: false,
        onBack: null,
        stageSize: 4,
        initialIndex: 0,
        titleStyle: null,
        barStyle: 'light-content',
        barBackground: Colors.COLOR_TRANSPARENT,
        barTranslucent: true,
        backColor: 'black',
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            title,
            onBack,
            onRefresh,
            onGrid,
            renderRightMenu,
            renderLeftMenu,
            renderMidMenu,
            barBackground,
            barTranslucent,
            visibleDark,
            barStyle,
            titleCenter,
            efHeaderTitle,
            gradient = false,
        } = this.props;
        return (
            <>
                <View style={styles.headerBody}>
                    {this.props.visibleBack && this.renderBack()}
                    {!StringUtil.isNullOrEmpty(title) && this.renderTitle()}
                    {renderLeftMenu && renderLeftMenu()}
                    {this.props.visibleAccount && this.renderAccount()}
                    {this.props.visibleSearchBar && this.renderSearchBar()}
                    {renderMidMenu && renderMidMenu()}
                    {this.props.visibleShare && this.renderShare()}
                    {this.props.visibleChat && this.renderChat()}
                    {this.props.visibleCart && this.renderCart()}
                    {this.props.visibleMenu && this.renderMenu()}
                    {this.props.visibleNotification &&
                        this.renderNotification()}
                    {renderRightMenu && renderRightMenu()}
                    <StatusBar
                        animated={true}
                        backgroundColor={barBackground}
                        barStyle={barStyle} // dark-content, light-content and default
                        hidden={false} //To hide statusBar
                        translucent={barTranslucent} //allowing light, but not detailed shapes
                    />
                </View>
            </>
        );
    }

    /// render title
    renderTitle = () => {
        const { title, titleCenter, efHeaderTitle } = this.props;
        return (
            <View style={[styles.title, titleCenter && styles.titleCenter]}>
                <Animated.Text
                    numberOfLines={1}
                    style={[
                        commonStyles.title,
                        this.props.titleStyle,
                        efHeaderTitle && { color: efHeaderTitle },
                    ]}
                >
                    {title}
                </Animated.Text>
            </View>
        );
    };

    onTimeElapsed = () => {
        if (this.props.onFinishCountDown) this.props.onFinishCountDown();
    };

    /**
     * Render back button
     */
    renderBack() {
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={[
                    {
                        marginRight: Constants.MARGIN,
                    },
                ]}
                onPress={() => {
                    if (this.props.onBack) this.props.onBack();
                }}
            >
                {this.renderIconAnimated(
                    Utils.isNull(this.props.iconBack)
                        ? ic_back_green
                        : this.props.iconBack,
                )}
            </TouchableOpacity>
        );
    }

    /**
     * Render cart
     */
    renderCart() {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (this.props.showCart) this.props.showCart();
                }}
            >
                {this.renderIconAnimated(ic_cart_white)}
                <IconQuantityCart />
            </TouchableOpacity>
        );
    }

    renderAccount() {
        const { user, userName, gotoLogin, source } = this.props;
        console.log('RENDER HOME VIEW1', source);
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                onPress={this.props.gotoLogin}
                style={styles.user}
            >
                <ImageLoader
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        position: 'relative',
                    }}
                    resizeModeType={'cover'}
                    path={!Utils.isNull(source) ? source : null}
                />
                {!Utils.isNull(userName) ? (
                    <View>
                        <Text
                            style={[
                                commonStyles.text,
                                { marginLeft: Constants.MARGIN8 },
                            ]}
                        >
                            {userName}
                        </Text>
                    </View>
                ) : null}
            </TouchableOpacity>
        );
    }

    /**
     * Render notification button
     */
    renderNotification() {
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={[
                    {
                        padding: PADDING,
                        marginRight: Constants.MARGIN,
                    },
                ]}
                onPress={this.props.gotoNotification}
            >
                <Image source={ic_notification_white} />
            </TouchableOpacity>
        );
    }

    /**
     * Render menu button
     */
    renderMenu() {
        const { gotoMenu } = this.props;
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={[
                    {
                        padding: Constants.MARGIN,
                    },
                ]}
                onPress={this.props.gotoMenu}
            >
                {this.renderIconAnimated(ic_menu_home_white)}
                {this.props.menuOptionButton}
            </TouchableOpacity>
        );
    }

    /**
     * Render notification button
     */
    renderChat() {
        const { quantityChat } = this.props;
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={[
                    {
                        marginRight: Constants.MARGIN,
                    },
                ]}
                onPress={this.props.gotoChatList}
            >
                {this.renderIconAnimated(ic_chat_white)}
                <ChatUnseenIcon top={0} right={0} />
            </TouchableOpacity>
        );
    }

    /**
     * Render share button
     */
    renderShare() {
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={[
                    {
                        marginRight: Constants.MARGIN,
                    },
                ]}
                onPress={this.props.gotoShare}
            >
                {this.renderIconAnimated(ic_share_white)}
            </TouchableOpacity>
        );
    }

    /**
     * Render timer count down
     */
    renderSearchBar() {
        return (
            <View style={[styles.searchBar, this.props.styleSearch]}>
                {!Utils.isNull(this.props.iconLeftSearch) ? (
                    <TouchableOpacity
                        style={{
                            paddingLeft: PADDING,
                        }}
                        onPress={() => {
                            this.props.onPressLeftSearch &&
                                this.props.onPressLeftSearch();
                        }}
                    >
                        <Image
                            style={{ aspectRatio: 0.8, resizeMode: 'contain' }}
                            source={this.props.iconLeftSearch}
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
                        if (this.props.onTouchStart) {
                            this.props.onTouchStart(); // with editable = fals
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
                        placeholder={this.props.placeholder}
                        placeholderTextColor={Colors.COLOR_TEXT_LIGHT}
                        ref={ref => {
                            if (this.props.onRef) this.props.onRef(ref);
                        }}
                        value={this.props.inputSearch}
                        onChangeText={this.props.onChangeTextInput}
                        onSubmitEditing={() => {
                            this.props.onSubmitEditing();
                            Keyboard.dismiss();
                        }}
                        pointerEvents={
                            this.props.onTouchStart ? 'none' : 'auto'
                        }
                        keyboardType="default"
                        underlineColorAndroid="transparent"
                        returnKeyType={'search'}
                        blurOnSubmit={false}
                        autoCorrect={false}
                        autoFocus={this.props.autoFocus}
                        editable={this.props.editable}
                    />
                </TouchableOpacity>
                {/*Right button*/}
                {!Utils.isNull(this.props.iconRightSearch) ? (
                    <TouchableOpacity
                        style={{
                            paddingRight: PADDING,
                        }}
                        onPress={() => {
                            this.props.onPressRightSearch &&
                                this.props.onPressRightSearch();
                        }}
                    >
                        <Image source={this.props.iconRightSearch} />
                    </TouchableOpacity>
                ) : null}
            </View>
        );
    }

    /**
     * Render icon animated
     * @param {*} source
     */
    renderIconAnimated = source => {
        const { bgHeaderIcon } = this.props;
        return (
            <Animated.View
                style={[
                    styles.iconAnimated,
                    {
                        backgroundColor: bgHeaderIcon
                            ? bgHeaderIcon
                            : Colors.COLOR_TRANSPARENT,
                    },
                ]}
            >
                <Image source={source} />
            </Animated.View>
        );
    };
}

const styles = {
    headerBody: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    title: {
        flex: 1,
        alignItems: 'flex-start',
        paddingBottom: 0.5,
    },

    titleCenter: {
        position: 'absolute',
        alignItems: 'center',
        left: 40,
        right: 40,
    },

    whiteIcon: {
        color: Colors.COLOR_WHITE,
    },

    dotStage: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: Colors.COLOR_WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    barStage: {
        width: 10,
        height: 5,
        backgroundColor: Colors.COLOR_WHITE,
    },
    user: {
        ...commonStyles.shadowOffset,
        alignItems: 'center',
        flexDirection: 'row',
        padding: Constants.PADDING8 + Constants.PADDING,
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
        padding: 6,
    },
    quantityNumber: {
        color: Colors.COLOR_WHITE,
        padding: 0,
        margin: 0,
    },
};

export default HeaderView;
