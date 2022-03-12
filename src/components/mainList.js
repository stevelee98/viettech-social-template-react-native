import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    View,
} from 'react-native';
import { Colors } from 'values/colors';
import { Constants } from 'values/constants';

MainList.defaultProps = {
    enableRefresh: true,
    showEmpty: true,
    styleEmpty: {},
    styleTextEmpty: {},
    isRefreshing: false,
    contentContainerStyle: {},
    isLoadingMore: false,
    renderItem: () => {},
    ListFooterComponent: () => {},
};

function MainList(props) {
    let onEndReachedCalledDuringMomentum = true; // End reached

    /// Render footer
    let renderFooter = () => {
        return (
            <View style={{ padding: Constants.MARGIN16 }}>
                <ActivityIndicator color={Colors.COLOR_PRIMARY} />
            </View>
        );
    };

    /// Render empty text if data null
    const renderEmptyComponent = () => {
        return (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                }}
            >
                <Text style={props.tyleTextEmpty}>No data found</Text>
            </View>
        );
    };

    return (
        <FlatList
            {...props}
            contentContainerStyle={[
                { flexGrow: 1 },
                props.contentContainerStyle,
            ]}
            data={props.data}
            refreshing={props.isRefreshing}
            refreshControl={
                props.enableRefresh ? (
                    <RefreshControl
                        colors={[Colors.COLOR_PRIMARY]}
                        tintColor={Colors.COLOR_PRIMARY}
                        refreshing={props.isRefreshing}
                        onRefresh={props.onRefresh}
                    />
                ) : null
            }
            renderItem={(item, index) => props.renderItem(item, index)}
            keyExtractor={(item, index) => String(index)}
            ListFooterComponent={
                props.isLoadingMore
                    ? renderFooter()
                    : props.ListFooterComponent
                    ? props.ListFooterComponent()
                    : null
            }
            onEndReachedThreshold={0.2}
            onMomentumScrollBegin={() => {
                onEndReachedCalledDuringMomentum = false;
            }}
            onEndReached={() => {
                if (!onEndReachedCalledDuringMomentum && props.isLoadingMore) {
                    if (props.isLoadingMore) {
                        props.onLoadMore();
                    }
                    onEndReachedCalledDuringMomentum = true;
                }
            }}
            ListEmptyComponent={() =>
                props.showEmpty
                    ? renderEmptyComponent(
                          props.styleEmpty,
                          props.styleTextEmpty,
                      )
                    : null
            }
            contentInset={{ bottom: Constants.MARGIN16 }}
        />
    );
}

export default React.memo(MainList);
