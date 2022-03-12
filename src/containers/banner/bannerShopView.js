import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import * as bannerActions from 'actions/bannerActions';
import FlatListCustom from 'components/flatListCustom';
import { ErrorCode } from 'config/errorCode';
import BaseView from 'containers/base/baseView';
import ScreenType from 'enum/screenType';
import statusType from 'enum/statusType';
import ic_add_banner_white from 'images/ic_add_banner_white.png';
import ic_filter_orange from 'images/ic_filter_orange.png';
import { Container, Root, Text } from 'native-base';
import React from 'react';
import { Image, RefreshControl, TouchableOpacity, View } from 'react-native';
import {
    Menu,
    MenuOption,
    MenuOptions,
    MenuTrigger,
} from 'react-native-popup-menu';
import { connect } from 'react-redux';
import commonStyles from 'styles/commonStyles';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import ItemBannerShop from './itemBannerShop';
import styles from './styles';

class BannerShopView extends BaseView {
    constructor(props) {
        super(props);
        this.state = {
            userId: null,
            enableLoadMore: false,
            enableRefresh: true,
            isLoadingMore: false,
            refreshing: false,
            currentMenu: null,
        };
        const { shopId } = this.props.route.params;
        this.shopId = shopId;
        this.filter = {
            status: null,
            paging: {
                pageSize: Constants.PAGE_SIZE,
                page: 0,
            },
            shopId: shopId,
        };
        this.bannerMenuOptions = [
            {
                name: 'Tất cả',
                value: null,
            },
            {
                name: 'Đang chờ duyệt',
                value: statusType.DRAFT,
            },
            {
                name: 'Đã duyệt',
                value: statusType.ACTIVE,
            },
            {
                name: 'Bị từ chối',
                value: statusType.SUSPENDED,
            },
            {
                name: 'Đã xóa',
                value: statusType.DELETE,
            },
        ];
        this.listBanner = [];
        this.showNoData = false;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
            this.handleData();
        }
    }

    /**
     * Handle data when request
     */
    handleData() {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                this.state.refreshing = false;
                this.state.isLoadingMore = false;
                if (
                    this.props.action ==
                    getActionSuccess(ActionEvent.GET_BANNER_SHOP)
                ) {
                    if (!Utils.isNull(data)) {
                        if (data.paging.page == 0) {
                            this.listBanner = [];
                        }
                        this.state.enableLoadMore = !(
                            data.data.length < Constants.PAGE_SIZE
                        );
                        if (data.data.length > 0) {
                            data.data.forEach(item => {
                                this.listBanner.push({ ...item });
                            });
                        }
                    }
                    this.showNoData = true;
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    async componentDidMount() {
        super.componentDidMount();
        await this.getSourceUrlPath();
        this.handleRequest();
    }

    /**
     * onRefreshing
     */
    handleRefresh = () => {
        this.filter.paging.page = 0;
        this.showNoData = false;
        this.listBanner = [];
        this.handleRequest();
    };

    /**
     * Get more banner shop
     */
    getMoreBannerShop = () => {
        if (!this.props.isLoading) {
            this.state.isLoadingMore = true;
            this.filter.paging.page += 1;
            this.handleRequest();
        }
    };

    /**
     * Handle request
     */
    handleRequest = () => {
        this.props.getBannerShop(this.filter);
    };

    /**Render view */
    render() {
        return (
            <Container style={styles.container}>
                <Root>
                    <View style={{ flexGrow: 1 }}>
                        {this.renderHeaderView({
                            title: 'Banner quảng cáo',
                            renderRightMenu: this.renderRightMenu,
                        })}
                        <FlatListCustom
                            contentContainerStyle={{
                                paddingVertical: Constants.PADDING8,
                            }}
                            style={{
                                flex: 1,
                                // backgroundColor: Colors.COLOR_WHITE,
                            }}
                            data={this.listBanner}
                            renderItem={this.renderItemBanner}
                            enableLoadMore={this.state.enableLoadMore}
                            enableRefresh={this.state.enableRefresh}
                            keyExtractor={item => item.code}
                            onLoadMore={() => {
                                this.getMoreBannerShop();
                            }}
                            showsVerticalScrollIndicator={false}
                            refreshControl={
                                <RefreshControl
                                    progressViewOffset={
                                        Constants.HEIGHT_HEADER_OFFSET_REFRESH
                                    }
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.handleRefresh}
                                />
                            }
                            isShowEmpty={this.showNoData}
                            isShowImageEmpty={true}
                            textForEmpty={'Chưa có banner nào'}
                            styleEmpty={{
                                marginTop: Constants.MARGIN8,
                            }}
                        />
                        {this.renderButtonCreateBanner()}
                        {this.state.isLoadingMore || this.state.refreshing
                            ? null
                            : this.showLoadingBar(this.props.isLoading)}
                    </View>
                </Root>
            </Container>
        );
    }

    /**
     * Render right menu
     */
    renderRightMenu = () => {
        const { enableDelete, isSearch } = this.state;
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                style={{
                    padding: Constants.PADDING8,
                }}
                onPress={() => {
                    this.menuOption.open();
                }}
            >
                <Image source={ic_filter_orange} />
                {this.renderBannerOption()}
            </TouchableOpacity>
        );
    };

    /**
     * Render button create banner
     */
    renderButtonCreateBanner = () => {
        return (
            <TouchableOpacity
                activeOpacity={Constants.ACTIVE_OPACITY}
                onPress={() => {
                    this.props.navigation.navigate('EditBanner', {
                        shopId: this.shopId,
                        screenType: ScreenType.FROM_CREATE_BANNER_SHOP,
                        callback: this.handleRefresh,
                    });
                }}
                style={styles.buttonCreate}
            >
                <Image source={ic_add_banner_white} />
            </TouchableOpacity>
        );
    };

    /**
     * Render banner option
     */
    renderBannerOption = () => {
        const { currentMenu } = this.state;
        return (
            <Menu
                style={{
                    marginLeft: Constants.MARGIN16,
                }}
                ref={ref => (this.menuOption = ref)}
            >
                <MenuTrigger text="" />
                <MenuOptions>
                    {this.bannerMenuOptions.map(item => {
                        return (
                            <MenuOption
                                onSelect={() => {
                                    this.setState({ currentMenu: item.value });
                                    this.filter.status = item.value;
                                    this.handleRefresh();
                                }}
                            >
                                <View
                                    style={[
                                        commonStyles.viewHorizontal,
                                        {
                                            alignItems: 'center',
                                            marginLeft: Constants.MARGIN16,
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            commonStyles.textMedium,
                                            {
                                                margin: 0,
                                                paddingVertical:
                                                    Constants.PADDING8,
                                                color:
                                                    currentMenu === item.value
                                                        ? Colors.COLOR_PRIMARY
                                                        : Colors.COLOR_TEXT,
                                            },
                                        ]}
                                    >
                                        {item.name}
                                    </Text>
                                </View>
                            </MenuOption>
                        );
                    })}
                </MenuOptions>
            </Menu>
        );
    };

    /**
     * Go banner detail
     */
    gotoBannerDetail = data => {
        this.props.navigation.navigate('EditBanner', {
            shopId: this.shopId,
            bannerId: data.id,
            screenType: ScreenType.FROM_DETAIL_BANNER_SHOP,
            callback: this.handleRefresh,
        });
    };

    /**
     * render Item Banner
     */
    renderItemBanner = (item, index, parentIndex, indexInParent) => {
        return (
            <ItemBannerShop
                data={item}
                index={index}
                onPressDetail={this.gotoBannerDetail}
                urlPathResize={this.resourceUrlPathResize.textValue}
                urlPath={this.resourceUrlPath.textValue}
            />
        );
    };
}

const mapStateToProps = state => ({
    data: state.banner.data,
    isLoading: state.banner.isLoading,
    error: state.banner.error,
    errorCode: state.banner.errorCode,
    action: state.banner.action,
});

const mapDispatchToProps = {
    ...bannerActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(BannerShopView);
