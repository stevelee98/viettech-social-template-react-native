import { NavigationContainer } from '@react-navigation/native';
import {
    createStackNavigator,
    TransitionPresets,
} from '@react-navigation/stack';
import CameraRollView from 'containers/cameraRoll/cameraRollView';
import HomeView from 'containers/home/homeView';
import LoginView from 'containers/login/loginView';
import AddNewFeedView from 'containers/newfeed/add/addNewFeedView';
import NewfeedDetailView from 'containers/newfeed/detail/newfeedDetailView';
import ProfileView from 'containers/profile/profileView';
import React from 'react';
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
                <Stack.Screen name="Profile" component={ProfileView} />
                <Stack.Screen name="AddNewFeed" component={AddNewFeedView} />
                <Stack.Screen
                    name="NewfeedDetail"
                    component={NewfeedDetailView}
                />
                <Stack.Screen name="CameraRoll" component={CameraRollView} />
            </Stack.Navigator>
            {/* <DrawerNavigation /> */}
        </NavigationContainer>
    );
};

export default AppNavigator;
// const Drawer = createDrawerNavigator();

// function DrawerNavigation() {
//     return (
//         <Drawer.Navigator initialRouteName="Home">
//             <Drawer.Screen name="Home" component={HomeView} />
//             <Drawer.Screen name="Profile" component={ProfileView} />
//             <Drawer.Screen name="Login" component={LoginView} />
//             <Drawer.Screen name="AddNewFeed" component={AddNewFeedView} />
//             <Drawer.Screen name="NewfeedDetail" component={NewfeedDetailView} />
//             <Drawer.Screen name="CameraRoll" component={CameraRollView} />
//         </Drawer.Navigator>
//     );
// }
