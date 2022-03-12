import languageCode from 'enum/languageCode';
import { localizes } from 'locales/i18n';
import React, { Component } from 'react';
import {
    BackHandler,
    Dimensions,
    Keyboard,
    PermissionsAndroid,
    Platform,
    ToastAndroid,
    View,
} from 'react-native';
// import ImagePicker from 'react-native-image-crop-picker';
import Toast from 'react-native-root-toast';
import StringUtil from 'utils/stringUtil';
import Utils from 'utils/utils';
import { configConstants } from 'values/configConstants';

const screen = Dimensions.get('window');

const CHANNEL_ID = 'aaChannelId';
const CHANNEL_NAME = 'Thông báo chung';

const optionsCamera = {
    waitAnimationEnd: false,
    includeExif: true,
    forceJpg: true,
    mediaType: 'photo',
    compressImageQuality: 0.8,
};

class BaseView extends Component {
    constructor(props) {
        super(props);
        this.className = this.constructor.name;
    }

    render() {
        return <View></View>;
    }

    /**
     * Show toast message
     * @param {*} message
     * @param {*} duration
     * @param {*} type
     */
    showMessage(message, duration = 30000, type = 'warning') {
        try {
            if (!global.isShowMessageError) {
                if (Platform.OS === 'ios') {
                    global.isShowMessageError = true;
                    Toast.show(message, {
                        duration: Toast.durations.LONG,
                        position: Toast.positions.CENTER,
                    });
                } else {
                    ToastAndroid.showWithGravityAndOffset(
                        message,
                        ToastAndroid.LONG,
                        ToastAndroid.CENTER,
                        0,
                        250,
                    );
                }
            }
            setTimeout(() => {
                global.isShowMessageError = false;
            }, 5000);
        } catch (e) {
            global.isShowMessageError = false;
            console.log(e);
        }
    }

    goLoginScreen() {
        this.props.navigation.dispatch(resetActionLogin);
    }

    //Show login view
    showLoginView(route) {
        if (!Utils.isNull(route)) {
            this.props.navigation.navigate('Login', {
                router: {
                    name: route.routeName,
                    params: route.params,
                },
                isExitApp: false,
            });
        } else {
            this.props.navigation.navigate('Login', {
                isExitApp: false,
            });
        }
    }

    //Save exception
    saveException(error, func) {
        let filter = {
            className: this.props.route
                ? this.props.route.name
                : this.className,
            exception: error.message + ' in ' + func,
        };
        this.props.saveException(filter);
    }

    handlerBackButton = () => {
        console.log(this.className, 'back pressed');
        if (this.props.navigation) {
            this.onBack();
        } else {
            return false;
        }
        return true;
    };

    /**
     * Back pressed
     * True: not able go back
     * False: go back
     */
    onBackPressed() {
        return false;
    }

    /**
     * On back
     */
    onBack = () => {
        if (this.props.navigation) {
            this.props.navigation.goBack();
        }
    };

    goHomeScreen() {
        this.props.navigation.dispatch(resetAction);
    }

    /// Logout
    logout = () => {
        StorageUtil.deleteItem(StorageUtil.USER_PROFILE);
        StorageUtil.storeItem(StorageUtil.USER_PROFILE, null);
        global.token = '';
        global.user = null;
        this.goHomeScreen();
    };

    /**
     * Handle connection change
     */
    handleConnectionChange = isConnected => {
        console.log(`is connected: ${isConnected}`);
    };

    /**
     * Has permission
     */
    hasPermission = async permissions => {
        if (
            Platform.OS === 'ios' ||
            (Platform.OS === 'android' && Platform.Version < 23)
        ) {
            return true;
        }

        const hasPermission = await PermissionsAndroid.check(permissions);

        if (hasPermission) return true;

        const status = await PermissionsAndroid.request(permissions);

        if (status === PermissionsAndroid.RESULTS.GRANTED) return true;

        if (status === PermissionsAndroid.RESULTS.DENIED) {
            console.log('Permission denied by user.');
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
            console.log('Permission revoked by user.');
        }

        return false;
    };

    async componentDidMount() {
        Dimensions.addEventListener('change', this.onChangedOrientation);
        const { navigation } = this.props;
        this.unsubscribeFocus = navigation.addListener('focus', () => {
            BackHandler.addEventListener(
                'hardwareBackPress',
                this.handlerBackButton,
            );
        });
        this.unsubscribeBlur = navigation.addListener('blur', () => {
            BackHandler.removeEventListener(
                'hardwareBackPress',
                this.handlerBackButton,
            );
        });
    }

    // set language
    setLanguage = async () => {
        let language = await StorageUtil.retrieveItem(StorageUtil.LANGUAGE);
        console.log('language', language);
        if (language != null) {
            I18n.locale = language;
            global.languageCode = language;
            StorageUtil.storeItem(StorageUtil.LANGUAGE, language);
        } else {
            I18n.locale = languageCode.vi;
            global.languageCode = languageCode.vi;
            StorageUtil.storeItem(StorageUtil.LANGUAGE, languageCode.vi);
        }
    };

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.onChangedOrientation);
    }

    onChangedOrientation = e => {};

    /**
     * Launch camera
     */
    launchCamera = async callback => {
        if (Platform.OS === 'android') {
            const hasCameraPermission = await this.hasPermission(
                PermissionsAndroid.PERMISSIONS.CAMERA,
            );
            if (!hasCameraPermission) return;
        }
        ImagePicker.openCamera({
            ...optionsCamera,
        })
            .then(image => {
                let maxSizeUpload =
                    this.maxFileSizeUpload.numericValue ||
                    configConstants.MAX_FILE_SIZE_UPLOAD;
                if (image.size / this.oneMB > maxSizeUpload) {
                    this.showMessage(
                        'Không thể chọn ảnh, vì kích thước lớn hơn ' +
                            maxSizeUpload +
                            ' MB.',
                    );
                    return callback(null);
                } else {
                    return callback(image.path);
                }
            })
            .catch(e => this.saveException(e, 'onChooseImageProduct'));
    };

    /**
     * Launch image library
     */
    launchImageLibrary = async callback => {
        if (Platform.OS === 'android') {
            const hasCameraPermission = await this.hasPermission(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            );
            if (!hasCameraPermission) return;
        }
        ImagePicker.openPicker({
            ...optionsCamera,
        })
            .then(image => {
                let maxSizeUpload =
                    this.maxFileSizeUpload.numericValue ||
                    configConstants.MAX_FILE_SIZE_UPLOAD;
                if (image.size / this.oneMB > maxSizeUpload) {
                    this.showMessage(
                        'Không thể chọn ảnh, vì kích thước lớn hơn ' +
                            maxSizeUpload +
                            ' MB.',
                    );
                    return callback(null);
                } else {
                    return callback(image.path);
                }
            })
            .catch(e => this.saveException(e, 'onChooseImageProduct'));
    };

    /**
     * Launch multiple image library
     */
    launchMultipleImageLibrary = async (
        callback,
        validateDimensions = true,
    ) => {
        if (Platform.OS === 'android') {
            const hasCameraPermission = await this.hasPermission(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            );
            if (!hasCameraPermission) return;
        }
        ImagePicker.openPicker({
            ...optionsCamera,
            multiple: true,
        })
            .then(images => {
                let imagesTemp = [];
                let countSizeBig = 0;
                let countDimensions = 0;
                let maxSizeUpload =
                    this.maxFileSizeUpload.numericValue ||
                    configConstants.MAX_FILE_SIZE_UPLOAD;
                let dimensions = JSON.parse(
                    this.dimensionsImageProduct.textValue,
                );
                let widthImage = parseInt(dimensions.minWidth) || 300;
                let heightImage = parseInt(dimensions.minHeight) || 300;
                images.forEach(element => {
                    Utils.formatBytes(element.size);
                    if (element.size / this.oneMB > maxSizeUpload) {
                        countSizeBig++;
                    } else if (
                        validateDimensions &&
                        (element.width < widthImage ||
                            element.height < heightImage)
                    ) {
                        countDimensions++;
                    } else {
                        imagesTemp.push({
                            image: element.path,
                        });
                    }
                });
                if (countSizeBig > 0) {
                    this.showMessage(
                        'Không thể chọn được ' +
                            countSizeBig +
                            ' ảnh có kích thước lớn hơn ' +
                            maxSizeUpload +
                            ' MB.',
                    );
                }
                if (countDimensions > 0) {
                    this.showMessage(
                        'Không thể chọn được ' +
                            countDimensions +
                            ' ảnh có kích thước nhỏ hơn ' +
                            widthImage +
                            'x' +
                            heightImage,
                    );
                }
                countSizeBig = 0;
                countDimensions = 0;
                return callback(imagesTemp);
            })
            .catch(e => this.saveException(e, 'onChooseImageProduct'));
    };

    /**
     * Launch multiple video library
     */
    launchMultipleVideoLibrary = async callback => {
        if (Platform.OS === 'android') {
            const hasCameraPermission = await this.hasPermission(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            );
            if (!hasCameraPermission) return;
        }
        ImagePicker.openPicker({
            ...optionsCamera,
            multiple: true,
            mediaType: 'video',
        })
            .then(videos => {
                let videosTemp = [];
                let countSizeBig = 0;
                let maxSizeUpload =
                    this.maxFileSizeUpload.numericValue ||
                    configConstants.MAX_FILE_SIZE_UPLOAD;
                videos.forEach(element => {
                    Utils.formatBytes(element.size);
                    if (element.size / this.oneMB > maxSizeUpload) {
                        countSizeBig++;
                    } else {
                        videosTemp.push(element);
                    }
                });
                if (countSizeBig > 0) {
                    this.showMessage(
                        'Không thể chọn được ' +
                            countSizeBig +
                            ' video có kích thước lớn hơn ' +
                            maxSizeUpload +
                            ' MB.',
                    );
                }
                countSizeBig = 0;
                return callback(videosTemp);
            })
            .catch(e => this.saveException(e, 'onChooseImageProduct'));
    };

    /**
     * Launch video library
     */
    launchVideoLibrary = async callback => {
        if (Platform.OS === 'android') {
            const hasCameraPermission = await this.hasPermission(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            );
            if (!hasCameraPermission) return;
        }
        ImagePicker.openPicker({
            ...optionsCamera,
            mediaType: 'video',
        })
            .then(video => {
                let maxSizeUpload =
                    this.maxFileSizeUpload.numericValue ||
                    configConstants.MAX_FILE_SIZE_UPLOAD;
                if (video.size / this.oneMB > maxSizeUpload) {
                    this.showMessage(
                        'Không thể chọn video, vì kích thước lớn hơn ' +
                            maxSizeUpload +
                            ' MB.',
                    );
                    return callback(null);
                } else {
                    return callback(video);
                }
            })
            .catch(e => this.saveException(e, 'onChooseVideoShop'));
    };

    /**
     * Register keyboard event
     */
    registerKeyboardEvent() {
        Keyboard.addListener(
            'keyboardWillShow',
            this.keyboardWillShow.bind(this),
        );
        Keyboard.addListener(
            'keyboardWillHide',
            this.keyboardWillHide.bind(this),
        );
    }

    /**
     * Handle show keyboard
     * @param {*} e
     */
    keyboardWillShow(e) {
        this.setState({ keyboardHeight: e.endCoordinates.height });
    }

    /**
     * Handle hide keyboard
     * @param {*} e
     */
    keyboardWillHide(e) {
        this.setState({ keyboardHeight: 0 });
    }

    /**
     * Validate name
     */
    validateName = (name = '') => {
        let nameTrim = '';
        if (!Utils.isNull(name)) {
            nameTrim = name.trim();
        }
        if (Utils.isNull(nameTrim) || nameTrim.length == 0) {
            return localizes('pleaseFillName');
        } else if (
            StringUtil.validSpecialCharacter(nameTrim) ||
            StringUtil.validEmojiIcon(nameTrim)
        ) {
            return localizes('nameMustDontHaveSpecialCharacter');
        } else if (StringUtil.containNumber(name)) {
            return localizes('nameMustNotHaveNumber');
        } else if (nameTrim.length > 60) {
            return localizes('nameLenghtMustLeastThan60');
        } else {
            return 'OK';
        }
    };

    /**
     * Validate phone
     */
    validatePhone = (phone, isPBX = false) => {
        let phoneTrim = '';
        if (!Utils.isNull(phone)) {
            phoneTrim = phone.trim();
        }
        const res = phoneTrim.charAt(0);
        if (Utils.isNull(phoneTrim)) {
            return localizes('pleaseFillPhone');
        }

        // ======= PHONE =======
        // không ký tự đặc biệt
        else if (phoneTrim.includes(' ') && phoneTrim == '') {
            return localizes('pleaseFillPhone');
        } else if (
            Utils.validatePhoneContainSpecialCharacter(phoneTrim) ||
            Utils.validatePhoneContainWord(phoneTrim)
        ) {
            return localizes('invalidPhone');
        } else if (phoneTrim.includes(' ')) {
            return localizes('invalidPhone');
        } else if (!isPBX && (phoneTrim.length != 10 || res != '0')) {
            return localizes('phoneMustHave10CharAndStartBy0');
        } else if (
            (!isPBX && !Utils.validatePhone(phoneTrim)) ||
            (isPBX &&
                !Utils.validatePhonePBX(phoneTrim) &&
                !Utils.validateFax(phoneTrim) &&
                !Utils.validatePhone(phoneTrim))
        ) {
            return localizes('invalidPhone');
        } else {
            return 'OK';
        }
    };

    /**
     * Validate password
     */
    validatePassword = password => {
        let passwordTrim = '';
        if (!Utils.isNull(password)) {
            passwordTrim = password.trim();
        }
        if (Utils.isNull(passwordTrim)) {
            return localizes('register.vali_fill_password');
        } else if (Utils.validateSpacesPass(passwordTrim)) {
            return localizes('register.vali_pass_right');
        } else if (
            passwordTrim.length < 6 ||
            passwordTrim.length >= 20 ||
            !Utils.validateContainUpperPassword(passwordTrim)
        ) {
            return localizes('confirmPassword.vali_character_password');
        } else {
            return 'OK';
        }
    };

    /**
     * Validate email
     */
    validateEmail = (email = '') => {
        let emailTrim = '';
        if (!Utils.isNull(email)) {
            emailTrim = email.trim();
        }
        if (Utils.isNull(emailTrim)) {
            return localizes('register.vali_fill_email');
        } else if (!Utils.validateEmail(emailTrim)) {
            return localizes('register.vali_email');
        } else if (emailTrim.length > 150) {
            return localizes('register.vali_email_length');
        } else {
            return 'OK';
        }
    };

    /**
     * Validate address
     */
    validateAddress = (address = '') => {
        let addressTrim = '';
        if (!Utils.isNull(address)) {
            addressTrim = address.trim();
        }
        if (Utils.isNull(addressTrim)) {
            return localizes('register.vali_fill_address');
        } else if (addressTrim.length > 250) {
            return localizes('register.vali_address_length');
        } else {
            return 'OK';
        }
    };

    /**
     * Get config point
     */
    getConfigPoint = async () => {
        let value = await StorageUtil.retrieveItem(StorageUtil.MOBILE_CONFIG);
        if (!Utils.isNull(value)) {
            let data = value.find(
                x => x.name == configConstants.CUMULATIVE_POINTS,
            );
            if (data) {
                this.cumulativePoints = JSON.parse(data.textValue);
            }
        }
    };

    /**
     * Get content create notification
     */
    getConfigCreateNotification = async () => {
        let value = await StorageUtil.retrieveItem(StorageUtil.MOBILE_CONFIG);
        if (!Utils.isNull(value)) {
            let data = value.find(
                x => x.name == configConstants.CREATE_NOTIFICATION_CONTENT,
            );
            if (data) {
                this.configCreateNotification = data.textValue;
            }
        }
    };

    /**
     * Get config coin
     */
    getConfigCoin = async () => {
        let value = await StorageUtil.retrieveItem(StorageUtil.MOBILE_CONFIG);
        if (!Utils.isNull(value)) {
            let data = value.find(
                x => x.name == configConstants.EXCHANGE_COINS,
            );
            if (data) {
                this.exchangeCoins = JSON.parse(data.textValue);
            }
        }
    };

    /**
     * Get rule apple
     * @param {*} data
     */
    getRuleApple = data => {
        let enableRuleApple = false;
        if (!Utils.isNull(data)) {
            let configValue = data.find(
                x => x.name == configConstants.ENABLE_RULE_APPLE,
            );
            enableRuleApple =
                Platform.OS === 'ios'
                    ? configValue && configValue.numericValue === 1
                    : true;
        }
        return enableRuleApple;
    };

    /**
     * Get hidden personal id
     */
    getHiddenPersonalId = data => {
        let isHiddenPersonalId = false;
        if (!Utils.isNull(data)) {
            let configValue = data.find(
                x => x.name == configConstants.HIDDEN_PERSONAL_ID,
            );
            if (configValue) {
                isHiddenPersonalId =
                    configValue && configValue.numericValue === 1;
            }
        }
        return isHiddenPersonalId;
    };

    /// Handle login
    handleLogin = (data, router) => {
        global.user = data;
        global.shop = data.shop;
        StorageUtil.storeItem(StorageUtil.USER_PROFILE, data);
        //Save token login
        StorageUtil.storeItem(StorageUtil.USER_TOKEN, data.token);
        StorageUtil.storeItem(StorageUtil.FIREBASE_TOKEN, data.firebaseToken);
        global.token = data.token;
        global.firebaseToken = data.firebaseToken;
        this.signInWithCustomToken(data.id);
        this.goHomeScreen();
        this.refreshToken();
        if (!Utils.isNull(router)) {
            setTimeout(() => {
                this.props.navigation.pop();
                if (router.name == 'TabShop') {
                    // let shopId = !Utils.isNull(data.shop) ? data.shop.id : null;
                    // let screenType = ScreenType.FROM_MAIN;
                    // if (!Utils.isNull(shopId)) {
                    //     this.props.navigation.navigate(router.name, {
                    //         ...router.params,
                    //         shopId,
                    //         screenType,
                    //     });
                    // } else {
                    //     this.props.navigation.navigate('CreateShop', {
                    //         shop: null,
                    //     });
                    // }
                } else {
                    this.props.navigation.navigate(router.name, router.params);
                }
            }, 250);
        }
    };
}

export default BaseView;
