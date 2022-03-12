import AppProvider from 'containers/main/appProvider';
import AppNavigator from 'containers/navigation/appNavigator';
import React from 'react';
import { MenuProvider } from 'react-native-popup-menu';

console.disableYellowBox = true;
function App() {
    return (
        <MenuProvider>
            <AppProvider>
                <AppNavigator startScreen={'Home'} />
            </AppProvider>
        </MenuProvider>
    );
}

export default App;
