import languageCode from 'enum/languageCode';
import ic_close_black from 'images/ic_close_black.png';
import React, { PureComponent } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import I18n from 'react-native-i18n';
import Modal from 'react-native-modalbox';
import StorageUtil from 'utils/storageUtil';
import { Constants } from 'values/constants';
import styles from './styles';

export default class ModalChangeLanguage extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
        this.mChangeLanguage = React.createRef();
    }

    /// show modal
    openModal = () => {
        this.mChangeLanguage.current.open();
    };

    ///  hide Modal
    hideModal = () => {
        this.mChangeLanguage.current.close();
    };

    /// Set language
    setLanguage = language => {
        I18n.locale = language;
        global.languageCode = language;
        StorageUtil.storeItem(StorageUtil.LANGUAGE, language);
        const { onChangeLanguage } = this.props;
        onChangeLanguage && onChangeLanguage();
    };

    render() {
        return (
            <Modal
                ref={this.mChangeLanguage}
                style={styles.container}
                backdrop={true}
                onClosed={() => {
                    this.hideModal();
                }}
                position={'bottom'}
                swipeToClose={false}
                backButtonClose={true}
            >
                <TouchableOpacity
                    onPress={this.hideModal}
                    activeOpacity={Constants.ACTIVE_OPACITY}
                    style={styles.close}
                >
                    <Image source={ic_close_black} />
                </TouchableOpacity>
                <View>
                    {this.renderItemLanguage('EN - Tiếng Anh', languageCode.en )}
                    {this.renderItemLanguage('EN - Tiếng Việt', languageCode.vi )}
                </View>
            </Modal>
        );
    }

    /// Render item language
    renderItemLanguage = (title, languageCode) => {
        const buttonStyle =
            global.languageCode === languageCode
                ? styles.active
                : styles.unActive;
        const textStyle =
            global.languageCode === languageCode
                ? styles.textActive
                : styles.textUnActive;
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setLanguage(languageCode);
                }}
                style={
                    buttonStyle
                }
                activeOpacity={Constants.ACTIVE_OPACITY}
            >
                <Text
                    style={
                        textStyle
                    }
                >
                    {title}
                </Text>
            </TouchableOpacity>
        );
    };
}
