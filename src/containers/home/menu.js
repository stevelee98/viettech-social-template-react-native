import ImageLoader from 'components/imageLoader';
import ic_account_black from 'images/ic_account_black.png';
import ic_add_black from 'images/ic_add_black.png';
import ic_logout_black from 'images/ic_logout_black.png';
import ic_message_black from 'images/ic_message_black.png';
import React, { useImperativeHandle, useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    Pressable,
    Text,
    View,
} from 'react-native';
import Modal from 'react-native-modal';
import commonStyles from 'styles/commonStyles';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';

const Menu = (props, ref) => {
    const [isVisible, setVisible] = useState(false);
    const modalRef = useRef();
    const { navigation } = props;

    useImperativeHandle(ref, () => ({
        openModal,
    }));

    const openModal = () => {
        setVisible(true);
    };

    const hideModal = () => {
        setVisible(false);
    };

    return (
        <Modal
            ref={modalRef}
            isVisible={isVisible}
            style={{
                flex: 1,
                margin: 0,
                padding: 0,
                height: Dimensions.get('screen').height,
            }}
            onBackButtonPress={hideModal}
            deviceHeight={Dimensions.get('screen').height}
            deviceWidth={Constants.MAX_WIDTH}
            animationIn={'slideInRight'}
            animationOut={'slideOutRight'}
            animationInTiming={400}
            onBackdropPress={hideModal}
            statusBarTranslucent={true}
            useNativeDriver={Platform.OS === 'android'}
        >
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <View style={styles.user}>
                        <ImageLoader
                            path={
                                'https://sohanews.sohacdn.com/160588918557773824/2021/4/1/photo-1-16172667770152075485278.jpg'
                            }
                            style={styles.avatar}
                        />
                        <Text style={commonStyles.textMediumBold}>
                            Priscilla
                        </Text>
                    </View>
                    <Pressable
                        onPress={() => {
                            hideModal();
                            navigation.navigate('Profile');
                        }}
                        android_ripple={Constants.ANDROID_RIPPLE}
                        style={styles.itemButton}
                    >
                        <Image source={ic_account_black} />
                        <Text style={styles.title}>Account</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            hideModal();
                            navigation.navigate('AddNewFeed');
                        }}
                        android_ripple={Constants.ANDROID_RIPPLE}
                        style={styles.itemButton}
                    >
                        <Image source={ic_add_black} />
                        <Text style={styles.title}>Add new post</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => {
                            hideModal();
                            navigation.navigate('Login');
                        }}
                        android_ripple={Constants.ANDROID_RIPPLE}
                        style={styles.itemButton}
                    >
                        <Image source={ic_message_black} />
                        <Text style={styles.title}>Message</Text>
                    </Pressable>
                </View>
                <Pressable
                    android_ripple={Constants.ANDROID_RIPPLE}
                    style={styles.logoutButton}
                >
                    <Image source={ic_logout_black} />
                    <Text style={styles.title}>Logout</Text>
                </Pressable>
            </View>
        </Modal>
    );
};
export default React.forwardRef(Menu);
const styles = {
    contentContainer: {
        paddingHorizontal: Constants.PADDING16,
        paddingBottom: Constants.MARGIN16,
    },
    title: {
        ...commonStyles.text,
        fontWeight: '500',
        marginLeft: Constants.MARGIN12,
    },
    container: {
        backgroundColor: Colors.COLOR_WHITE,
        alignSelf: 'flex-end',
        paddingHorizontal: Constants.PADDING24,
        paddingBottom: Constants.PADDING24,
        paddingTop: Constants.HEADER_HEIGHT + Constants.PADDING24,
        height: '100%',
        minWidth: Constants.MAX_WIDTH / 2,
    },
    itemButton: {
        ...commonStyles.horizontal,
        paddingVertical: Constants.PADDING,
        marginBottom: Constants.MARGIN16,
    },
    logoutButton: {
        ...commonStyles.horizontal,
        paddingVertical: Constants.PADDING,
        marginBottom: Constants.MARGIN16,
    },
    avatar: {
        width: 92,
        height: 92,
        borderRadius: 92,
        marginBottom: Constants.MARGIN16,
    },
    user: {
        marginBottom: Constants.MARGIN24,
        alignItems: 'center',
    },
};
