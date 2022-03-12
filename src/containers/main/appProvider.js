import React, {
    createContext,
    Fragment,
    useContext,
    useEffect,
    useReducer,
    useRef,
    useState,
} from 'react';
import { NativeModules, Platform, StatusBar } from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import {
    initialWindowMetrics,
    SafeAreaProvider,
} from 'react-native-safe-area-context';

const { StatusBarManager } = NativeModules;

const AppContext = createContext();

const initialState = {};

const appReducer = (state, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

const objCheck = thing => {
    if ({}.toString.call(thing) !== '[object Object]') {
        throw '`useMergeState` only accepts objects.';
    }
    return thing;
};

export const useMergeState = (initState = {}) => {
    const [stateScreen, setState] = useState(() => objCheck(initState));

    const setStateScreen = objOrFxn => {
        setState(prevState => {
            const newState = objCheck(
                objOrFxn instanceof Function ? objOrFxn(prevState) : objOrFxn,
            );
            return { ...prevState, ...newState };
        });
    };
    return [stateScreen, setStateScreen];
};

const AppProvider = props => {
    const { children } = props;
    let refDialog = useRef();
    let refHeightStatusBar = useRef();
    const [appState, dispatch] = useReducer(appReducer, initialState);

    // if (Platform.OS === "ios") {
    //   StatusBarManager.getHeight(
    //     (response) => (refHeightStatusBar.current = response.height)
    //   );
    // } else {
    //   refHeightStatusBar.current = StatusBar.currentHeight;
    // }

    useEffect(() => {
        if (Platform.OS === 'ios') {
            StatusBarManager.getHeight(
                ({ height }) =>
                    console.log(Platform.OS, 'HeightStatusBar:', height),
                // (refHeightStatusBar.current = response.height)
            );
            KeyboardManager.setEnable(true);
        } else {
            refHeightStatusBar.current = StatusBar.currentHeight;
        }
        console.log(Platform.OS);
    }, []);

    const value = {
        refDialog,
    };

    return (
        <AppContext.Provider value={value}>
            <SafeAreaProvider
                initialMetrics={initialWindowMetrics}
                style={{ backgroundColor: 'transparent' }}
            >
                <StatusBar
                    translucent
                    backgroundColor={'transparent'}
                    barStyle={`dark-content`}
                />
                <Fragment>{children}</Fragment>
            </SafeAreaProvider>
        </AppContext.Provider>
    );
};
export default AppProvider;
export const useApp = () => useContext(AppContext);

export function withAppHook(Component) {
    return function WrappedComponent(props) {
        const myAppHooks = useApp();
        return <Component {...props} useApp={myAppHooks} />;
    };
}
