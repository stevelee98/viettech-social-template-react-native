import { useNavigation } from '@react-navigation/native';
import HeaderCustom from 'components/headerCustom';
import ImageLoader from 'components/imageLoader';
import Loading from 'components/loading';
import ListNewfeed from 'containers/newfeed/list/listNewfeed';
import { localizes } from 'locales/i18n';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import commonStyles from 'styles/commonStyles';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import fakeData from './fakeData';
import styles from './styles';

const HomeView = props => {
    const [user, setUser] = useState();
    const [enableLoadMore, setEnableLoadMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState([]);

    const navigation = useNavigation();
    const listRef = useRef();

    useEffect(() => {
        global.user = fakeData.user;
        setUser(fakeData.user);
        setTimeout(() => {
            setData(fakeData.newfeed);
            setIsLoading(false);
        }, 1000);
    }, []);

    const onLoadMore = () => {};

    const onRefresh = () => {};

    const renderHeaderPost = () => {
        return (
            <View style={styles.viewPostStatus}>
                <Pressable
                    android_ripple={Constants.ANDROID_RIPPLE}
                    style={{ padding: 4 }}
                    onPress={() => {
                        navigation.navigate('UserProfile');
                    }}
                >
                    <ImageLoader
                        path={global.user?.avatar}
                        style={styles.avatarUser}
                        resizeModeType={'cover'}
                    />
                </Pressable>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('AddNewFeed');
                    }}
                    activeOpacity={0.85}
                    style={styles.inputStatus}
                >
                    <Text
                        style={{
                            ...commonStyles.text,
                            color: Colors.COLOR_DRK_GREY,
                        }}
                    >
                        {localizes('hi')} {global.user?.name},{' '}
                        {localizes('what_your_day').toLowerCase()}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <HeaderCustom visibleBack={false} visibleLogo user={global.user} />
            <ListNewfeed
                // onRef={listRef}
                ListHeaderComponent={renderHeaderPost}
                list={data}
                onRefresh={onRefresh}
                onLoadMore={onLoadMore}
                isRefreshing={refreshing}
                isLoadingMore={enableLoadMore}
                showEmpty={isLoading && data?.length == 0}
            />
            <Loading visible={isLoading} />
        </View>
    );
};

export default HomeView;
