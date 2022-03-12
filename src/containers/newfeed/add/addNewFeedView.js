import { useNavigation } from '@react-navigation/native';
import Button from 'components/button';
import HeaderCustom from 'components/headerCustom';
import Loading from 'components/loading';
import MainList from 'components/mainList';
import resourceType from 'enum/resourceType';
import ic_add_photo_black from 'images/ic_add_photo_black.png';
import ic_close_circle_black from 'images/ic_close_circle_black.png';
import { localizes } from 'locales/i18n';
import React, { useState } from 'react';
import {
    Image,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View
} from 'react-native';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import styles from './styles';

const AddNewFeedView = props => {
    const [isLoading, setIsLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [content, setContent] = useState(null);
    const navigation = useNavigation();

    const validate = () => {
        if (Utils.isNull(content) || images.length == 0) {
            Utils.showMessage('please_enter_content');
            return false;
        }
        return true;
    };

    const openCameraRoll = () => {
        Utils.showCameraRollView({
            assetType: 'Photos',
            callback: handleResourceSelected,
            callbackCaptureImage: onCaptureImage,
        });
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
                        ListHeaderComponent={() => {
                            return (
                                <Pressable
                                    style={styles.btnChooseImage}
                                    android_ripple={Constants.ANDROID_RIPPLE}
                                    onPress={() => {
                                        openCameraRoll();
                                    }}
                                >
                                    <Image source={ic_add_photo_black} />
                                </Pressable>
                            );
                        }}
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

    const renderItemImage = (item, index) => {
        return (
            <Pressable
                style={[
                    styles.viewItemImage,
                    {
                        marginRight:
                            index == images - 1 ? Constants.MARGIN16 : 0,
                    },
                ]}
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
                    <Image source={ic_close_circle_black} />
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

    return (
        <View style={{ flexGrow: 1 }}>
            <HeaderCustom
                title={localizes('add_new_feed')}
                visibleBack={true}
                navigation={navigation}
            />
            <ScrollView
                contentContainerStyle={{
                    paddingVertical: Constants.PADDING_LARGE,
                }}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                {renderAddImage()}
                {renderInput()}
            </ScrollView>
            <Button
                onPress={onPressPost}
                title={localizes('post')}
                style={styles.btnAction}
                border={styles.btnBorder}
                titleStyle={{
                    fontWeight: 'bold',
                    color: Colors.COLOR_BLUE,
                }}
            />
            <Loading visible={isLoading} />
        </View>
    );
};

export default AddNewFeedView;
