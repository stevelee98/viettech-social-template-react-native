import { useNavigation } from '@react-navigation/native';
import Hr from 'components/hr';
import ImageLoader from 'components/imageLoader';
import MainList from 'components/mainList';
import fakeData from 'containers/home/fakeData';
import ItemNewfeed from 'containers/newfeed/list/itemNewfeed';
import ic_back_white from 'images/ic_back_white.png';
import ic_bell_black from 'images/ic_bell_black.png';
import ic_electric_black from 'images/ic_electric_black.png';
import ic_follow_while from 'images/ic_follow_white.png';
import ic_message_black from 'images/ic_message_black.png';
import { localizes } from 'locales/i18n';
import React, { useRef } from 'react';
import { Image, Pressable, RefreshControl, Text, View } from 'react-native';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import styles from './styles';

const ProfileView = () => {
    const navigation = useNavigation();
    const listRef = useRef();

    const listHeaderComponent = () => {
        return (
            <View>
                <View>
                    <ImageLoader
                        path={
                            'https://viettourist.com/resources/images/Tay%20Nguyen/ho_ta_dung.jpg'
                        }
                        style={styles.coverImage}
                    />
                    <View style={styles.subInfo}>
                        <View style={styles.col}>
                            <Text style={styles.followerNum}>24.3k</Text>
                            <Text style={styles.followerTxt}>Followers</Text>
                        </View>
                        <View style={styles.col}>
                            <Text style={styles.followerNum}>135</Text>
                            <Text style={styles.followerTxt}>Following</Text>
                        </View>
                    </View>
                    <ImageLoader
                        path={
                            'https://sohanews.sohacdn.com/160588918557773824/2021/4/1/photo-1-16172667770152075485278.jpg'
                        }
                        style={styles.avatar}
                    />
                </View>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>Priscilla</Text>
                    <Hr
                        color={Colors.COLOR_DRK_GREY}
                        height={18}
                        width={1}
                        style={{ marginHorizontal: Constants.MARGIN24 }}
                    />
                    <Text style={styles.userJob}>Developer</Text>
                </View>
                <Text style={styles.description}>
                    When you want something, all the universe conspires in
                    helping you to achieve it
                </Text>
                {renderButton()}
                <Text style={styles.feed}>Feed</Text>
                <Hr />
            </View>
        );
    };

    const renderButton = () => {
        return (
            <View style={styles.button}>
                <Pressable style={styles.btnFollow}>
                    <Image source={ic_follow_while} />
                </Pressable>
                <Pressable style={styles.btn}>
                    <Image source={ic_message_black} />
                </Pressable>
                <Pressable style={styles.btn}>
                    <Image source={ic_electric_black} />
                </Pressable>
                <Pressable style={styles.btn}>
                    <Image source={ic_bell_black} />
                </Pressable>
            </View>
        );
    };

    const renderItem = ({ item, index }) => {
        return (
            <ItemNewfeed
                key={index.toString()}
                item={item}
                index={index}
                length={fakeData.newfeed.length}
                gotoUser={gotoUser}
                onPress={onPress}
            />
        );
    };

    const gotoUser = () => {};

    const onPress = () => {};

    const handleRefresh = () => {};

    const renderHeader = () => {
        return (
            <View style={styles.header}>
                <Pressable
                    android_ripple={Constants.ANDROID_RIPPLE}
                    onPress={() => navigation.goBack()}
                >
                    <Image source={ic_back_white} />
                </Pressable>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <MainList
                onRef={r => {
                    listRef.current = r;
                }}
                ListHeaderComponent={listHeaderComponent}
                contentContainerStyle={{
                    backgroundColor: Colors.COLOR_WHITE,
                }}
                style={{ flex: 1 }}
                keyExtractor={item => item.id}
                data={fakeData.newfeed}
                renderItem={renderItem}
                enableRefresh={true}
                refreshControl={
                    <RefreshControl
                        refreshing={true}
                        onRefresh={handleRefresh}
                    />
                }
                showsVerticalScrollIndicator={false}
                textForEmpty={localizes('nodata')}
                ItemSeparatorComponent={() => <Hr />}
            />
            {renderHeader()}
        </View>
    );
};

export default ProfileView;
