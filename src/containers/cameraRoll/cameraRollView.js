import HeaderCustom from 'components/headerCustom';
import Loading from 'components/loading';
import BaseView from 'containers/base/baseView';
import ic_camera_gray from 'images/ic_camera_gray.png';
import ic_check_green from 'images/ic_check_green.png';
import { localizes } from 'locales/i18n';
import React from 'react';
import {
    BackHandler,
    Dimensions,
    Image,
    PermissionsAndroid,
    Pressable,
    View,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import CameraRollPicker from './cameraRollPicker';

const AVATAR_SIZE = 32;
const AVATAR_BORDER = AVATAR_SIZE / 2;
const OPTION_IMAGE_PICKER = {
    width: 800,
    height: 600,
    multiple: true,
    waitAnimationEnd: false,
    includeExif: true,
    forceJpg: true,
    compressImageQuality: 0.8,
};

class CameraRollView extends BaseView {
    constructor(props) {
        super(props);
        const { route, navigation } = this.props;
        this.state = {
            disableCamera: false,
            selected: [],
            screen: Dimensions.get('screen'),
        };
        this.isTakePhoto = false;
        this.resources = [];
        this.selectSingleItem = route.params.selectSingleItem;
        this.callback = route.params.callback;
        this.callbackCaptureImage = route.params.callbackCaptureImage;
        this.assetType = route.params.assetType;
        this.maximum = route.params.maximum;
        this.numVideoSelected = route.params.numVideoSelected;
        if (this.assetType == 'Photos') this.isVideo = false;
        else this.isVideo = true;
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', () => {
            BackHandler.addEventListener(
                'hardwareBackPress',
                this.handlerBackButton,
            );
            Dimensions.addEventListener('change', this.onChangeDimensions);
        });
        this.props.navigation.addListener('blur', () => {
            BackHandler.removeEventListener(
                'hardwareBackPress',
                this.handlerBackButton,
            );
            Dimensions.removeEventListener('change', this.onChangeDimensions);
        });
    }

    onChangeDimensions = e => {
        const screen = e.screen;
        this.setState({
            screen,
        });
    };

    render() {
        const { screen } = this.state;
        return (
            <View style={{ flex: 1 }}>
                <HeaderCustom
                    shadow={true}
                    title={localizes('choose_image')}
                    visibleBack={true}
                    navigation={this.props.navigation}
                    statusBarColor={Colors.COLOR_WHITE}
                    renderRightMenu={this.renderRightMenu}
                />
                <CameraRollPicker
                    groupTypes="SavedPhotos"
                    maximum={this.maximum}
                    selected={this.state.selected}
                    selectSingleItem={this.selectSingleItem}
                    assetType={this.assetType}
                    imagesPerRow={3}
                    imageMargin={Constants.MARGIN}
                    callback={this.handleImagePicker}
                    loader={<Loading visible={true} />}
                    // mimeTypes={['video/mp4']}
                    emptyText={localizes('noData')}
                    emptyTextStyle={{
                        marginTop: Constants.MARGIN_XX_LARGE * 5,
                    }}
                    numVideoSelected={this.numVideoSelected}
                    showMessage={message => this.showMessage(message)}
                    containerWidth={screen.width}
                />
            </View>
        );
    }

    renderRightMenu = () => {
        const { disableCamera } = this.state;
        return (
            <Pressable
                android_ripple={Constants.ANDROID_RIPPLE}
                style={{
                    position: 'absolute',
                    right: 0,
                    padding: Constants.PADDING_LARGE,
                }}
                onPress={() => {
                    if (disableCamera) {
                        this.onBack();
                        this.callback(this.resources, this.assetType);
                    } else {
                        this.takePhoto();
                    }
                }}
            >
                <Image
                    source={!disableCamera ? ic_camera_gray : ic_check_green}
                />
            </Pressable>
        );
    };

    takePhoto = async () => {
        this.isTakePhoto = true;
        const mediaType = this.assetType == 'Videos' ? 'video' : 'any';
        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        console.log('status', status);
        if (status === PermissionsAndroid.RESULTS.GRANTED)
            ImagePicker.openCamera({
                ...OPTION_IMAGE_PICKER,
                // mediaType: "any",
                mediaType: mediaType,
            })
                .then(images => {
                    let path = images.path;
                    if (path.includes('.mp4')) {
                        this.onBack();
                        let newArr = [];
                        newArr.push(images);
                        this.callback(newArr, this.assetType);
                    } else {
                        this.handleImagePicker(images);
                    }
                })
                .catch(e => console.log(e));
    };

    handleImagePicker = res => {
        if (res.length > 0) {
            this.setState({
                disableCamera: true,
            });
        } else {
            this.setState({
                disableCamera: false,
            });
            // return;
        }
        if (!Utils.isNull(res)) {
            if (!res.exif) {
                res.forEach(element => {
                    element.path = Utils.isNull(element.uri)
                        ? element.path
                        : element.uri;
                });
                this.resources = res;
            } else {
                this.resources.path = res.path;
                this.resources.width = res.width;
                this.resources.height = res.height;
                this.onBack();
                this.callbackCaptureImage(res);
            }
        }
    };
}

export default CameraRollView;
