import ic_cancel_white from 'images/ic_cancel_white.png';
import React, { useImperativeHandle, useRef, useState } from 'react';
import {
    Image,
    Modal,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';
import { Fonts } from 'values/fonts';

const ModalImageViewer = (props, ref) => {
    const [isVisible, setVisible] = useState(false);
    const [indexZoom, setIndexZoom] = useState(0);
    const [images, setImages] = useState([]);
    const modalImageViewer = useRef();

    useImperativeHandle(ref, () => ({
        showModal,
    }));

    /// Show modal
    const showModal = (images, indexZoom) => {
        setVisible(true);
        setImages(images);
        console.log('indexZoom', indexZoom);
        setIndexZoom(indexZoom);
        StatusBar.setHidden(true);
    };

    /// Hide modal
    const hideModal = () => {
        setVisible(false);
        StatusBar.setHidden(false);
    };

    return (
        <Modal
            ref={modalImageViewer}
            onRequestClose={hideModal}
            visible={isVisible}
            transparent={true}
            useNativeDriver={true}
            style={{ flex: 1, height: '100%' }}
        >
            <ImageViewer
                enableSwipeDown={true}
                onCancel={hideModal}
                imageUrls={images}
                index={indexZoom}
                saveToLocalByLongPress={false}
                onChange={indexZoom => setIndexZoom(indexZoom)}
            />
            <TouchableOpacity style={styles.btnClose} onPress={hideModal}>
                <Image source={ic_cancel_white} />
            </TouchableOpacity>
        </Modal>
    );
};

export default React.forwardRef(ModalImageViewer);

const styles = StyleSheet.create({
    text: {
        color: Colors.COLOR_TEXT,
        fontSize: Fonts.FONT14,
    },
    btnClose: {
        backgroundColor: Colors.COLOR_BACKGROUND_BUTTON_HEADER,
        borderRadius: Constants.BORDER_RADIUS,
        padding: Constants.PADDING + 2,
        position: 'absolute',
        top: 0,
        right: 0,
        alignSelf: 'flex-end',
        margin: Constants.PADDING16,
    },
});
