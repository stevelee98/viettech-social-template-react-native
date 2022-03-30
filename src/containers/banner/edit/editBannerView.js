import { ActionEvent, getActionSuccess } from 'actions/actionEvent';
import * as bannerActions from 'actions/bannerActions';
import ButtonCustom from 'components/button';
import DialogCustom from 'components/dialogCustom';
import ImageLoader from 'components/imageLoader';
import TextInputCustom from 'components/textInputCustom';
import { ErrorCode } from 'config/errorCode';
import ServerPath from 'config/Server';
import BaseView from 'containers/base/baseView';
import actionClickBannerType from 'enum/actionClickBannerType';
import PlatformType from 'enum/platformType';
import ScreenType from 'enum/screenType';
import StatusType from 'enum/statusType';
import ic_add_image_gray from 'images/ic_add_image_gray.png';
import ic_delete_orange from 'images/ic_delete_orange.png';
import ic_edit_orange from 'images/ic_edit_orange.png';
import { localizes } from 'locales/i18n';
import { Container, Content, Root } from 'native-base';
import {
    Dimensions,
    Image,
    Keyboard,
    Linking,
    PermissionsAndroid,
    Platform,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Upload from 'react-native-background-upload';
import { CheckBox } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import { connect } from 'react-redux';
import commonStyles from 'styles/commonStyles';
import DateUtil from 'utils/dateUtil';
import StringUtil from 'utils/stringUtil';
import Utils from 'utils/utils';
import { Colors } from 'values/colors';
import configConstants from 'values/configConstants';
import { Constants } from 'values/constants';
import { Fonts } from 'values/fonts';
import styles from './styles';

const screen = Dimensions.get('window');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const CANCEL_INDEX = 2;

const optionsCamera = {
    waitAnimationEnd: false,
    includeExif: true,
    forceJpg: true,
    mediaType: 'photo',
    compressImageQuality: 0.8,
};
class EditBannerView extends BaseView {
    constructor(props, context) {
        super(props, context);
        this.state = {
            headerTitle: '',
            isDisableButton: false,
            visibleDialog: false,
            url: '',
            warnUrl: null,
            validateMobile: '',
            validateWeb: '',
            nonActionClick: true,
            isActionClick: false,
            disableUrl: false,
            typeSource: null,
            source: null,
            sourceDesktop: null,
            sourceOriginal: null,
            sourceOriginalDesktop: null,
            isWantEdit: false,
            bannerStatus: null,
        };
        const { shopId, bannerId, screenType, callback } =
            this.props.route.params;
        this.shopId = shopId;
        this.bannerId = bannerId;
        this.screenType = screenType;
        this.callback = callback;
        this.listBanner = [];
    }

    async componentDidMount() {
        super.componentDidMount();
        await this.getSourceUrlPath();
        this.setState({
            headerTitle:
                !Utils.isNull(this.screenType) &&
                this.screenType === ScreenType.FROM_CREATE_BANNER_SHOP
                    ? localizes('banner.titleCreate')
                    : this.screenType === ScreenType.FROM_EDIT_BANNER_SHOP
                    ? localizes('banner.titleEdit')
                    : '',
        });
        this.screenType !== ScreenType.FROM_CREATE_BANNER_SHOP &&
            this.props.getBannerDetailShop(this.bannerId);
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            this.props = nextProps;
            this.handleData();
        }
    }

    /**
     * Handle refresh
     */
    handleRefresh = () => {
        this.listBanner = [];
        this.screenType !== ScreenType.FROM_CREATE_BANNER_SHOP &&
            this.props.getBannerDetailShop(this.bannerId);
    };

    /**
     * Handle data when request
     */
    handleData() {
        let data = this.props.data;
        if (this.props.errorCode != ErrorCode.ERROR_INIT) {
            if (this.props.errorCode == ErrorCode.ERROR_SUCCESS) {
                if (
                    this.props.action ==
                    getActionSuccess(ActionEvent.GET_BANNER_DETAIL_SHOP)
                ) {
                    if (!Utils.isNull(data)) {
                        this.listBanner = data;
                        this.setState({
                            source:
                                data.platform == PlatformType.MOBILE
                                    ? data.pathToResource
                                    : null,
                            sourceDesktop:
                                data.platform == PlatformType.WEB
                                    ? data.pathToResource
                                    : null,
                            nonActionClick:
                                data.actionOnClickType ==
                                actionClickBannerType.DO_NOTHING
                                    ? true
                                    : false,
                            isActionClick:
                                data.actionOnClickType ==
                                actionClickBannerType.OPEN_URL
                                    ? true
                                    : false,
                            disableUrl:
                                data.actionOnClickType ==
                                actionClickBannerType.OPEN_URL
                                    ? true
                                    : false,
                            url: JSON.parse(data.actionTarget)
                                ? JSON.parse(data.actionTarget).url
                                : '',
                            bannerStatus: data.status,
                        });
                    }
                } else if (
                    this.props.action ==
                    getActionSuccess(ActionEvent.CREATE_BANNER_SHOP)
                ) {
                    if (!Utils.isNull(data)) {
                        this.setState({
                            url: '',
                            warnUrl: '',
                            isDisableButton: false,
                        });
                        if (this.callback != null) {
                            this.callback();
                        }
                        this.onBack();
                        this.showMessage(
                            localizes('banner.createBannerSuccess'),
                        );
                    }
                } else if (
                    this.props.action ==
                    getActionSuccess(ActionEvent.UPDATE_BANNER_SHOP)
                ) {
                    if (!Utils.isNull(data)) {
                        this.showMessage(
                            localizes(
                                this.screenType ==
                                    ScreenType.FROM_DELETE_BANNER_SHOP
                                    ? 'banner.deleteSuccess'
                                    : 'banner.editBannerSuccess',
                            ),
                        );
                        this.screenType = ScreenType.FROM_DETAIL_BANNER_SHOP;
                        this.setState({
                            headerTitle: '',
                            isDisableButton: false,
                        });
                        if (this.callback != null) {
                            this.callback();
                        }
                        this.handleRefresh();
                    }
                }
            } else {
                this.handleError(this.props.errorCode, this.props.error);
            }
        }
    }

    render() {
        const { headerTitle } = this.state;
        return (
            <Container style={styles.container}>
                <Root>
                    {this.renderHeaderView({
                        title: headerTitle,
                        renderRightMenu:
                            this.screenType ===
                            ScreenType.FROM_CREATE_BANNER_SHOP
                                ? null
                                : this.renderRightMenu,
                    })}
                    <Content>{this.renderContentInput()}</Content>
                    {this.renderFileSelectionDialog()}
                    {this.alertEditBanner()}
                    {this.screenType == ScreenType.FROM_EDIT_BANNER_SHOP ||
                    this.screenType == ScreenType.FROM_CREATE_BANNER_SHOP
                        ? this.renderCreateBanner()
                        : null}
                </Root>
            </Container>
        );
    }

    /**
     * Render right menu
     */
    renderRightMenu = () => {
        const { enableDelete, isSearch, bannerStatus } = this.state;
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {this.screenType === ScreenType.FROM_DETAIL_BANNER_SHOP &&
                bannerStatus != StatusType.DELETE ? (
                    <TouchableOpacity
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        style={{
                            padding: Constants.PADDING8,
                        }}
                        onPress={() => {
                            this.screenType =
                                ScreenType.FROM_DELETE_BANNER_SHOP;
                            this.setState({
                                isWantEdit: true,
                            });
                        }}
                    >
                        <Image source={ic_delete_orange} />
                    </TouchableOpacity>
                ) : null}
                {this.screenType === ScreenType.FROM_DETAIL_BANNER_SHOP &&
                bannerStatus == StatusType.DRAFT ? (
                    <TouchableOpacity
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        style={{
                            padding: Constants.PADDING8,
                        }}
                        onPress={() => {
                            this.screenType = ScreenType.FROM_EDIT_BANNER_SHOP;
                            this.setState({
                                headerTitle: localizes('banner.titleEdit'),
                            });
                        }}
                    >
                        <Image source={ic_edit_orange} />
                    </TouchableOpacity>
                ) : null}
            </View>
        );
    };

    /**
     * Render content input
     */
    renderContentInput = () => {
        const { url, warnUrl, disableUrl } = this.state;
        return (
            <View style={styles.contentInput}>
                {this.renderBannerImage()}
                {this.screenType !== ScreenType.FROM_DETAIL_BANNER_SHOP &&
                this.screenType !== ScreenType.FROM_DELETE_BANNER_SHOP
                    ? this.renderActionBox()
                    : null}
                {this.screenType !== ScreenType.FROM_EDIT_BANNER_SHOP &&
                this.screenType !== ScreenType.FROM_CREATE_BANNER_SHOP
                    ? this.renderInfoBox()
                    : null}
                {this.screenType !== ScreenType.FROM_DETAIL_BANNER_SHOP &&
                this.screenType !== ScreenType.FROM_DELETE_BANNER_SHOP ? (
                    <TextInputCustom
                        label={localizes('banner.linkBanner')}
                        warnLabel={warnUrl}
                        onRef={input => (this.url = input)}
                        isInputNormal={true}
                        placeholder={localizes('banner.linkBanner')}
                        value={url}
                        autoCapitalize={'none'}
                        onChangeText={url =>
                            this.setState({
                                url,
                                warnUrl: null,
                            })
                        }
                        onSubmitEditing={() => {
                            Keyboard.dismiss();
                        }}
                        styleInputGroup={{
                            backgroundColor: !disableUrl
                                ? Colors.COLOR_EDITABLE_GRAY
                                : null,
                        }}
                        editable={disableUrl}
                        returnKeyType={'next'}
                        onBlur={() => {
                            this.setState({ warnUrl: null });
                        }}
                    />
                ) : null}
            </View>
        );
    };

    /**
     * Render input banner image
     */
    renderBannerImage = () => {
        const { sourceDesktop, source, validateWeb, validateMobile } =
            this.state;
        let isSocialMobile = !Utils.isNull(source)
            ? source.indexOf('http') != -1
                ? true
                : false
            : false;
        let bannerMobile = isSocialMobile
            ? source
            : this.resourceUrlPathResize.textValue + '=' + source;
        let isSocialDesktop = !Utils.isNull(sourceDesktop)
            ? sourceDesktop.indexOf('http') != -1
                ? true
                : false
            : false;
        let bannerDesktop = isSocialDesktop
            ? sourceDesktop
            : this.resourceUrlPathResize.textValue + '=' + sourceDesktop;
        return (
            <View>
                {this.screenType === ScreenType.FROM_CREATE_BANNER_SHOP ||
                (this.screenType !== ScreenType.FROM_CREATE_BANNER_SHOP &&
                    !Utils.isNull(this.listBanner) &&
                    this.listBanner.platform === PlatformType.MOBILE) ? (
                    <Text
                        style={[
                            styles.txtTitleBanner,
                            {
                                color: !Utils.isNull(validateMobile)
                                    ? Colors.COLOR_RED
                                    : Colors.COLOR_TEXT,
                            },
                        ]}
                    >
                        {!Utils.isNull(validateMobile)
                            ? validateMobile
                            : localizes('banner.mobile')}
                    </Text>
                ) : null}
                {this.screenType === ScreenType.FROM_CREATE_BANNER_SHOP ||
                (this.screenType !== ScreenType.FROM_CREATE_BANNER_SHOP &&
                    !Utils.isNull(this.listBanner) &&
                    this.listBanner.platform === PlatformType.MOBILE) ? (
                    <TouchableOpacity
                        disabled={
                            this.screenType ===
                            ScreenType.FROM_DETAIL_BANNER_SHOP
                                ? true
                                : false
                        }
                        onPress={() => {
                            this.setState({
                                typeSource: PlatformType.MOBILE,
                            });
                            this.attachFile();
                        }}
                        style={[styles.btnAddImages]}
                    >
                        {!Utils.isNull(source) ? (
                            <ImageLoader
                                style={[styles.imageSize]}
                                resizeAtt={
                                    isSocialMobile ? null : styles.sourceAtt
                                }
                                resizeModeType={'cover'}
                                path={bannerMobile}
                            />
                        ) : null}
                        {Utils.isNull(source) ? (
                            <Image source={ic_add_image_gray} />
                        ) : null}
                        {Utils.isNull(source) ? (
                            <Text style={commonStyles.textMedium}>
                                {localizes('banner.ratio')}
                                <Text
                                    style={[
                                        commonStyles.textMediumBold,
                                        { color: Colors.COLOR_TEXT_LIGHT },
                                    ]}
                                >
                                    16:9
                                </Text>
                            </Text>
                        ) : null}
                    </TouchableOpacity>
                ) : null}
                {this.screenType === ScreenType.FROM_CREATE_BANNER_SHOP ||
                (this.screenType !== ScreenType.FROM_CREATE_BANNER_SHOP &&
                    !Utils.isNull(this.listBanner) &&
                    this.listBanner.platform === PlatformType.WEB) ? (
                    <Text
                        style={[
                            styles.txtTitleBanner,
                            {
                                color: !Utils.isNull(validateWeb)
                                    ? Colors.COLOR_RED
                                    : Colors.COLOR_TEXT,
                            },
                        ]}
                    >
                        {!Utils.isNull(validateWeb)
                            ? validateWeb
                            : localizes('banner.web')}
                    </Text>
                ) : null}
                {this.screenType === ScreenType.FROM_CREATE_BANNER_SHOP ||
                (this.screenType !== ScreenType.FROM_CREATE_BANNER_SHOP &&
                    !Utils.isNull(this.listBanner) &&
                    this.listBanner.platform === PlatformType.WEB) ? (
                    <TouchableOpacity
                        disabled={
                            this.screenType ===
                            ScreenType.FROM_DETAIL_BANNER_SHOP
                                ? true
                                : false
                        }
                        onPress={() => {
                            this.setState({
                                typeSource: PlatformType.WEB,
                            });
                            this.attachFile();
                        }}
                        style={[styles.btnAddDesktopImages]}
                    >
                        {!Utils.isNull(sourceDesktop) ? (
                            <ImageLoader
                                style={[styles.imageDesktopSize]}
                                resizeAtt={
                                    isSocialDesktop ? null : styles.sourceAtt
                                }
                                resizeModeType={'cover'}
                                path={bannerDesktop}
                            />
                        ) : null}
                        {Utils.isNull(sourceDesktop) ? (
                            <Image source={ic_add_image_gray} />
                        ) : null}
                        {Utils.isNull(sourceDesktop) ? (
                            <Text style={commonStyles.textMedium}>
                                {localizes('banner.ratio')}
                                <Text
                                    style={[
                                        commonStyles.textMediumBold,
                                        { color: Colors.COLOR_TEXT_LIGHT },
                                    ]}
                                >
                                    16:5
                                </Text>
                            </Text>
                        ) : null}
                    </TouchableOpacity>
                ) : null}
            </View>
        );
    };

    /**
     * Render action box
     */
    renderActionBox = () => {
        return (
            <View style={styles.actionBox}>
                <Text style={styles.actionTitle}>
                    {localizes('banner.actionClick')}
                </Text>
                <View style={styles.titleInfoBox}>
                    <CheckBox
                        title={null}
                        checkedColor={Colors.COLOR_PRIMARY}
                        checked={this.state.nonActionClick}
                        containerStyle={styles.checkBox}
                        onPress={() => {
                            this.setState({
                                nonActionClick: !this.state.nonActionClick,
                                isActionClick: !this.state.isActionClick,
                                warnUrl: null,
                                disableUrl: false,
                            });
                        }}
                    />
                    <TouchableOpacity
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        onPress={() => {
                            this.setState({
                                nonActionClick: !this.state.nonActionClick,
                                isActionClick: !this.state.isActionClick,
                                warnUrl: null,
                                disableUrl: false,
                            });
                        }}
                    >
                        <Text style={styles.txtAction}>
                            {localizes('banner.notAction')}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleInfoBox}>
                    <CheckBox
                        title={null}
                        checkedColor={Colors.COLOR_PRIMARY}
                        checked={this.state.isActionClick}
                        containerStyle={styles.checkBox}
                        onPress={() => {
                            this.setState({
                                nonActionClick: !this.state.nonActionClick,
                                isActionClick: !this.state.isActionClick,
                                warnUrl: null,
                                disableUrl: true,
                            });
                        }}
                    />
                    <TouchableOpacity
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        onPress={() => {
                            this.setState({
                                nonActionClick: !this.state.nonActionClick,
                                isActionClick: !this.state.isActionClick,
                                warnUrl: null,
                                disableUrl: true,
                            });
                        }}
                    >
                        <Text style={styles.txtAction}>
                            {localizes('banner.linkBanner')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    /**
     * Render info banner box
     */
    renderInfoBox = () => {
        return (
            <View style={styles.infoBox}>
                <View style={styles.titleInfoBox}>
                    <Text style={styles.infoTitle}>
                        {localizes('banner.action')}
                    </Text>
                    <TouchableOpacity
                        disabled={
                            !Utils.isNull(this.listBanner) &&
                            this.listBanner.actionOnClickType !==
                                actionClickBannerType.OPEN_URL
                        }
                        style={{ flex: 1 }}
                        activeOpacity={Constants.ACTIVE_OPACITY}
                        onPress={() =>
                            Linking.openURL(
                                JSON.parse(this.listBanner.actionTarget).url,
                            )
                        }
                    >
                        <Text
                            style={[
                                styles.txtActionType,
                                {
                                    textDecorationLine:
                                        this.listBanner.actionOnClickType ===
                                        actionClickBannerType.OPEN_URL
                                            ? 'underline'
                                            : null,
                                },
                            ]}
                        >
                            {!Utils.isNull(this.listBanner)
                                ? this.renderTypeAction(
                                      this.listBanner.actionOnClickType,
                                  )
                                : '-'}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.titleInfoBox}>
                    <Text style={styles.infoTitle}>
                        {localizes('banner.time')}
                    </Text>
                    <Text style={styles.txtActionType}>
                        {!Utils.isNull(this.listBanner)
                            ? DateUtil.convertFromFormatToFormat(
                                  this.listBanner.createAt,
                                  DateUtil.FORMAT_DATE_TIME_ZONE,
                                  DateUtil.FORMAT_TIME_DATE,
                              )
                            : '-'}
                    </Text>
                </View>
                <View style={styles.titleInfoBox}>
                    <Text style={styles.infoTitle}>
                        {localizes('banner.status')}
                    </Text>
                    <Text style={styles.txtStatus}>
                        {!Utils.isNull(this.listBanner)
                            ? this.renderStatus(this.listBanner.status)
                            : '-'}
                    </Text>
                </View>
            </View>
        );
    };

    /**
     * Render action type banner
     */
    renderTypeAction = type => {
        let url = !Utils.isNull(this.listBanner)
            ? JSON.parse(this.listBanner.actionTarget)
                ? JSON.parse(this.listBanner.actionTarget).url
                : '-'
            : '-';
        switch (type) {
            case actionClickBannerType.DO_NOTHING:
                return localizes('banner.notAction');
            case actionClickBannerType.OPEN_URL:
                return url;
            default:
                return localizes('banner.notAction');
        }
    };

    /**
     * Render status banner
     */
    renderStatus = status => {
        switch (status) {
            case StatusType.DRAFT:
                return 'Đang chờ duyệt';
            case StatusType.ACTIVE:
                return 'Đã duyệt';
            case StatusType.DELETE:
                return 'Đã xóa';
            case StatusType.SUSPENDED:
                return 'Bị từ chối';
        }
    };

    /**
     * Render create banner
     */
    renderCreateBanner = () => {
        return (
            <View style={commonStyles.buttonFixedBottom}>
                <ButtonCustom
                    disabled={this.state.isDisableButton}
                    title={
                        this.screenType === ScreenType.FROM_EDIT_BANNER_SHOP
                            ? localizes('banner.update')
                            : localizes('banner.create')
                    }
                    onPress={this.onPressValidate}
                />
            </View>
        );
    };

    /**
     * onPress validate input
     */
    onPressValidate = () => {
        const {
            url,
            isActionClick,
            nonActionClick,
            source,
            sourceOriginal,
            sourceDesktop,
            sourceOriginalDesktop,
            typeSource,
        } = this.state;
        if (
            this.screenType === ScreenType.FROM_CREATE_BANNER_SHOP &&
            Utils.isNull(source) &&
            Utils.isNull(sourceDesktop)
        ) {
            this.setState({
                validateMobile: localizes('banner.validateImageBanner'),
            });
            return false;
        } else if (isActionClick && Utils.isNull(url)) {
            this.setState({
                warnUrl: localizes('banner.errFillLink'),
            });
            this.url.focus();
            return false;
        } else if (!Utils.isNull(url) && !StringUtil.ValidURL(url)) {
            this.setState({
                warnUrl: localizes('banner.errLink'),
            });
            this.url.focus();
            return false;
        } else {
            if (this.screenType === ScreenType.FROM_CREATE_BANNER_SHOP) {
                this.requestEdit();
            } else {
                this.setState({
                    isWantEdit: true,
                });
            }
        }
    };

    requestEdit = () => {
        const {
            url,
            isActionClick,
            nonActionClick,
            source,
            sourceOriginal,
            sourceDesktop,
            sourceOriginalDesktop,
            typeSource,
            bannerStatus,
        } = this.state;
        this.setState({
            isDisableButton: true,
        });
        let filter = {
            urlClick: !nonActionClick && !Utils.isNull(url) ? url.trim() : null,
            bannerPath: !Utils.isNull(source) ? source : null,
            originalPath: !Utils.isNull(sourceOriginal) ? sourceOriginal : null,
            bannerPathWeb: !Utils.isNull(sourceDesktop) ? sourceDesktop : null,
            originalPathWeb: !Utils.isNull(sourceOriginalDesktop)
                ? sourceOriginalDesktop
                : null,
            actionClickType: nonActionClick
                ? actionClickBannerType.DO_NOTHING
                : actionClickBannerType.OPEN_URL,
            shopId: !Utils.isNull(this.shopId) ? this.shopId : null,
            bannerId: !Utils.isNull(this.bannerId) ? this.bannerId : null,
            platform: this.listBanner.platform,
            status:
                bannerStatus == StatusType.ACTIVE &&
                this.screenType == ScreenType.FROM_EDIT_BANNER_SHOP
                    ? StatusType.DRAFT
                    : this.screenType == ScreenType.FROM_DELETE_BANNER_SHOP
                    ? StatusType.DELETE
                    : StatusType.DRAFT,
        };
        if (this.screenType === ScreenType.FROM_CREATE_BANNER_SHOP) {
            this.props.createBannerShop(filter);
        } else if (
            this.screenType === ScreenType.FROM_EDIT_BANNER_SHOP ||
            this.screenType === ScreenType.FROM_DELETE_BANNER_SHOP
        ) {
            this.props.updateBannerShop(filter);
        }
    };

    /**
     * Called when selected type
     * @param {*} index
     */
    onSelectedType(index) {
        if (index !== CANCEL_INDEX) {
            if (index === 0) {
                this.takePhoto();
            } else if (index === 1) {
                this.showDocumentPicker();
            }
        } else {
            this.hideDialog();
        }
    }

    /**
     * Take a photo
     */
    takePhoto = async () => {
        await this.launchCamera(uri => {
            this.hideDialog();
            if (!Utils.isNull(uri)) {
                setTimeout(() => {
                    this.handleUploadOriginalImage(uri.path);
                    this.openCropBanner(uri);
                }, 500);
            }
        });
    };

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
                let dimensions = JSON.parse(this.dimensionsBanner.textValue);
                let widthImage = parseInt(dimensions[0].size.minWidth) || 640;
                let heightImage = parseInt(dimensions[0].size.minHeight) || 360;
                if (image.size / this.oneMB > maxSizeUpload) {
                    this.showMessage(
                        'Không thể chọn ảnh, vì kích thước lớn hơn ' +
                            maxSizeUpload +
                            ' MB.',
                    );
                    return callback(null);
                } else if (
                    image.width < widthImage ||
                    image.height < heightImage
                ) {
                    this.showMessage(
                        'Không thể chọn ảnh, vì có kích thước nhỏ hơn ' +
                            widthImage +
                            'x' +
                            heightImage,
                    );
                    return callback(null);
                } else {
                    return callback(image);
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
                let dimensions = JSON.parse(this.dimensionsBanner.textValue);
                let widthImage = parseInt(dimensions[0].size.minWidth) || 640;
                let heightImage = parseInt(dimensions[0].size.minHeight) || 360;
                if (image.size / this.oneMB > maxSizeUpload) {
                    this.showMessage(
                        'Không thể chọn ảnh, vì kích thước lớn hơn ' +
                            maxSizeUpload +
                            ' MB.',
                    );
                    return callback(null);
                } else if (
                    image.width < widthImage ||
                    image.height < heightImage
                ) {
                    this.showMessage(
                        'Không thể chọn ảnh, vì có kích thước nhỏ hơn ' +
                            widthImage +
                            'x' +
                            heightImage,
                    );
                    return callback(null);
                } else {
                    return callback(image);
                }
            })
            .catch(e => this.saveException(e, 'onChooseImageProduct'));
    };

    /**
     * open crop banner
     */
    openCropBanner = uri => {
        ImagePicker.openCropper({
            path: uri.path,
            width: uri.width,
            height:
                this.state.typeSource == PlatformType.WEB
                    ? (uri.width * 5) / 16
                    : (uri.width * 9) / 16,
        }).then(image => {
            this.handleUploadImage(image.path);
            if (this.state.typeSource == PlatformType.MOBILE) {
                this.setState({
                    validateMobile: null,
                    validateWeb: null,
                });
            } else if (this.state.typeSource == PlatformType.WEB) {
                this.setState({
                    validateMobile: null,
                    validateWeb: null,
                });
            }
        });
    };

    /**
     * Attach file
     */
    attachFile = () => {
        this.showDialog();
    };

    /**
     * Show dialog
     */
    showDialog() {
        this.setState({
            visibleDialog: true,
        });
    }

    /**
     * Show document picker
     */
    showDocumentPicker = async () => {
        await this.launchImageLibrary(uri => {
            this.hideDialog();
            if (!Utils.isNull(uri)) {
                setTimeout(() => {
                    this.handleUploadOriginalImage(uri.path);
                    this.openCropBanner(uri);
                }, 500);
            }
        });
    };

    /**
     * Handle upload image
     * @param {*} uri
     */
    handleUploadImage = uri => {
        let uriReplace = uri;
        if (Platform.OS == 'android') {
            uriReplace = uri.replace('file://', '');
        }
        let file = {
            fileType: 'image/*',
            filePath: uriReplace,
        };
        const options = {
            url:
                ServerPath.API_URL +
                `banner/upload/resource/${this.shopId}/shop`,
            path: file.filePath,
            method: 'POST',
            field: 'file',
            type: 'multipart',
            headers: {
                'Content-Type': 'application/json', // Customize content-type
                'X-APITOKEN': global.token,
            },
            notification: {
                enabled: true,
                onProgressTitle: 'Đang tải ảnh lên...',
                autoClear: true,
            },
        };
        Upload.startUpload(options)
            .then(uploadId => {
                console.log('Upload started');
                Upload.addListener('progress', uploadId, data => {
                    console.log(`Progress: ${data.progress}%`);
                });
                Upload.addListener('error', uploadId, data => {
                    console.log(`Error: ${data.error}%`);
                });
                Upload.addListener('cancelled', uploadId, data => {
                    console.log(`Cancelled!`);
                });
                Upload.addListener('completed', uploadId, data => {
                    // data includes responseCode: number and responseBody: Object
                    console.log('Completed!');
                    if (!Utils.isNull(data.responseBody)) {
                        let result = JSON.parse(data.responseBody);
                        if (
                            !Utils.isNull(result.data) &&
                            this.state.typeSource == PlatformType.MOBILE
                        ) {
                            this.setState({
                                source: result.data,
                            });
                        } else if (
                            !Utils.isNull(result.data) &&
                            this.state.typeSource == PlatformType.WEB
                        ) {
                            this.setState({
                                sourceDesktop: result.data,
                            });
                        }
                    }
                });
            })
            .catch(error => {
                this.saveException(error, 'showDocumentPicker');
            });
    };

    /**
     * Handle upload original image
     * @param {*} uri
     */
    handleUploadOriginalImage = uri => {
        this.hideDialog();
        let uriReplace = uri;
        if (Platform.OS == 'android') {
            uriReplace = uri.replace('file://', '');
        }
        let file = {
            fileType: 'image/*',
            filePath: uriReplace,
        };
        console.log('URI: ', file.filePath);
        const options = {
            url:
                ServerPath.API_URL +
                `banner/upload/original/${this.shopId}/shop`,
            path: file.filePath,
            method: 'POST',
            field: 'file',
            type: 'multipart',
            headers: {
                'Content-Type': 'application/json', // Customize content-type
                'X-APITOKEN': global.token,
            },
            notification: {
                enabled: true,
                onProgressTitle: 'Đang tải ảnh lên...',
                autoClear: true,
            },
        };
        Upload.startUpload(options)
            .then(uploadId => {
                console.log('Upload started');
                Upload.addListener('progress', uploadId, data => {
                    console.log(`Progress: ${data.progress}%`);
                });
                Upload.addListener('error', uploadId, data => {
                    console.log(`Error: ${data.error}%`);
                });
                Upload.addListener('cancelled', uploadId, data => {
                    console.log(`Cancelled!`);
                });
                Upload.addListener('completed', uploadId, data => {
                    // data includes responseCode: number and responseBody: Object
                    console.log('Completed!');
                    if (!Utils.isNull(data.responseBody)) {
                        let result = JSON.parse(data.responseBody);
                        if (
                            !Utils.isNull(result.data) &&
                            this.state.typeSource == PlatformType.MOBILE
                        ) {
                            this.setState({
                                sourceOriginal: result.data,
                            });
                        } else if (
                            !Utils.isNull(result.data) &&
                            this.state.typeSource == PlatformType.WEB
                        ) {
                            this.setState({
                                sourceOriginalDesktop: result.data,
                            });
                        }
                    }
                });
            })
            .catch(error => {
                this.saveException(error, 'showDocumentPicker');
            });
    };

    /**
     * hide dialog
     */
    hideDialog() {
        this.setState({
            visibleDialog: false,
        });
    }

    /**
     * Render file selection dialog
     */
    renderFileSelectionDialog() {
        return (
            <DialogCustom
                visible={this.state.visibleDialog}
                isVisibleTitle={true}
                isVisibleContentForChooseImg={true}
                contentTitle={localizes('userInfoView.chooseImages')}
                onTouchOutside={() => {
                    this.setState({ visibleDialog: false });
                }}
                onPressX={() => {
                    this.setState({ visibleDialog: false });
                }}
                onPressCamera={() => {
                    this.onSelectedType(0);
                }}
                onPressGallery={() => {
                    this.onSelectedType(1);
                }}
            />
        );
    }

    /**
     *  Alert edit banner
     */
    alertEditBanner = () => {
        const { bannerStatus } = this.state;
        let content =
            bannerStatus == StatusType.ACTIVE &&
            this.screenType == ScreenType.FROM_EDIT_BANNER_SHOP
                ? localizes('banner.alertEditBanner')
                : this.screenType == ScreenType.FROM_DELETE_BANNER_SHOP
                ? localizes('banner.alertDeleteBanner')
                : localizes('banner.alertEditContent');
        return (
            <DialogCustom
                visible={this.state.isWantEdit}
                isVisibleTitle={true}
                contentTitle={localizes('confirm')}
                onPress={true}
                isVisibleTwoButton={true}
                textBtnOne={localizes('cancel')}
                textBtnTwo={localizes('yes')}
                styleTextBtnTwo={{ fontSize: Fonts.FONT16 }}
                styleTextBtnOne={{ fontSize: Fonts.FONT16 }}
                isVisibleContentText={true}
                contentText={content}
                onTouchOutside={() => {
                    this.setState({ isWantEdit: false });
                    this.screenType =
                        this.screenType == ScreenType.FROM_DELETE_BANNER_SHOP
                            ? ScreenType.FROM_DETAIL_BANNER_SHOP
                            : ScreenType.FROM_EDIT_BANNER_SHOP;
                }}
                onPressX={() => {
                    this.setState({ isWantEdit: false });
                    this.screenType =
                        this.screenType == ScreenType.FROM_DELETE_BANNER_SHOP
                            ? ScreenType.FROM_DETAIL_BANNER_SHOP
                            : ScreenType.FROM_EDIT_BANNER_SHOP;
                }}
                onPressBtnPositive={() => {
                    this.setState({
                        isWantEdit: false,
                    });
                    this.requestEdit();
                }}
                onPressBtnOne={() => {
                    this.setState({ isWantEdit: false });
                    this.screenType =
                        this.screenType == ScreenType.FROM_DELETE_BANNER_SHOP
                            ? ScreenType.FROM_DETAIL_BANNER_SHOP
                            : ScreenType.FROM_EDIT_BANNER_SHOP;
                }}
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

export default connect(mapStateToProps, mapDispatchToProps)(EditBannerView);
