import { useNavigation } from '@react-navigation/native';
import ButtonCustom from 'components/buttonCustom';
import HeaderCustom from 'components/headerCustom';
import ImageLoader from 'components/imageLoader';
import MainList from 'components/mainList';
import ModalPrivacy from 'components/modalPrivacy';
import fakeData from 'containers/home/fakeData';
import resourceType from 'enum/resourceType';
import ic_add_photo_black from 'images/ic_add_photo_black.png';
import ic_close_gray from 'images/ic_close_gray.png';
import ic_global_small from 'images/ic_global_small.png';
import { localizes } from 'locales/i18n';
import React, { useRef, useState } from 'react';
import {
    Image,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';
import commonStyles from 'styles/commonStyles';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import styles from './styles';

const AddNewFeedView = props => {
    const [isLoading, setIsLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [content, setContent] = useState(null);
    const [privacy, setPrivacy] = useState({
        icon_small: ic_global_small,
        name: localizes('public'),
        type: 'public',
    });
    const navigation = useNavigation();
    const modalPrivacy = useRef();

    const validate = () => {
        if (Utils.isNull(content) || images.length == 0) {
            Utils.showMessage('please_enter_content');
            return false;
        }
        return true;
    };

    const openCameraRoll = () => {
        Utils.showCameraRollView(
            {
                assetType: 'Photos',
                callback: handleResourceSelected,
                callbackCaptureImage: onCaptureImage,
                navigation: navigation,
            },
            navigation,
        );
    };

    const onCaptureImage = async element => {
        let path = element.path;
        let type = Utils.getTypeResource(element.mime);
        if (Platform.OS == 'android') {
            path = path.replace('file://', '');
        }
        images.push({
            id: null,
            path:
                type == resourceType.VIDEO && Platform.OS === 'ios'
                    ? Utils.convertLocalIdentifierIOSToAssetLibrary(path, false)
                    : element.path,
        });
        setImages(images);
    };

    const handleResourceSelected = res => {
        try {
            res.forEach(async (element, index) => {
                let path = element.path;
                let type = Utils.getTypeResource(element.mime);
                images.push({
                    path:
                        type == resourceType.VIDEO && Platform.OS === 'ios'
                            ? Utils.convertLocalIdentifierIOSToAssetLibrary(
                                  path,
                                  false,
                              )
                            : element.path,
                });
                if (index == res.length - 1) {
                    setImages(images);
                }
            });
            console.log('images', images);
        } catch (error) {
            console.log('handleResourceSelected error', error);
        }
    };

    const renderInput = () => {
        return (
            <View style={styles.txtInputContainer}>
                <TextInput
                    style={styles.inputText}
                    value={content}
                    placeholder={localizes('enter_content')}
                    onChangeText={content => setContent(content)}
                    blurOnSubmit={false}
                    multiline={true}
                    numberOfLines={10}
                    placeholderTextColor={Colors.COLOR_TEXT_HOLDER}
                />
            </View>
        );
    };

    const renderAddImage = () => {
        return (
            <View style={styles.viewAddImage}>
                <Text style={styles.titleChooseImage}>
                    {localizes('choose_image')}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MainList
                        nestedScrollEnabled={true}
                        contentContainerStyle={{}}
                        style={{ flexGrow: 1 }}
                        horizontal={true}
                        data={images}
                        renderItem={renderItemImage}
                        keyExtractor={item => item.id}
                        showsHorizontalScrollIndicator={false}
                    />
                </View>
            </View>
        );
    };

    const renderItemImage = ({ item, index }) => {
        return (
            <Pressable
                style={{
                    ...styles.viewItemImage,
                    marginRight:
                        index == images.length - 1 ? Constants.MARGIN16 : 0,
                    marginLeft: index == 0 ? Constants.MARGIN16 : 8,
                }}
            >
                <Image
                    source={{ uri: item.path }}
                    style={styles.itemImage}
                    resizeMode={'cover'}
                />
                <Pressable
                    onPress={() => {
                        removeItemResource(index);
                    }}
                    android_ripple={Constants.ANDROID_RIPPLE}
                    style={styles.btnRmImg}
                >
                    <Image source={ic_close_gray} />
                </Pressable>
            </Pressable>
        );
    };

    const removeItemResource = index => {
        images.splice(index, 1);
        setImages(images);
    };

    const onPressPost = () => {
        if (validate()) {
        }
    };

    const renderUser = () => {
        return (
            <View style={styles.viewUser}>
                <ImageLoader
                    style={styles.avatar}
                    path={fakeData.user.avatar}
                />
                <View style={styles.properties}>
                    <Text style={commonStyles.textBold}>
                        {fakeData.user.name}
                    </Text>
                    {renderPrivacy()}
                </View>
            </View>
        );
    };

    const renderPrivacy = () => {
        return (
            <Pressable
                onPress={() => {
                    modalPrivacy.current.openModal(privacy);
                }}
                style={styles.privacy}
            >
                <Image source={privacy.icon_small} />
                <Text style={styles.namePrivacy}>{privacy.name}</Text>
            </Pressable>
        );
    };

    const onChangePrivacy = e => {
        setPrivacy(e);
    };

    const renderButton = () => {
        return (
            <View style={styles.viewButton}>
                <ButtonCustom
                    onPress={onPressPost}
                    title={localizes('post')}
                    style={styles.btnAction}
                    // border={styles.btnBorder}
                />
                <Pressable
                    style={styles.btnChooseImage}
                    android_ripple={Constants.ANDROID_RIPPLE}
                    onPress={() => {
                        openCameraRoll();
                    }}
                >
                    <Image source={ic_add_photo_black} />
                </Pressable>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <HeaderCustom
                title={localizes('create_post')}
                visibleBack={true}
                navigation={navigation}
                onBack={() => {
                    navigation.goBack();
                }}
            />
            <ScrollView
                contentContainerStyle={{
                    flex: 1,
                    paddingVertical: Constants.PADDING_LARGE,
                }}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                {renderUser()}
                {renderInput()}
            </ScrollView>
            {renderAddImage()}
            {renderButton()}
            <ModalPrivacy ref={modalPrivacy} onChange={onChangePrivacy} />
        </View>
    );
};

export default AddNewFeedView;
