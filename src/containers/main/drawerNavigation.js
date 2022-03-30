import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeView from 'containers/home/homeView';
import LoginView from 'containers/login/loginView';
import ProfileView from 'containers/profile/profileView';

const Drawer = createDrawerNavigator();

export default function DrawerNavigation() {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Home" component={HomeView} />
            <Drawer.Screen name="Profile" component={ProfileView} />
            <Drawer.Screen name="Login" component={LoginView} />
        </Drawer.Navigator>
    );
}
