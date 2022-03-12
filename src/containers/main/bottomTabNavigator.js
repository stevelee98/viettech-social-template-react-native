import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import * as commonActions from 'actions/commonActions';
import * as shopActions from 'actions/shopActions';
import * as userActions from 'actions/userActions';
import TabBarCustom from 'components/tabBarCustom';
import { ErrorCode } from 'config/errorCode';
import HomeView from 'containers/home/homeView';
import NotificationTabView from 'containers/notification/tab/notificationTabView';
import ProductListView from 'containers/product/list/productListView';
import GeneralShopView from 'containers/shop/general/generalShopView';
import UserProfileView from 'containers/user/profile/userProfileView';
import ProductType from 'enum/productType';
import ScreenType from 'enum/screenType';
import ic_home_gray from 'images/ic_home_gray.png';
import ic_home_green from 'images/ic_home_green.png';
import ic_notification_gray from 'images/ic_notification_gray.png';
import ic_notification_green from 'images/ic_notification_green.png';
import ic_store_gray from 'images/ic_store_gray.png';
import ic_store_green from 'images/ic_store_green.png';
import ic_tag_gray from 'images/ic_tag_gray.png';
import ic_tag_green from 'images/ic_tag_green.png';
import ic_user_gray from 'images/ic_user_gray.png';
import ic_user_green from 'images/ic_user_green.png';
// Import screens
import { localizes } from 'locales/i18n';
import * as React from 'react';
import { connect } from 'react-redux';
import StringUtil from 'utils/stringUtil';

const Tab = createBottomTabNavigator();
const usePrevious = value => {
    const ref = React.useRef();
    React.useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

/**
 * Bottom Tab Navigator
 * @param {*} props
 */
const BottomTabNavigator = props => {
    const { params } = props.route;
    const [shop, setShop] = React.useState(null);
    const prevDataProps = usePrevious(props.data);
    const badgeCount = usePrevious(props.badgeCount);
    let loginParams = {
        name: '',
        params: {},
    };

    React.useEffect(() => {
        // componentDidMount
    }, []);

    React.useEffect(() => {
        if (prevDataProps !== props.data) {
            handleData();
        }
    });

    /**
     * Handle data when request
     */
    const handleData = () => {
        let data = props.data;
        if (props.errorCode != ErrorCode.ERROR_INIT) {
            if (props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (
                    props.action == getActionSuccess(ActionEvent.GET_SHOP_OWNER)
                ) {
                    setShop(data);
                    global.shopInfo = data;
                }
            }
        }
    };

    /**
     * Go to login screen
     */
    const showLogin = ({ name }, params) => {
        loginParams.name = name;
        loginParams.params = params;
        props.navigation.navigate('Login', {
            router: loginParams,
        });
    };

    return (
        <Tab.Navigator
            initialRouteName={'TabHome'}
            backBehavior={'initialRoute'}
            lazy={true}
            tabBar={props => <TabBarCustom {...props} />}
        >
            <Tab.Screen
                name="TabHome"
                component={HomeView}
                options={{
                    title: localizes('home'),
                    icon: ic_home_gray,
                    iconActive: ic_home_green,
                }}
            />
            <Tab.Screen
                name="TabDeal"
                component={ProductListView}
                options={{
                    title: "Today's deals",
                    icon: ic_tag_gray,
                    iconActive: ic_tag_green,
                    params: {
                        type: ProductType.TODAY_DEAL,
                    },
                }}
            />
            <Tab.Screen
                name="TabShop"
                component={GeneralShopView}
                options={{
                    title: localizes('sale'),
                    icon: ic_store_gray,
                    iconActive: ic_store_green,
                    params: {
                        shopId: shop ? shop.id : null,
                        screenType: ScreenType.FROM_MAIN,
                    },
                }}
                listeners={({ navigation, route }) => ({
                    tabPress: e => {
                        // Prevent default action
                        if (StringUtil.isNullOrEmpty(global.token)) {
                            e.preventDefault();
                            showLogin(route);
                        }
                    },
                })}
            />
            <Tab.Screen
                name="TabNotification"
                component={NotificationTabView}
                options={{
                    title: localizes('notification'),
                    icon: ic_notification_gray,
                    iconActive: ic_notification_green,
                    tabBarBadge: badgeCount,
                }}
                listeners={({ navigation, route }) => ({
                    tabPress: e => {
                        // Prevent default action
                        // if (StringUtil.isNullOrEmpty(global.token)) {
                        // e.preventDefault();
                        // showLogin(route);
                        // }
                    },
                })}
            />
            <Tab.Screen
                name="TabUserProfile"
                component={UserProfileView}
                options={{
                    title: localizes('profile'),
                    icon: ic_user_gray,
                    iconActive: ic_user_green,
                }}
                listeners={({ navigation, route }) => ({
                    tabPress: e => {
                        // Prevent default action
                        if (StringUtil.isNullOrEmpty(global.token)) {
                            // e.preventDefault();
                            // showLogin(route);
                        }
                    },
                })}
            />
        </Tab.Navigator>
    );
};

const mapStateToProps = state => ({
    badgeCount: state.bottomTabNavigator.badgeCount,
    data: state.bottomTabNavigator.data,
    isLoading: state.bottomTabNavigator.isLoading,
    errorCode: state.bottomTabNavigator.errorCode,
    action: state.bottomTabNavigator.action,
});

const mapDispatchToProps = {
    ...userActions,
    ...commonActions,
    ...shopActions,
};

export default connect(mapStateToProps, mapDispatchToProps)(BottomTabNavigator);
