import { NavigationContainer } from '@react-navigation/native';
import {
    createStackNavigator,
    TransitionPresets,
} from '@react-navigation/stack';
import HomeView from 'containers/home/homeView';
import LoginView from 'containers/login/loginView';
import AddNewFeedView from 'containers/newfeed/add/addNewFeedView';
import NewfeedDetailView from 'containers/newfeed/detail/newfeedDetailView';
import React from 'react';
import { Platform } from 'react-native';
import { enableScreens } from 'react-native-screens';

enableScreens();

const Stack = createStackNavigator();

const AppNavigator = props => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={props.startScreen || 'Home'}
                headerMode={'none'}
                // mode={'modal'}
                screenOptions={{
                    useNativeDriver: true,
                    gestureEnabled: Platform.OS === 'ios',
                    cardOverlayEnabled: true,
                    ...TransitionPresets.SlideFromRightIOS,
                }}
            >
                <Stack.Screen name="Login" component={LoginView} />
                <Stack.Screen name="Home" component={HomeView} />
                <Stack.Screen name="AddNewFeed" component={AddNewFeedView} />
                <Stack.Screen
                    name="NewfeedDetail"
                    component={NewfeedDetailView}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
