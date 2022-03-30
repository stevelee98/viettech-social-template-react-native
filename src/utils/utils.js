import resourceType from 'enum/resourceType';
import _ from 'lodash';
import {
    Dimensions,
    PermissionsAndroid,
    Platform,
    StatusBar,
    ToastAndroid
} from 'react-native';
import Toast from 'react-native-root-toast';
import StringUtil from './stringUtil';

const X_WIDTH = 375;
const X_HEIGHT = 812;

const XSMAX_WIDTH = 414;
const XSMAX_HEIGHT = 896;

const { height: W_HEIGHT, width: W_WIDTH } = Dimensions.get('window');

let isIPhoneX_v = false;
let isIPhoneXMax_v = false;
let isIPhoneWithMonobrow_v = false;

if (Platform.OS === 'ios' && !Platform.isPad && !Platform.isTVOS) {
    if (W_WIDTH === X_WIDTH && W_HEIGHT === X_HEIGHT) {
        isIPhoneWithMonobrow_v = true;
        isIPhoneX_v = true;
    }

    if (W_WIDTH === XSMAX_WIDTH && W_HEIGHT === XSMAX_HEIGHT) {
        isIPhoneWithMonobrow_v = true;
        isIPhoneXMax_v = true;
    }
}

export default class Utils {
    static chunkArray(array, size) {
        if (array == []) return [];
        return array.reduce((acc, val) => {
            if (acc.length === 0) acc.push([]);
            const last = acc[acc.length - 1];
            if (last.length < size) {
                last.push(val);
            } else {
                acc.push([val]);
            }
            return acc;
        }, []);
    }

    static hex2rgb(hex, opacity) {
        hex = hex.trim();
        hex = hex[0] === '#' ? hex.substr(1) : hex;
        var bigint = parseInt(hex, 16),
            h = [];
        if (hex.length === 3) {
            h.push((bigint >> 4) & 255);
            h.push((bigint >> 2) & 255);
        } else {
            h.push((bigint >> 16) & 255);
            h.push((bigint >> 8) & 255);
        }
        h.push(bigint & 255);
        if (arguments.length === 2) {
            h.push(opacity);
            return 'rgba(' + h.join() + ')';
        } else {
            return 'rgb(' + h.join() + ')';
        }
    }

    /**
     * Validate email
     * @param {*} email
     */
    static validateEmail(email) {
        var re =
            /^[^<>()[\]\\,;:\%#^\s@\"$&!@]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    /**
     * Validate phone
     */
    static validatePhone(phone) {
        var re =
            /^0(3[23456789]|5[2689]|7[06789]|8[123456789]|9[012346789])\d{7}$/;
        return re.test(phone);
    }

    /// Validate name
    static validateName(name) {
        var re = /^[a-zA-Z][a-zA-Z\s]*$/;
        return re.test(name);
    }

    /**
     * Validate phone PBX
     */
    static validatePhonePBX(phone) {
        var re = /^1[89]00\d{4}$/;
        return re.test(phone);
    }

    /**
     * Validate fax
     */
    static validateFax(phone) {
        var re = /^0(2[0123456789])\d{8}$/;
        return re.test(phone);
    }

    /**
     * Validate phone contain special character
     * @param {*} text
     */
    static validatePhoneContainSpecialCharacter(text) {
        var re = /\W|_/g;
        return re.test(text);
    }

    /**
     * Validate phone contain word
     * @param {*} text
     */
    static validatePhoneContainWord(text) {
        var re = /[a-z|A-Z]/;
        return re.test(text);
    }

    /**
     * Validate date
     */
    static validateDate(dateOfBird) {
        var re =
            /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
        return re.test(dateOfBird);
    }

    /**
     * Validate date of bird
     */
    static validateTime(time) {
        var re = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
        return re.test(time);
    }

    /**
     * Validate space
     * @param {} passWord
     */
    static validateSpaces(passWord) {
        var re = /^\s+|\s+$/g;
        return re.test(passWord);
    }

    static validateSpacesPass(passWord) {
        return passWord.match(' ') == null ? false : true;
    }

    static validateContainUpperPassword(passWord) {
        var re = /[A-Z]/;
        return re.test(passWord);
    }

    /**
     * Check data null
     * @param {*} data
     */
    static isNull(data) {
        if (data == undefined || data == null || data.length == 0) {
            return true;
        } else if (typeof data == 'string') {
            return StringUtil.isNullOrEmpty(data);
        }
        return false;
    }

    /**
     * Random String
     * @param {*} length
     * @param {*} chars
     */
    static randomString(length, chars) {
        var result = '';
        for (var i = length; i > 0; --i)
            result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
    }

    /**
     * Get length of number
     * Ex: 12 => func return 2
     * Ex: 1  => func return 1
     * @param {*} number
     */
    static getLength(number) {
        return (number + '').replace('.', '').length; // for floats
    }

    /**
     * Get language
     * @param {*} deviceLocale
     */
    static isEnglishLanguage(deviceLocale) {
        if (deviceLocale == 'vi' || deviceLocale == 'vi-VN') {
            return false;
        } else if (
            deviceLocale == 'en-US' ||
            deviceLocale == 'en' ||
            deviceLocale == 'en-UK'
        ) {
            return true;
        }
    }

    /**
     * clone object
     * @param {*} _object
     */
    static cloneObject(_object) {
        return JSON.parse(JSON.stringify(_object));
    }

    /**
     * Convert image, video ios to loca path
     */
    static convertLocalIdentifierIOSToAssetLibrary = (
        localIdentifier,
        isPhoto,
    ) => {
        if (localIdentifier.indexOf('file://') != -1) {
            return localIdentifier;
        }
        var regex = /:\/\/(.{36})\//i;
        var result = localIdentifier.match(regex);
        if (!Utils.isNull(result)) {
            const ext = isPhoto ? 'JPG' : 'MOV';
            return `assets-library://asset/asset.${ext}?id=${result[1]}&ext=${ext}`;
        }
        return localIdentifier;
    };

    /**
     * Check iphon x or above
     */
    static isIphoneXorAbove() {
        const dimen = Dimensions.get('window');
        return (
            Platform.OS === 'ios' &&
            !Platform.isPad &&
            !Platform.isTVOS &&
            (dimen.height === 812 ||
                dimen.width === 812 ||
                dimen.height === 896 ||
                dimen.width === 896)
        );
    }

    /**
     * Rotate image
     */
    static rotateImage(orientation) {
        let degRotation;
        switch (orientation) {
            case 90:
                degRotation = 90;
                break;
            case 270:
                degRotation = -90;
                break;
            case 180:
                degRotation = 180;
                break;
            default:
                degRotation = 0;
        }
        return degRotation;
    }

    /**
     * Format bytes
     * @param {*} bytes
     * @param {*} decimals
     */
    static formatBytes(bytes, decimals) {
        if (bytes == 0) return '0 Bytes';
        var k = 1024,
            dm = decimals <= 0 ? 0 : decimals || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return console.log(
            parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i],
        );
    }

    /**
     * Status bar height
     */
    static getStatusBarHeight(skipAndroid) {
        return Platform.select({
            ios: isIPhoneWithMonobrow_v ? 44 : 20,
            android: skipAndroid ? 0 : StatusBar.currentHeight,
            default: 0,
        });
    }

    /// percent width
    static percentWidth = percentage => {
        const value = (percentage * W_WIDTH) / 100;
        return Math.round(value);
    };

    /// percent height
    static percentHeight = percentage => {
        const value = (percentage * W_HEIGHT) / 100;
        return Math.round(value);
    };

    static isNumber = n => {
        return _.isNumber(n);
    };

    static formatColor = (color, opacity) => {
        return color + Math.floor(opacity * 255).toString(16);
    };

    static formatNumber = sale => {
        let num = sale;
        if (num == null) {
            return '';
        }
        if (num < 1000) {
            return num.toString();
        } else if (num < 1000000) {
            let r = num / 1000;
            return Math.floor(r * 100) / 100 + 'K';
        } else if (num < 1000000000) {
            let r = num / 1000000;
            return Math.floor(r * 100) / 100 + 'Tr';
        } else {
            let r = num / 1000000000;
            return Math.floor(r * 100) / 100 + 'Tỷ';
        }
    };

    static showMessage(message, duration = 30000, type = 'warning') {
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

    static showCameraRollView = async (params, navigation) => {
        let hasPermission = false;
        if (
            Platform.OS === 'ios' ||
            (Platform.OS === 'android' && Platform.Version < 23)
        ) {
            hasPermission = true;
        }

        hasPermission = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );

        const status = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );

        if (status === PermissionsAndroid.RESULTS.GRANTED) hasPermission = true;

        console.log('hasPermission', hasPermission);
        if (status === PermissionsAndroid.RESULTS.DENIED) {
            console.log('Permission denied by user.');
        } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        }
        if (hasPermission) navigation.navigate('CameraRoll', params);
    };

    static getTypeResource = type => {
        let resType = 0;
        switch (type) {
            case 'video/mp4':
            case 'video/3gpp':
            case 'video/3gpp2':
            case 'video/x-flv':
            case 'application/x-mpegURL':
            case 'video/MP2T':
            case 'video/quicktime':
            case 'video/x-msvideo':
            case 'video/x-matroska':
            case 'video/x-ms-wmv':
            case 'video':
                resType = resourceType.VIDEO;
                break;
            case 'image/png':
            case 'image/jpeg':
            case 'image/apng':
            case 'image/bmp':
            case 'image/gif':
            case 'image/x-icon':
            case 'image/svg+xml':
            case 'image/tiff':
            case 'image/webp':
            case 'image':
                resType = resourceType.IMAGE;
                break;
            default:
                break;
        }
        return resType;
    };
}
