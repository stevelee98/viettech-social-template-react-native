import { useNavigation } from '@react-navigation/native';
import Hr from 'components/hr';
import MainList from 'components/mainList';
import { localizes } from 'locales/i18n';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';
import { Colors } from 'values/colors';
import ItemNewfeed from './itemNewfeed';

const ListNewfeed = props => {
    const navigation = useNavigation();
    const {
        list,
        onRef,
        postItemRef,
        like = () => {},
        onRefresh,
        onLoadMore,
        enableLoadMore,
        enableRefresh,
        refreshControl,
        ListHeaderComponent,
        contentContainerStyle,
        scrollEventThrottle,
        onScroll,
        itemPerRow = 1,
        styleEmpty,
    } = props;
    const [screen, setScreen] = useState(Dimensions.get('screen'));
    const [data, setData] = useState([]);
    const listRef = useRef();

    useEffect(() => {
        Dimensions.addEventListener('change', onChangeDimensions);
        setData(list);
        return () => {
            onRef && onRef(undefined);
            Dimensions.removeEventListener('change', onChangeDimensions);
        };
    }, []);

    useEffect(() => {
        setData(list);
    }, [list]);

    const onChangeDimensions = e => {
        setScreen(e.screen);
    };

    const scrollToIndex = (index, animated = true) => {
        listRef &&
            listRef.current.scrollToIndex({
                index,
                animated,
                viewPosition: 0.5,
            });
    };

    const scrollToOffset = (offset, animated = true) => {
        listRef && listRef.current.scrollToOffset({ animated, offset: offset });
    };

    const renderItem = ({ item, index }) => {
        return (
            <ItemNewfeed
                key={index.toString()}
                item={item}
                index={index}
                length={data.length}
                gotoUser={gotoUser}
                like={like}
                onPress={onPress}
                scrollToIndex={scrollToIndex}
            />
        );
    };

    const onPress = item => {
        navigation.navigate('NewfeedDetail', {
            id: item.id,
            callback: onRefresh,
            detail: item,
        });
    };

    const gotoUser = id => {
        if (global.user.id == id) navigation.navigate('UserProfile');
        else {
            navigation.navigate('PersonalPage', { id: id });
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <MainList
                onRef={r => {
                    listRef = r;
                }}
                ListHeaderComponent={ListHeaderComponent}
                contentContainerStyle={[
                    {
                        backgroundColor: Colors.COLOR_BACKGROUND,
                    },
                    contentContainerStyle,
                ]}
                scrollEventThrottle={scrollEventThrottle}
                onScroll={onScroll}
                style={{ flex: 1 }}
                keyExtractor={item => item.id}
                extraData={data}
                data={data}
                itemPerRow={itemPerRow}
                renderItem={renderItem}
                enableRefresh={enableRefresh}
                refreshControl={refreshControl}
                enableLoadMore={enableLoadMore}
                onLoadMore={onLoadMore}
                showsVerticalScrollIndicator={false}
                isShowEmpty={data.length == 0}
                textForEmpty={localizes('nodata')}
                styleEmpty={styleEmpty}
                ItemSeparatorComponent={() => <Hr />}
            />
        </View>
    );
};

export default ListNewfeed;
