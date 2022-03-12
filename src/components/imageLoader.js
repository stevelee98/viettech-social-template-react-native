import ImageDefaultType from 'enum/imageDefaultType';
import ic_default_user from 'images/ic_default_user.png';
import img_no_image from 'images/img_no_image.png';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import FastImage from 'react-native-fast-image';
import StringUtil from 'utils/stringUtil';
import Utils from 'utils/utils';

const ImageLoader = props => {
    const [url, setUrl] = useState(null);
    const [errorImage, setErrorImage] = useState(null);
    const { path, resizeMode, style, imageDefaultType } = props;

    useEffect(() => {
        setUrl(errorImage);
        handlePath();
    }, []);

    useEffect(() => {
        handlePath();
    });

    const onLoadStart = () => {};

    const onLoadEnd = () => {};

    //handle path
    const handlePath = () => {
        if (url != path) {
            if (StringUtil.isNullOrEmpty(path)) {
                setUrl(errorImage);
            } else {
                setUrl(path);
            }
        }
    };

    //return resizeMode
    const returnResizeMode = _id => {
        let result = FastImage.resizeMode.cover;
        let id = _id ? _id.replace(/ /g, '') : '';
        if (id === 'contain') {
            result = FastImage.resizeMode.contain;
        } else if (id === 'cover') {
            result = FastImage.resizeMode.cover;
        } else if (id === 'stretch') {
            result = FastImage.resizeMode.stretch;
        } else {
            result = FastImage.resizeMode.cover;
        }
        return result;
    };

    const getImageDefault = () => {
        if (imageDefaultType == ImageDefaultType.AVATAR) {
            return ic_default_user;
        }
        return img_no_image;
    };

    const getUriImage = uri => {
        return uri !== null &&
            uri !== undefined &&
            uri.includes('/') &&
            uri.includes('.') &&
            uri.indexOf('http') != -1
            ? uri
            : '';
    };

    return (
        <>
            <FastImage
                style={[style, { backgroundColor: '#fff' }]}
                resizeMode={returnResizeMode(resizeMode)}
                source={
                    !Utils.isNull(url)
                        ? {
                              uri: url || '',
                              priority: FastImage.priority.high,
                          }
                        : getImageDefault()
                }
                onError={() => {
                    setUrl(errorImage);
                }}
                onLoadEnd={onLoadEnd}
                onLoadStart={onLoadStart}
                onProgress={e => {}}
            />
        </>
    );
};

ImageLoader.defaultProps = {
    imageDefaultType: ImageDefaultType.DEFAULT,
};

ImageLoader.propTypes = {
    imageDefaultType: PropTypes.number,
};

export default ImageLoader;
